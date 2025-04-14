
import { useState, useEffect } from 'react';
import { StockData, getFullStockData, getMockStockData, fetchCryptoMarketData, getMockCryptoMarketData, fetchFearAndGreedIndex, getMockFearAndGreedData } from '../services/stockService';
import { toast } from "@/components/ui/use-toast";

export interface PortfolioState {
  stocks: StockData[];
  cryptoMarket: any[];
  fearAndGreed: any;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useRealTimeStocks(symbols: string[] = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'], refreshInterval = 60000) {
  const [portfolioState, setPortfolioState] = useState<PortfolioState>({
    stocks: [],
    cryptoMarket: [],
    fearAndGreed: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchAllData = async () => {
    setPortfolioState(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch stock data for all symbols
      const stockPromises = symbols.map(symbol => getFullStockData(symbol));
      let stockResults = await Promise.all(stockPromises);
      
      // If any API calls failed, use mock data
      const anyNullResults = stockResults.some(result => result === null);
      if (anyNullResults) {
        console.log("Some API calls failed. Using mock data.");
        toast({
          title: "API Rate Limited",
          description: "Using mock data instead. Real API has usage limits.",
        });
        stockResults = getMockStockData();
      }
      
      // Fetch crypto market data
      const cryptoData = await fetchCryptoMarketData() || getMockCryptoMarketData();
      
      // Fetch fear and greed index
      const fearAndGreedData = await fetchFearAndGreedIndex() || getMockFearAndGreedData();
      
      setPortfolioState({
        stocks: stockResults as StockData[],
        cryptoMarket: cryptoData,
        fearAndGreed: fearAndGreedData,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      
      // If API fails, use mock data
      setPortfolioState({
        stocks: getMockStockData(),
        cryptoMarket: getMockCryptoMarketData(),
        fearAndGreed: getMockFearAndGreedData(),
        loading: false,
        error: "Failed to fetch real-time data. Using mock data.",
        lastUpdated: new Date()
      });
      
      toast({
        title: "Error fetching data",
        description: "Using mock data instead. Please try again later.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Set up interval for real-time updates
    const intervalId = setInterval(fetchAllData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  // Function to manually refresh data
  const refreshData = () => {
    fetchAllData();
  };

  return {
    ...portfolioState,
    refreshData
  };
}
