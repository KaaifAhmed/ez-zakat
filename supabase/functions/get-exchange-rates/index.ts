import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FOREX_API_KEY = Deno.env.get('FOREX_RATE_API_KEY');
    if (!FOREX_API_KEY) {
      throw new Error('FOREX_RATE_API_KEY is not set');
    }

    console.log('Fetching currency symbols and exchange rates from ForexRateAPI...');

    // Fetch all supported currency symbols
    const symbolsResponse = await fetch(`https://api.forexrateapi.com/v1/symbols?api_key=${FOREX_API_KEY}`);
    
    if (!symbolsResponse.ok) {
      throw new Error(`ForexRateAPI symbols error: ${symbolsResponse.status} ${symbolsResponse.statusText}`);
    }

    const symbolsData = await symbolsResponse.json();
    console.log('Currency symbols fetched:', Object.keys(symbolsData.symbols || {}).length, 'currencies');

    if (!symbolsData.symbols) {
      throw new Error('Invalid symbols response format from ForexRateAPI');
    }

    // Fetch exchange rates for all currencies with PKR as base
    const ratesResponse = await fetch(`https://api.forexrateapi.com/v1/latest?api_key=${FOREX_API_KEY}&base=PKR`);
    
    if (!ratesResponse.ok) {
      throw new Error(`ForexRateAPI rates error: ${ratesResponse.status} ${ratesResponse.statusText}`);
    }

    const ratesData = await ratesResponse.json();
    console.log('Raw rates response:', Object.keys(ratesData.rates || {}).length, 'rates fetched');

    if (!ratesData.rates) {
      throw new Error('Invalid rates response format from ForexRateAPI');
    }

    // Convert rates to PKR (since we're using PKR as base, we need to invert the rates)
    const pkrRates: Record<string, number> = { PKR: 1 };
    
    Object.entries(ratesData.rates).forEach(([currency, rate]) => {
      if (typeof rate === 'number' && rate > 0) {
        pkrRates[currency] = Math.round(1 / rate);
      }
    });

    console.log('Converted PKR rates for', Object.keys(pkrRates).length, 'currencies');

    return new Response(JSON.stringify({
      symbols: symbolsData.symbols,
      rates: pkrRates,
      timestamp: Date.now(),
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return fallback data if API fails
    const fallbackSymbols = {
      'USD': 'United States Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound Sterling', 
      'SAR': 'Saudi Riyal',
      'AED': 'United Arab Emirates Dirham',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'JPY': 'Japanese Yen',
      'CHF': 'Swiss Franc',
      'CNY': 'Chinese Yuan'
    };
    
    const fallbackRates = {
      PKR: 1,
      USD: 285,
      EUR: 310,
      GBP: 360,
      SAR: 75,
      AED: 78,
      CAD: 210,
      AUD: 180,
      JPY: 2,
      CHF: 320,
      CNY: 40,
    };

    return new Response(JSON.stringify({
      symbols: fallbackSymbols,
      rates: fallbackRates,
      timestamp: Date.now(),
      success: false,
      error: error.message,
      fallback: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});