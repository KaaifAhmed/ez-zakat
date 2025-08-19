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

    console.log('Fetching exchange rates from ForexRateAPI...');

    // Fetch exchange rates with PKR as base currency
    const response = await fetch(`https://api.forexrateapi.com/v1/latest?api_key=${FOREX_API_KEY}&base=PKR&currencies=USD,EUR,GBP,SAR,AED`);
    
    if (!response.ok) {
      throw new Error(`ForexRateAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    if (!data.rates) {
      throw new Error('Invalid response format from ForexRateAPI');
    }

    // Convert rates to PKR (since we're using PKR as base, we need to invert the rates)
    const pkrRates = {
      PKR: 1,
      USD: Math.round(1 / data.rates.USD),
      EUR: Math.round(1 / data.rates.EUR), 
      GBP: Math.round(1 / data.rates.GBP),
      SAR: Math.round(1 / data.rates.SAR),
      AED: Math.round(1 / data.rates.AED),
    };

    console.log('Converted PKR rates:', pkrRates);

    return new Response(JSON.stringify({
      rates: pkrRates,
      timestamp: Date.now(),
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return fallback rates if API fails
    const fallbackRates = {
      PKR: 1,
      USD: 285,
      EUR: 310,
      GBP: 360,
      SAR: 75,
      AED: 78,
    };

    return new Response(JSON.stringify({
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