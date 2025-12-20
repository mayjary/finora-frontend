import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const format = (v: number) => v.toFixed(2);
const formatPct = (v: number) => `${v.toFixed(2)}%`;

const Stocks = () => {
  const [data, setData] = useState<{
    indexes: Stock[];
    stocks: Stock[];
    crypto: Stock[];
  }>({ indexes: [], stocks: [], crypto: [] });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5001/api/market/quotes");
    const json = await res.json();
    setData(json);
    setUpdatedAt(new Date(json.updatedAt));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 60000);
    return () => clearInterval(i);
  }, []);

  const renderSection = (title: string, items: Stock[]) => (
    <>
      <h2 className="text-xl font-semibold mt-8">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((s) =>
            s.symbol.toLowerCase().includes(search.toLowerCase())
          )
          .map((s) => (
            <Card key={s.symbol}>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>{s.symbol}</CardTitle>
                <Badge
                  variant={s.change >= 0 ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {s.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPct(s.changePercent)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${format(s.price)}
                </div>
                <div
                  className={
                    s.change >= 0
                      ? "text-green-500"
                      : "text-destructive"
                  }
                >
                  {s.change >= 0 ? "+" : ""}
                  {format(s.change)}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Market</h1>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      <Input
        placeholder="Search symbols..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {updatedAt && (
        <p className="text-sm text-muted-foreground">
          Updated at {updatedAt.toLocaleTimeString()}
        </p>
      )}

      {renderSection("Indexes", data.indexes)}
      {renderSection("Stocks", data.stocks)}
      {renderSection("Crypto", data.crypto)}
    </div>
  );
};

export default Stocks;
