import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Brain,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";

type IndicatorMap = {
  [key: string]: {
    value: number;
    signal: string;
  };
};

const CRYPTO_SYMBOLS = ["BTC", "ETH", "SOL", "ADA", "XRP", "DOGE"];

const getMarketType = (symbol: string) => {
  if (CRYPTO_SYMBOLS.includes(symbol.toUpperCase())) {
    return "CRYPTO";
  }
  return "EQUITY";
};



const ChartAnalyzer = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1D");
  const [loading, setLoading] = useState(false);

  const [indicators, setIndicators] = useState<IndicatorMap | null>(null);
  const [patterns, setPatterns] = useState<Record<string, boolean>>({});
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  const marketType = getMarketType(symbol);  

  const handleAnalyze = async () => {
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5001/api/ai/chart-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, timeframe }),
      });
  
      const data = await res.json();
  
      setIndicators(data.indicators || {});
      setPatterns(data.patterns || {});
      setAiInsights(data.insights || []);
    } catch (err) {
      console.error("Chart analysis failed", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-6">
      <div>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Chart Analyzer
        </h1>

        <Badge
          variant="outline"
          className={
            marketType === "CRYPTO"
              ? "border-purple-500 text-purple-500"
              : "border-blue-500 text-blue-500"
          }
        >
          {marketType}
        </Badge>
      </div>
        <p className="text-muted-foreground">
          AI-powered technical analysis and pattern recognition
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
          <CardDescription>
            Select symbol and timeframe for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                className="w-full"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <LineChart className="mr-2 h-4 w-4" />
                    Analyze Chart
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {indicators && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Technical Indicators
            </CardTitle>
            <CardDescription>
              Key technical indicators for {symbol}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {Object.entries(indicators).map(([name, data]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-muted-foreground">
                    Value: {data.value}
                  </div>
                </div>

                <Badge variant="outline">
                  {data.signal}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}


      {Object.keys(patterns).length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pattern Recognition
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {Object.entries(patterns).map(([name, detected]) => (
              <div
                key={name}
                className="flex justify-between p-3 border rounded-lg"
              >
                <div>{name}</div>
                <Badge variant={detected ? "default" : "secondary"}>
                  {detected ? "Detected" : "Not Found"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

{!indicators && !loading && (
  <p className="text-muted-foreground text-sm">
    Enter a symbol and click Analyze Chart to view insights
  </p>
)}


      {aiInsights.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Machine learning analysis of {symbol}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-3 bg-primary/5 border rounded-lg"
              >
                <Brain className="h-4 w-4 text-primary mt-1" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartAnalyzer;
