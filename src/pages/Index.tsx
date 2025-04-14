
import { useEffect, useState } from "react";
import { ChevronDown, DollarSign, PieChart as PieChartIcon, TrendingUp, Wallet, Filter, ArrowRight, RefreshCw } from "lucide-react";
import { SidebarNavigation } from "@/components/sidebar/sidebar-navigation";
import { CardStat } from "@/components/ui/card-stat";
import { StockLineChart } from "@/components/charts/line-chart";
import { PortfolioAllocation } from "@/components/charts/portfolio-allocation";
import { StockCard } from "@/components/watchlist/stock-card";
import { useRealTimeStocks } from "@/hooks/useRealTimeStocks";

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Use our real-time stocks hook
  const { 
    stocks, 
    cryptoMarket, 
    fearAndGreed, 
    loading, 
    error, 
    lastUpdated, 
    refreshData 
  } = useRealTimeStocks();
  
  // Calculate total portfolio value
  const portfolioValue = {
    current: stocks.reduce((sum, stock) => sum + stock.price, 0),
    change: stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length,
    chartData: stocks[0]?.chartData || []
  };
  
  // Calculate portfolio allocation
  const portfolioAllocation = [
    { name: stocks[0]?.name || 'Stock 1', value: 42, color: '#3B82F6' },
    { name: stocks[1]?.name || 'Stock 2', value: 25, color: '#F59E0B' },
    { name: stocks[2]?.name || 'Stock 3', value: 18, color: '#8B5CF6' },
    { name: stocks[3]?.name || 'Stock 4', value: 9, color: '#10B981' },
    { name: 'Other', value: 6, color: '#9CA3AF' },
  ];
  
  // Calculate portfolio stats
  const portfolioStats = [
    { 
      name: stocks[0]?.name || 'Stock 1', 
      value: portfolioValue.current * 0.42, 
      percentage: 42.17, 
      color: '#3B82F6', 
      icon: '🔵' 
    },
    { 
      name: stocks[1]?.name || 'Stock 2', 
      value: portfolioValue.current * 0.26, 
      percentage: 25.94, 
      color: '#F59E0B', 
      icon: '🟠' 
    },
    { 
      name: stocks[2]?.name || 'Stock 3', 
      value: portfolioValue.current * 0.17, 
      percentage: 16.71, 
      color: '#8B5CF6', 
      icon: '🟣' 
    },
    { 
      name: stocks[3]?.name || 'Stock 4', 
      value: portfolioValue.current * 0.09, 
      percentage: 9.21, 
      color: '#10B981', 
      icon: '🟢' 
    }
  ];
  
  useEffect(() => {
    setMounted(true);
    
    // Listen for sidebar collapse events from the SidebarNavigation component
    const handleSidebarChange = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.collapsed === 'boolean') {
        setSidebarCollapsed(e.detail.collapsed);
      }
    };
    
    window.addEventListener('sidebar-change' as any, handleSidebarChange as any);
    
    return () => {
      window.removeEventListener('sidebar-change' as any, handleSidebarChange as any);
    };
  }, []);
  
  // Animation classes to apply after mounting
  const fadeInClass = mounted ? "opacity-100" : "opacity-0";
  
  // Format last updated time
  const formattedTime = lastUpdated ? 
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(lastUpdated) : '';
  
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNavigation />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <div className="container py-6 px-4 md:px-6 max-w-screen-2xl">
          {/* Header with real-time info and refresh button */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray mb-6">
              <div className="flex items-center gap-4">
                <span>Crypto: {cryptoMarket?.length || 0}+</span>
                <span>Exchanges: 801</span>
                <span>Market Cap: ${((cryptoMarket?.reduce((sum, coin) => sum + coin.marketCap, 0) || 0) / 1000000000000).toFixed(2)}T</span>
                <span className={cryptoMarket?.[0]?.change24h < 0 ? "text-chart-red" : "text-chart-green"}>
                  {cryptoMarket?.[0]?.change24h < 0 ? '' : '+'}
                  {cryptoMarket?.[0]?.change24h?.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>24h Vol: ${((cryptoMarket?.reduce((sum, coin) => sum + coin.volume, 0) || 0) / 1000000000).toFixed(2)}B</span>
                <span className={cryptoMarket?.[1]?.change24h < 0 ? "text-chart-red" : "text-chart-green"}>
                  {cryptoMarket?.[1]?.change24h < 0 ? '' : '+'}
                  {cryptoMarket?.[1]?.change24h?.toFixed(2)}%
                </span>
                <span>Dominance: {cryptoMarket?.[0]?.symbol || 'BTC'} {((cryptoMarket?.[0]?.marketCap || 0) / (cryptoMarket?.reduce((sum, coin) => sum + coin.marketCap, 0) || 1) * 100).toFixed(2)}%</span>
                <span>Fear & Greed: {fearAndGreed?.value || 40}/100</span>
              </div>
            </div>
          
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">My Portfolio</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${portfolioValue.current.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                  <span className={`flex items-center text-sm font-medium ${portfolioValue.change >= 0 ? 'text-chart-green' : 'text-chart-red'}`}>
                    <TrendingUp size={16} className="mr-1" />
                    {portfolioValue.change.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray">Last updated: {formattedTime}</span>
                    <button 
                      onClick={refreshData}
                      className="update-button flex items-center gap-1"
                    >
                      <RefreshCw size={14} />
                      <span>Refresh</span>
                    </button>
                  </div>
                )}
                
                <button className="crypto-selector flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <span className="flex items-center gap-1">
                    🟠 <span className="font-medium">Bitcoin</span>
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                <a href="#" className="text-purple hover:underline text-sm flex items-center">
                  View All <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 border-l-4 border-red-500 mb-6">
              {error} <span className="pulse-dot"></span> Using mock data
            </div>
          )}
          
          {/* Live indicator */}
          {!error && !loading && (
            <div className="bg-green-50 text-green-700 p-3 border-l-4 border-green-500 mb-6 flex items-center">
              <span className="pulse-dot"></span> Live data updating every minute
            </div>
          )}
          
          {/* Main dashboard content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Portfolio chart - takes 2/3 of space */}
            <div className="portfolio-card lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold neon-text-purple">Statistics</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-xs">
                    <button className="px-2 py-1 rounded bg-secondary text-gray">1D</button>
                    <button className="px-2 py-1 rounded">1W</button>
                    <button className="px-2 py-1 rounded">1M</button>
                    <button className="px-2 py-1 rounded">3M</button>
                    <button className="px-2 py-1 rounded">ALL</button>
                  </div>
                </div>
              </div>
              <StockLineChart 
                data={portfolioValue.chartData} 
                height={230} 
                showGrid={true} 
                isPositive={portfolioValue.change >= 0}
              />
            </div>
            
            {/* Portfolio stats */}
            <div className="portfolio-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold neon-text-purple">Portfolio Stats</h2>
                <a href="#" className="text-sm text-purple hover:underline">
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {portfolioStats.map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span>{asset.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.name}</p>
                        <p className="text-xs text-gray">{asset.percentage.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${asset.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second row with fear & greed and allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Fear and Greed Index */}
            <div className="portfolio-card">
              <h2 className="text-lg font-semibold mb-4 neon-text-purple">Fear and Greed</h2>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold mb-2 neon-text-yellow">
                  {fearAndGreed?.value || 56}%
                </div>
                <div 
                  className="text-lg font-medium mb-4" 
                  style={{ color: fearAndGreed?.color || '#FBBF24' }}
                >
                  {fearAndGreed?.status || 'Neutral'}
                </div>
                
                <div className="w-full h-3 bg-gradient-to-r from-chart-red via-chart-yellow to-chart-green rounded-full mb-2">
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 h-5 w-5 bg-white rounded-none border-2 border-chart-yellow shadow-md"
                      style={{ left: `${fearAndGreed?.value || 56}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between w-full text-xs text-gray">
                  <span>Index: 0%</span>
                  <span>Index: 100%</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <div className="text-center">
                    <p className="text-xs text-gray mb-1">Yesterday</p>
                    <p className="font-medium text-chart-yellow">
                      {fearAndGreed?.today?.value || 'Neutral'} - {fearAndGreed?.today?.point || 42}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray mb-1">Last Month</p>
                    <p className="font-medium text-chart-red">
                      {fearAndGreed?.lastMonth?.value || 'Fear'} - {fearAndGreed?.lastMonth?.point || 28}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio allocation chart */}
            <div className="portfolio-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold neon-text-purple">Allocation</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray">By Sector</span>
                  <ChevronDown size={16} />
                </div>
              </div>
              <PortfolioAllocation data={portfolioAllocation} />
            </div>
            
            <div className="portfolio-card flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold neon-text-purple">Quick Transfer</h2>
              </div>
              
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">🔵</div>
                    <div>
                      <p className="font-medium text-sm">{stocks[0]?.name || 'PayPal USD'}</p>
                      <p className="text-xs text-gray">{stocks[0]?.symbol || 'PYUSD'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(portfolioValue.current * 0.42).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">🟠</div>
                    <div>
                      <p className="font-medium text-sm">{stocks[1]?.name || 'Bitcoin'}</p>
                      <p className="text-xs text-gray">{stocks[1]?.symbol || 'BTC'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(portfolioValue.current * 0.26).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
                <button className="bg-purple hover:bg-purple-dark text-white rounded-lg py-2 font-medium">Send</button>
                <button className="bg-secondary hover:bg-gray-200 rounded-lg py-2 font-medium">Request</button>
              </div>
            </div>
          </div>
          
          {/* Crypto Market Table */}
          <section className="mb-8 transition-all duration-500 delay-200 ${fadeInClass}">
            <div className="portfolio-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold neon-text-purple">Crypto Market</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search crypto..."
                      className="bg-secondary rounded-lg pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple w-48"
                    />
                    <div className="absolute left-2.5 top-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#8E9196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <button className="bg-secondary rounded-lg p-1.5 hover:bg-gray-200">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="crypto-table">
                  <thead>
                    <tr>
                      <th className="w-12 text-center">#</th>
                      <th>NAME</th>
                      <th>PRICE</th>
                      <th>1H %</th>
                      <th>24H %</th>
                      <th>MARKET CAP</th>
                      <th>VOLUME (24H)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoMarket?.map((crypto, index) => (
                      <tr key={crypto.symbol} className="text-sm">
                        <td className="text-center font-medium text-gray">{index + 1}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{crypto.icon}</span>
                            <div>
                              <p className="font-medium">{crypto.name}</p>
                              <p className="text-xs text-gray">{crypto.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="font-medium">
                          ${crypto.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </td>
                        <td className={crypto.change1h >= 0 ? "text-chart-green" : "text-chart-red"}>
                          <div className="flex items-center">
                            {crypto.change1h >= 0 ? "+" : ""}{crypto.change1h.toFixed(2)}%
                          </div>
                        </td>
                        <td className={crypto.change24h >= 0 ? "text-chart-green" : "text-chart-red"}>
                          <div className="flex items-center">
                            {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                          </div>
                        </td>
                        <td>
                          ${(crypto.marketCap / 1000000000).toFixed(2)}B
                        </td>
                        <td>
                          ${(crypto.volume / 1000000000).toFixed(2)}B
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center mt-3">
                  <button className="text-purple text-sm hover:underline">
                    See more {cryptoMarket?.length || 4} cryptos
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
