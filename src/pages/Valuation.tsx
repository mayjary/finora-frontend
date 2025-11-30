import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Valuation = () => {
  const { toast } = useToast();
  const [dcfResult, setDcfResult] = useState<number | null>(null);

  const handleCalculateDCF = () => {
    setDcfResult(185.50);
    toast({
      title: "Calculation Complete",
      description: "DCF valuation has been calculated successfully.",
    });
  };

  const valuationMetrics = [
    { label: "P/E Ratio", value: "28.5", benchmark: "Industry: 24.2" },
    { label: "P/B Ratio", value: "42.3", benchmark: "Industry: 38.7" },
    { label: "EV/EBITDA", value: "18.9", benchmark: "Industry: 16.4" },
    { label: "Price/Sales", value: "7.2", benchmark: "Industry: 5.8" },
  ];

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

        <TabsContent value="multiples" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Valuation Multiples</CardTitle>
              <CardDescription>Compare key valuation ratios with industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {valuationMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium">{metric.label}</div>
                      <div className="text-sm text-muted-foreground">{metric.benchmark}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{metric.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dividend" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Dividend Discount Model</CardTitle>
              <CardDescription>Value stocks based on future dividend payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dividend">Annual Dividend per Share</Label>
                <Input id="dividend" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="div-growth">Dividend Growth Rate (%)</Label>
                <Input id="div-growth" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="required-return">Required Rate of Return (%)</Label>
                <Input id="required-return" type="number" placeholder="0" />
              </div>
              <Button className="w-full">Calculate Value</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Valuation;
