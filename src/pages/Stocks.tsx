import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stock {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
}

const format = (v: number | undefined | null) =>
  v != null && isFinite(v) ? v.toFixed(2) : "0.00";
const formatPct = (v: number | undefined | null) => {
  if (v == null || !isFinite(v)) return "0.00%";
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
};

const getTVSymbol = (symbol: string) => {
  if (symbol === "BTC") return "BINANCE:BTCUSDT";
  if (symbol === "ETH") return "BINANCE:ETHUSDT";

  if (["SPY", "QQQ", "DIA"].includes(symbol)) {
    return `AMEX:${symbol}`;
  }

  return `NASDAQ:${symbol}`;
};

// ---------------------------------------------------------------------------
// TradingView chart — isolated component so it mounts/unmounts cleanly
// ---------------------------------------------------------------------------
const TradingViewChart = ({ symbol }: { symbol: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Give the DOM a tick to settle before injecting the widget
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      // Clear any previous widget HTML
      containerRef.current.innerHTML = "";

      const widgetDiv = document.createElement("div");
      widgetDiv.id = `tv_${symbol}_${Date.now()}`;
      widgetDiv.style.height = "100%";
      widgetDiv.style.width = "100%";
      containerRef.current.appendChild(widgetDiv);

      const initWidget = () => {
        if (!(window as any).TradingView) return;
        new (window as any).TradingView.widget({
          container_id: widgetDiv.id,
          symbol: getTVSymbol(symbol),
          interval: "D",
          theme: "dark",
          style: "1",
          locale: "en",
          autosize: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
        });
      };

      // Script already loaded — just init
      if ((window as any).TradingView) {
        initWidget();
        return;
      }

      // Script not yet loaded — inject it once then init on load
      if (!document.getElementById("tv-script")) {
        const script = document.createElement("script");
        script.id = "tv-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      } else {
        // Script tag exists but hasn't fired onload yet — poll briefly
        const poll = setInterval(() => {
          if ((window as any).TradingView) {
            clearInterval(poll);
            initWidget();
          }
        }, 100);
        // Give up after 8 s to avoid infinite polling
        setTimeout(() => clearInterval(poll), 8000);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol]);

  return <div ref={containerRef} className="h-full w-full rounded-xl overflow-hidden" />;
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
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
    try {
      const res = await fetch("http://localhost:5001/api/market/quotes");
      const json = await res.json();
      setData(json);
      if (json.updatedAt) setUpdatedAt(new Date(json.updatedAt));
    } catch (err) {
      console.error("Failed to fetch market data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 60000);
    return () => clearInterval(i);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSymbol(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderSection = (title: string, items: Stock[]) => {
    const filtered = items.filter((s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length === 0) return null;

    return (
      <div key={title}>
        <h2 className="text-xl font-semibold mt-8 mb-4">{title}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card
              key={s.symbol}
              onClick={() => setSelectedSymbol(s.symbol)}
              className="cursor-pointer hover:shadow-xl transition duration-300 bg-black/60 backdrop-blur-lg border border-white/10"
            >
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{s.symbol}</CardTitle>
                <Badge
                  variant={(s.change ?? 0) >= 0 ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {(s.change ?? 0) >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPct(s.changePercent)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${format(s.price)}</div>
                <div className={(s.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}>
                  {(s.change ?? 0) >= 0 ? "+" : ""}
                  {format(s.change)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Market</h1>
          {updatedAt && (
            <p className="text-sm text-muted-foreground mt-1">
              Updated at {updatedAt.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" size="icon">
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search symbols..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Sections */}
      {renderSection("Indexes", data.indexes)}
      {renderSection("Stocks", data.stocks)}
      {renderSection("Crypto", data.crypto)}

      {/* TradingView Modal */}
      {selectedSymbol && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // Close if clicking the backdrop, not the chart panel
            if (e.target === e.currentTarget) setSelectedSymbol(null);
          }}
        >
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] w-[95%] h-[85%] rounded-2xl p-4 relative shadow-2xl border border-white/10 flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span className="text-white font-semibold text-lg">
                {selectedSymbol} — {getTVSymbol(selectedSymbol)}
              </span>
              <button
                onClick={() => setSelectedSymbol(null)}
                className="text-white/70 hover:text-white text-xl leading-none transition"
                aria-label="Close chart"
              >
                ✕
              </button>
            </div>

            {/* Chart fills remaining height */}
            <div className="flex-1 min-h-0">
              <TradingViewChart symbol={selectedSymbol} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stocks;