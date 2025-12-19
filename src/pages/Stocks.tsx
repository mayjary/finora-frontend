import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
}

const mockStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 2.34, changePercent: 1.33, volume: "52.3M", marketCap: "2.79T" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: -1.23, changePercent: -0.32, volume: "18.7M", marketCap: "2.81T" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: 3.45, changePercent: 2.49, volume: "24.1M", marketCap: "1.78T" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 1.87, changePercent: 1.06, volume: "31.2M", marketCap: "1.86T" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.22, change: 12.45, changePercent: 2.58, volume: "42.8M", marketCap: "1.22T" },
  { symbol: "META", name: "Meta Platforms", price: 505.95, change: -3.21, changePercent: -0.63, volume: "14.5M", marketCap: "1.29T" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.48, change: 5.67, changePercent: 2.33, volume: "98.4M", marketCap: "790B" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 195.82, change: 0.89, changePercent: 0.46, volume: "8.2M", marketCap: "564B" },
  { symbol: "V", name: "Visa Inc.", price: 279.45, change: -0.78, changePercent: -0.28, volume: "5.1M", marketCap: "574B" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.32, change: 1.12, changePercent: 0.72, volume: "6.8M", marketCap: "376B" },
];

const Stocks = () => {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const randomChange = (Math.random() - 0.5) * 2;
          const newPrice = Math.max(0, stock.price + randomChange);
          const newChange = stock.change + randomChange;
          const newChangePercent = (newChange / stock.price) * 100;
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
            changePercent: parseFloat(newChangePercent.toFixed(2)),
          };
        })
      );
      setLastUpdated(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(
    stock =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stocks</h1>
          <p className="text-muted-foreground">Real-time stock market data</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStocks.map((stock) => (
          <Card key={stock.symbol} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold">{stock.symbol}</CardTitle>
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">{stock.name}</p>
              </div>
              <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                <span className={stock.change >= 0 ? "text-green-500" : "text-destructive"}>
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                <span>Vol: {stock.volume}</span>
                <span>MCap: {stock.marketCap}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No stocks found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Stocks;
