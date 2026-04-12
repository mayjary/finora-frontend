import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, DollarSign, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ValuationMetric {
  label: string;
  value: string;
  benchmark: string;
  stockValue: number | null;
}

interface FMPRatios {
  priceToEarningsRatioTTM?: number;
  priceToBookRatioTTM?: number;
  enterpriseValueMultipleTTM?: number;
  priceToSalesRatioTTM?: number;
}

// ---------------------------------------------------------------------------
// Constants — industry benchmark averages (S&P 500 broad averages as baseline)
// ---------------------------------------------------------------------------
const INDUSTRY_BENCHMARKS = {
  pe: 24.2,
  pb: 38.7,
  evEbitda: 16.4,
  ps: 5.8,
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const fmt = (n: number | null | undefined, decimals = 1): string =>
  n != null && isFinite(n) ? n.toFixed(decimals) : "—";

const FMP_API_KEY = "LmJD1wKCFeVKZedU064yvWqiDxponnvu"; // 🔑 Replace with your key from https://financialmodelingprep.com/developer/docs/

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Valuation = () => {
  const { toast } = useToast();

  // --- DCF state (unchanged) ---
  const [dcfResult, setDcfResult] = useState<number | null>(null);

  // --- Multiples state ---
  const [multiplesSymbol, setMultiplesSymbol] = useState("");
  const [multiplesLoading, setMultiplesLoading] = useState(false);
  const [fetchedSymbol, setFetchedSymbol] = useState<string | null>(null);
  const [valuationMetrics, setValuationMetrics] = useState<ValuationMetric[]>([
    { label: "P/E Ratio",     value: "—", benchmark: `Industry: ${INDUSTRY_BENCHMARKS.pe}`,      stockValue: null },
    { label: "P/B Ratio",     value: "—", benchmark: `Industry: ${INDUSTRY_BENCHMARKS.pb}`,      stockValue: null },
    { label: "EV/EBITDA",     value: "—", benchmark: `Industry: ${INDUSTRY_BENCHMARKS.evEbitda}`, stockValue: null },
    { label: "Price/Sales",   value: "—", benchmark: `Industry: ${INDUSTRY_BENCHMARKS.ps}`,      stockValue: null },
  ]);

  // --- DDM state ---
  const [ddmDividend, setDdmDividend] = useState("");
  const [ddmGrowth, setDdmGrowth] = useState("");
  const [ddmReturn, setDdmReturn] = useState("");
  const [ddmResult, setDdmResult] = useState<number | null>(null);
  const [ddmError, setDdmError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // DCF handler (original, unchanged)
  // -------------------------------------------------------------------------
  const handleCalculateDCF = () => {
    setDcfResult(185.50);
    toast({
      title: "Calculation Complete",
      description: "DCF valuation has been calculated successfully.",
    });
  };

  // -------------------------------------------------------------------------
  // Multiples — fetch from FMP
  // -------------------------------------------------------------------------
  const handleFetchMultiples = async () => {
    const symbol = multiplesSymbol.trim().toUpperCase();
    if (!symbol) {
      toast({ title: "Enter a symbol", description: "Type a stock ticker first.", variant: "destructive" });
      return;
    }

    setMultiplesLoading(true);
    setFetchedSymbol(null);

    try {
      // FMP key-metrics-ttm endpoint returns TTM ratios
      const url = `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${symbol}&apikey=${FMP_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FMPRatios[] = await res.json();

      if (!data || data.length === 0) {
        throw new Error("No data returned — check the ticker symbol.");
      }

      const r = data[0];

setValuationMetrics([
  {
    label: "P/E Ratio",
    value: fmt(r.priceToEarningsRatioTTM),
    benchmark: `Industry: ${INDUSTRY_BENCHMARKS.pe}`,
    stockValue: r.priceToEarningsRatioTTM,
  },
  {
    label: "P/B Ratio",
    value: fmt(r.priceToBookRatioTTM),
    benchmark: `Industry: ${INDUSTRY_BENCHMARKS.pb}`,
    stockValue: r.priceToBookRatioTTM,
  },
  {
    label: "EV/EBITDA",
    value: fmt(r.enterpriseValueMultipleTTM),
    benchmark: `Industry: ${INDUSTRY_BENCHMARKS.evEbitda}`,
    stockValue: r.enterpriseValueMultipleTTM,
  },
  {
    label: "Price/Sales",
    value: fmt(r.priceToSalesRatioTTM),
    benchmark: `Industry: ${INDUSTRY_BENCHMARKS.ps}`,
    stockValue: r.priceToSalesRatioTTM,
  },
]);

setFetchedSymbol(symbol);

toast({
  title: `Loaded ${symbol}`,
  description: "Valuation multiples fetched successfully.",
});

      const colorClass = (stock: number | null, bench: number): string => {
        if (stock === null) return "";
        return stock < bench ? "text-green-500" : "text-red-400";
      };

      setValuationMetrics([
        {
          label: "P/E Ratio",
          value: fmt(r.priceToEarningsRatioTTM),
          benchmark: `Industry: ${INDUSTRY_BENCHMARKS.pe}`,
          stockValue: r.priceToEarningsRatioTTM,
        },
        {
          label: "P/B Ratio",
          value: fmt(r.priceToBookRatioTTM),
          benchmark: `Industry: ${INDUSTRY_BENCHMARKS.pb}`,
          stockValue: r.priceToBookRatioTTM,
        },
        {
          label: "EV/EBITDA",
          value: fmt(r.enterpriseValueMultipleTTM),
          benchmark: `Industry: ${INDUSTRY_BENCHMARKS.evEbitda}`,
          stockValue: r.enterpriseValueMultipleTTM,
        },
        {
          label: "Price/Sales",
          value: fmt(r.priceToSalesRatioTTM),
          benchmark: `Industry: ${INDUSTRY_BENCHMARKS.ps}`,
          stockValue: r.priceToSalesRatioTTM,
        },
      ]);

      setFetchedSymbol(symbol);
      toast({ title: `Loaded ${symbol}`, description: "Valuation multiples fetched successfully." });
    } catch (err: any) {
      toast({
        title: "Fetch failed",
        description: err.message ?? "Could not load data. Check your API key and ticker.",
        variant: "destructive",
      });
    } finally {
      setMultiplesLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // DDM — Gordon Growth Model: P = D1 / (r - g)
  // -------------------------------------------------------------------------
  const handleCalculateDDM = () => {
    setDdmError(null);
    setDdmResult(null);

    const D0 = parseFloat(ddmDividend);
    const g  = parseFloat(ddmGrowth)  / 100;
    const r  = parseFloat(ddmReturn)  / 100;

    if (isNaN(D0) || isNaN(g) || isNaN(r)) {
      setDdmError("Please fill in all three fields with valid numbers.");
      return;
    }
    if (D0 <= 0) {
      setDdmError("Annual dividend must be greater than zero.");
      return;
    }
    if (r <= g) {
      setDdmError("Required return must be greater than the dividend growth rate.");
      return;
    }

    // D1 = D0 × (1 + g)
    const D1 = D0 * (1 + g);
    const price = D1 / (r - g);
    setDdmResult(Math.round(price * 100) / 100);

    toast({
      title: "DDM Calculated",
      description: `Intrinsic value: $${price.toFixed(2)} per share`,
    });
  };

  // -------------------------------------------------------------------------
  // Colour helper for multiples comparison
  // -------------------------------------------------------------------------
  const valueColor = (stock: number | null, bench: number): string => {
    if (stock === null) return "text-primary";
    return stock < bench ? "text-green-500" : "text-red-400";
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Valuation Tools</h1>
        <p className="text-muted-foreground">Calculate intrinsic value and analyze company metrics</p>
      </div>

      <Tabs defaultValue="dcf" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dcf">DCF Model</TabsTrigger>
          <TabsTrigger value="multiples">Multiples</TabsTrigger>
          <TabsTrigger value="dividend">Dividend Discount</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------ */}
        {/* DCF — unchanged                                                     */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="dcf" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  DCF Calculator
                </CardTitle>
                <CardDescription>Discounted Cash Flow valuation model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input id="symbol" placeholder="e.g., AAPL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fcf">Free Cash Flow (millions)</Label>
                  <Input id="fcf" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="growth">Growth Rate (%)</Label>
                  <Input id="growth" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Rate (%)</Label>
                  <Input id="discount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terminal">Terminal Growth Rate (%)</Label>
                  <Input id="terminal" type="number" placeholder="0" />
                </div>
                <Button onClick={handleCalculateDCF} className="w-full">
                  Calculate Fair Value
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Valuation Result</CardTitle>
                <CardDescription>Estimated intrinsic value per share</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {dcfResult ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">Fair Value</div>
                      <div className="text-4xl font-bold text-primary">${dcfResult}</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="text-muted-foreground">Current Price</span>
                        <span className="font-medium">$182.50</span>
                      </div>
                      <div className="flex justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-muted-foreground">Upside Potential</span>
                        <span className="font-medium text-success">+1.64%</span>
                      </div>
                      <div className="flex justify-between p-3 bg-primary/10 rounded-lg">
                        <span className="text-muted-foreground">Recommendation</span>
                        <span className="font-medium text-primary">Hold</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Enter values and calculate to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* Multiples — now with live ticker lookup                             */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="multiples" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Valuation Multiples
              </CardTitle>
              <CardDescription>
                Compare live ratios for any stock against broad market benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Ticker input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ticker, e.g. AAPL"
                  value={multiplesSymbol}
                  onChange={(e) => setMultiplesSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchMultiples()}
                  className="flex-1"
                />
                <Button onClick={handleFetchMultiples} disabled={multiplesLoading} className="shrink-0">
                  {multiplesLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Search className="h-4 w-4" />}
                  <span className="ml-2">{multiplesLoading ? "Loading…" : "Fetch"}</span>
                </Button>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>Below industry (cheaper)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Above industry (pricier)</span>
              </div>

              {/* Metrics table */}
              <div className="space-y-3">
                {valuationMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{metric.label}</div>
                      <div className="text-sm text-muted-foreground">{metric.benchmark}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          fetchedSymbol
                            ? valueColor(metric.stockValue, parseFloat(metric.benchmark.replace("Industry: ", "")))
                            : "text-primary"
                        }`}
                      >
                        {metric.value}
                      </div>
                      {fetchedSymbol && (
                        <div className="text-xs text-muted-foreground mt-0.5">{fetchedSymbol}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* API note */}
              <p className="text-xs text-muted-foreground pt-1">
                Data via Financial Modeling Prep (TTM)
                
               
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* Dividend Discount Model — Gordon Growth Model, now working          */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="dividend" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Dividend Discount Model</CardTitle>
                <CardDescription>
                  Gordon Growth Model — P = D₁ / (r − g)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dividend">Annual Dividend per Share (D₀)</Label>
                  <Input
                    id="dividend"
                    type="number"
                    placeholder="e.g. 0.96"
                    value={ddmDividend}
                    onChange={(e) => setDdmDividend(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="div-growth">Dividend Growth Rate, g (%)</Label>
                  <Input
                    id="div-growth"
                    type="number"
                    placeholder="e.g. 5"
                    value={ddmGrowth}
                    onChange={(e) => setDdmGrowth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="required-return">Required Rate of Return, r (%)</Label>
                  <Input
                    id="required-return"
                    type="number"
                    placeholder="e.g. 10"
                    value={ddmReturn}
                    onChange={(e) => setDdmReturn(e.target.value)}
                  />
                </div>

                {ddmError && (
                  <p className="text-sm text-red-400">{ddmError}</p>
                )}

                <Button className="w-full" onClick={handleCalculateDDM}>
                  Calculate Value
                </Button>
              </CardContent>
            </Card>

            {/* Result card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>DDM Result</CardTitle>
                <CardDescription>Intrinsic value based on future dividends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {ddmResult !== null ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">Intrinsic Value (P)</div>
                      <div className="text-4xl font-bold text-primary">${ddmResult.toFixed(2)}</div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="text-muted-foreground">Next Dividend D₁</span>
                        <span className="font-medium">
                          ${(parseFloat(ddmDividend) * (1 + parseFloat(ddmGrowth) / 100)).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="text-muted-foreground">Spread (r − g)</span>
                        <span className="font-medium">
                          {(parseFloat(ddmReturn) - parseFloat(ddmGrowth)).toFixed(2)}%
                        </span>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg text-xs text-muted-foreground">
                        The DDM assumes constant perpetual dividend growth. It works best for mature,
                        dividend-paying companies with stable payout histories.
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Enter values to calculate intrinsic value</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Valuation;