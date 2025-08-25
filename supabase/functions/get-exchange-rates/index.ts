import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // 1. INITIALIZE SUPABASE CLIENT
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    // 2. CHECK THE CACHE FIRST
    console.log(`Checking cache for date: ${today}`);
    const { data: cachedData, error: cacheError } = await supabaseClient.from('daily_currency_rates').select('data').gte('created_at', `${today}T00:00:00.000Z`).lte('created_at', `${today}T23:59:59.999Z`).single();
    if (cacheError && cacheError.code !== 'PGRST116') {
      // PGRST116 means "No rows found", which is not a real error for us here.
      console.error("Error reading cache:", cacheError);
    }
    // 3. CACHE HIT: If data for today exists, return it
    if (cachedData) {
      console.log("Cache hit! Returning data from database.");
      return new Response(JSON.stringify({
        ...cachedData.data,
        source: 'cache'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 4. CACHE MISS: If we reach here, no data for today was found
    console.log("Cache miss. Fetching from external API.");
    const FOREX_API_KEY = Deno.env.get('FOREX_RATE_API_KEY');
    if (!FOREX_API_KEY) throw new Error('FOREX_RATE_API_KEY is not set');
    console.log('Fetching currency symbols and exchange rates from ForexRateAPI...');
    // Fetch symbols and rates (your existing logic)
    const symbolsResponse = await fetch(`https://api.forexrateapi.com/v1/symbols?api_key=${FOREX_API_KEY}`);
    if (!symbolsResponse.ok) throw new Error(`ForexRateAPI symbols error: ${symbolsResponse.status}`);
    const symbolsData = await symbolsResponse.json();
    if (!symbolsData.symbols) throw new Error('Invalid symbols response format');
    const ratesResponse = await fetch(`https://api.forexrateapi.com/v1/latest?api_key=${FOREX_API_KEY}&base=PKR`);
    if (!ratesResponse.ok) throw new Error(`ForexRateAPI rates error: ${ratesResponse.status}`);
    const ratesData = await ratesResponse.json();
    if (!ratesData.rates) throw new Error('Invalid rates response format');
    // Process rates (your existing logic)
    const pkrRates = {
      PKR: 1
    };
    Object.entries(ratesData.rates).forEach(([currency, rate])=>{
      if (typeof rate === 'number' && rate > 0) {
        pkrRates[currency] = 1 / rate; // No rounding here to maintain precision
      }
    });
    const finalData = {
      symbols: symbolsData.symbols,
      rates: pkrRates,
      timestamp: Date.now(),
      success: true
    };
    // 5. STORE THE NEW DATA IN THE CACHE
    console.log("Storing new rates in the database.");
    // First, clear any old records
    await supabaseClient.from('daily_currency_rates').delete().neq('id', -1); // Deletes all rows
    // Then, insert the new record
    const { error: insertError } = await supabaseClient.from('daily_currency_rates').insert({
      data: finalData
    });
    if (insertError) {
      console.error("Error saving to cache:", insertError);
    }
    // 6. RETURN THE NEW DATA
    return new Response(JSON.stringify({
      ...finalData,
      source: 'api'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Critical error in function:', error);
    // Fallback logic remains the same
    const fallbackSymbols = {
      'USD': 'United States Dollar'
    };
    const fallbackRates = {
      PKR: 1,
      USD: 285
    };
    return new Response(JSON.stringify({
      symbols: fallbackSymbols,
      rates: fallbackRates,
      timestamp: Date.now(),
      success: false,
      error: error.message,
      fallback: true
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
