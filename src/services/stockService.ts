
import { toast } from "@/components/ui/use-toast";

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: Array<{ name: string; value: number }>;
  marketCap?: number;
  volume?: number;
}

const API_KEY = "2WR66SEPY1NL361B"; // Free Alpha Vantage API key (limited requests)

// Fetch real-time stock data
export async function fetchStockQuote(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note'] || !data['Global Quote']) {
      console.error("API Error:", data);
      return null;
    }
    
    const quote = data['Global Quote'];
    
    return {
      symbol,
      name: getStockName(symbol),
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      chartData: [] // Will be filled by historical data
    };
  } catch (error) {
    console.error("Failed to fetch stock quote:", error);
    return null;
  }
}

// Fetch historical data for charts
export async function fetchStockHistorical(symbol: string): Promise<Array<{ name: string; value: number }> | null> {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note'] || !data['Time Series (Daily)']) {
      console.error("API Error:", data);
      return null;
    }
    
    const timeSeries = data['Time Series (Daily)'];
    
    return Object.keys(timeSeries).slice(0, 30).reverse().map(date => ({
      name: date.slice(5), // Format: MM-DD
      value: parseFloat(timeSeries[date]['4. close'])
    }));
  } catch (error) {
    console.error("Failed to fetch historical data:", error);
    return null;
  }
}

// Get full stock data with historical charts
export async function getFullStockData(symbol: string): Promise<StockData | null> {
  try {
    const quote = await fetchStockQuote(symbol);
    if (!quote) return null;
    
    const historical = await fetchStockHistorical(symbol);
    if (historical) {
      quote.chartData = historical;
    }
    
    return quote;
  } catch (error) {
    console.error("Failed to get full stock data:", error);
    return null;
  }
}

// Get stock name (would normally come from API)
function getStockName(symbol: string): string {
  const stockNames: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'PYUSD': 'PayPal USD',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'DOGE': 'Dogecoin',
  };
  
  return stockNames[symbol] || `${symbol} Stock`;
}

// Mock data for when API limits are reached
export function getMockStockData(): StockData[] {
  return [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 182.63,
      change: 1.29,
      changePercent: 0.72,
      chartData: Array(24).fill(0).map((_, i) => ({
        name: `${i}h`,
        value: 180 + Math.sin(i/5) * 5 + (i * 0.2)
      }))
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 417.23,
      change: -2.36,
      changePercent: -0.51,
      chartData: Array(24).fill(0).map((_, i) => ({
        name: `${i}h`,
        value: 415 + Math.sin(i/4) * 8 - (i * 0.1)
      }))
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 243.78,
      change: 5.42,
      changePercent: 2.18,
      chartData: Array(24).fill(0).map((_, i) => ({
        name: `${i}h`,
        value: 235 + Math.cos(i/3) * 10 + (i * 0.4)
      }))
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 182.63,
      change: 1.29,
      changePercent: 0.72,
      chartData: Array(24).fill(0).map((_, i) => ({
        name: `${i}h`,
        value: 180 + Math.sin(i/5) * 5 + (i * 0.2)
      }))
    }
  ];
}

// Function to fetch crypto market data
export async function fetchCryptoMarketData(): Promise<any[] | null> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h');
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API Error:", data);
      toast({
        title: "API Rate Limited",
        description: "Using mock data instead. Real API has usage limits.",
        variant: "destructive"
      });
      return null;
    }
    
    return data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change1h: coin.price_change_percentage_1h_in_currency,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      icon: getCryptoIcon(coin.symbol)
    }));
  } catch (error) {
    console.error("Failed to fetch crypto market data:", error);
    return null;
  }
}

// Get crypto icon
function getCryptoIcon(symbol: string): string {
  const icons: Record<string, string> = {
    'btc': '🟠',
    'eth': '🟣',
    'usdt': '🟢',
    'bnb': '🟡',
    'xrp': '🔵',
    'ada': '🔵',
    'doge': '🟡',
    'dot': '⚫',
    'usdc': '🔵',
    'sol': '🟣',
  };
  
  return icons[symbol.toLowerCase()] || '💰';
}

// Get mock crypto market data
export function getMockCryptoMarketData() {
  return [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 59214.92,
      change1h: 1.29,
      change24h: -1.98,
      marketCap: 1141718303811,
      volume: 45773993811,
      icon: '🟠'
    },
    {
      name: 'PayPal USD',
      symbol: 'PYUSD',
      price: 6374.95,
      change1h: -1.36,
      change24h: 1.23,
      marketCap: 506660997229,
      volume: 14239863454,
      icon: '🔵'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3214.34,
      change1h: 0.51,
      change24h: 0.81,
      marketCap: 510550158135,
      volume: 14239863454,
      icon: '🟣'
    },
    {
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0.1214,
      change1h: 1.29,
      change24h: 3.21,
      marketCap: 15652165890,
      volume: 1024865456,
      icon: '🟡'
    }
  ];
}

// Get Fear and Greed Index data
export async function fetchFearAndGreedIndex(): Promise<any | null> {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    
    if (!data.data || !data.data[0]) {
      console.error("API Error:", data);
      return null;
    }
    
    const fgData = data.data[0];
    const value = parseInt(fgData.value);
    let status = fgData.value_classification;
    let color = '#FBBF24';
    
    if (value <= 25) {
      status = 'Extreme Fear';
      color = '#EF4444';
    } else if (value <= 40) {
      status = 'Fear';
      color = '#F97316';
    } else if (value <= 60) {
      status = 'Neutral';
      color = '#FBBF24';
    } else if (value <= 80) {
      status = 'Greed';
      color = '#22C55E';
    } else {
      status = 'Extreme Greed';
      color = '#15803D';
    }
    
    return {
      value,
      status,
      color,
      today: { value: status, point: value },
      lastMonth: { value: 'Fear', point: 28 } // This would come from historical API data
    };
  } catch (error) {
    console.error("Failed to fetch fear and greed index:", error);
    return null;
  }
}

// Get mock fear and greed data
export function getMockFearAndGreedData() {
  return {
    value: 56,
    status: 'Neutral',
    color: '#FBBF24',
    today: { value: 'Neutral', point: 42 },
    lastMonth: { value: 'Fear', point: 28 }
  };
}
