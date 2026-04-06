import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
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
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

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

  // 🔥 Load TradingView when modal opens
  useEffect(() => {
    if (!selectedSymbol) return;

    const existingScript = document.getElementById("tv-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "tv-script";
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => createWidget();
    } else {
      createWidget();
    }

    function createWidget() {
      if (!(window as any).TradingView) return;

      new (window as any).TradingView.widget({
        container_id: "tradingview_chart",
        symbol: getTVSymbol(selectedSymbol),
        interval: "D",
        theme: "dark",
        style: "1",
        locale: "en",
        autosize: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
      });
    }

    return () => {
      const container = document.getElementById("tradingview_chart");
      if (container) container.innerHTML = "";
    };
  }, [selectedSymbol]);

  const getTVSymbol = (symbol: string) => {
    if (symbol === "BTC") return "BINANCE:BTCUSDT";
    if (symbol === "ETH") return "BINANCE:ETHUSDT";
    return `NASDAQ:${symbol}`;
  };

  const renderSection = (title: string, items: Stock[]) => (
    <>
      <h2 className="text-xl font-semibold mt-8">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((s) =>
            s.symbol.toLowerCase().includes(search.toLowerCase())
          )
          .map((s) => (
            <Card
              key={s.symbol}
              onClick={() => setSelectedSymbol(s.symbol)}
              className="cursor-pointer hover:shadow-xl transition duration-300 bg-black/60 backdrop-blur-lg border border-white/10"
            >
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
                      : "text-red-500"
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

      {/* 🔥 Modal */}
      {selectedSymbol && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] w-[95%] h-[85%] rounded-2xl p-4 relative shadow-2xl border border-white/10">
            
            <button
              onClick={() => setSelectedSymbol(null)}
              className="absolute top-4 right-4 text-white text-lg"
            >
              ✕
            </button>

            <div id="tradingview_chart" className="h-full w-full rounded-xl overflow-hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stocks;