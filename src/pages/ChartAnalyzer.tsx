import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Brain, TrendingUp, AlertCircle } from "lucide-react";

const ChartAnalyzer = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1D");

  const indicators = [
    { name: "RSI", value: 68.5, signal: "Overbought", color: "text-warning" },
    { name: "MACD", value: 2.3, signal: "Bullish", color: "text-success" },
    { name: "SMA 50", value: 178.45, signal: "Above", color: "text-success" },
    { name: "SMA 200", value: 165.80, signal: "Above", color: "text-success" },
  ];

  const patterns = [
    { name: "Head & Shoulders", detected: false },
    { name: "Double Top", detected: true },
    { name: "Ascending Triangle", detected: false },
    { name: "Bull Flag", detected: true },
  ];

  const aiInsights = [
    "Strong upward momentum detected with increasing volume",
    "Price approaching resistance level at $185",
    "RSI indicates potential overbought conditions",
    "MACD crossover suggests continued bullish trend",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chart Analyzer</h1>
        <p className="text-muted-foreground">AI-powered technical analysis and pattern recognition</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
          <CardDescription>Select symbol and timeframe for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input 
                id="symbol" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter symbol"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
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
              <Button className="w-full">
                <LineChart className="mr-2 h-4 w-4" />
                Analyze Chart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Technical Indicators
            </CardTitle>
            <CardDescription>Key technical indicators for {symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">{indicator.name}</div>
                    <div className="text-sm text-muted-foreground">Value: {indicator.value}</div>
                  </div>
                  <Badge variant="outline" className={indicator.color}>
                    {indicator.signal}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pattern Recognition
            </CardTitle>
            <CardDescription>Detected chart patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="font-medium">{pattern.name}</div>
                  <Badge variant={pattern.detected ? "default" : "secondary"}>
                    {pattern.detected ? "Detected" : "Not Found"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription>Machine learning analysis of {symbol}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="p-1 bg-primary/10 rounded">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartAnalyzer;
