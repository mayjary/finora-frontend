import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AIInsightsPanel = () => {
  const insights = [
    {
      id: 1,
      type: "success",
      message: "Strong HTF alignment on recent EUR/USD trades",
      icon: CheckCircle,
    },
    {
      id: 2,
      type: "warning",
      message: "Consider waiting for candle confirmation before entry",
      icon: AlertCircle,
    },
    {
      id: 3,
      type: "info",
      message: "Your win rate improves 12% during London session",
      icon: TrendingUp,
    },
  ];

  return (
    <Card className="glass-card lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI Trade Coach</CardTitle>
        </div>
        <CardDescription>Personalized insights from your trading patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <Icon className={`h-5 w-5 mt-0.5 ${
                insight.type === "success" ? "text-success" :
                insight.type === "warning" ? "text-warning" :
                "text-primary"
              }`} />
              <p className="text-sm flex-1">{insight.message}</p>
            </div>
          );
        })}
        <Badge variant="outline" className="w-full justify-center">
          3 new insights this week
        </Badge>
      </CardContent>
    </Card>
  );
};
