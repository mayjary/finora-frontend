import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const AIInsightsPanel = ({ trades }: { trades: any[] }) => {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5001/api/ai/trade-insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trades,
          }),
        });

        let data;

        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          console.error("❌ Non-JSON response:", text);
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(data.error || "AI failed");
        }

        // ✅ SET FULL RESPONSE STRING
        setInsights(data.insights || "");

      } catch (err) {
        console.error("AI Insights Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (Array.isArray(trades) && trades.length > 0) {
      fetchInsights();
    }
  }, [trades]);

  console.log("TRADES SENT:", trades);
  console.log("AI RESPONSE:", insights);

  return (
    <Card className="glass-card lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI Trade Coach</CardTitle>
        </div>
        <CardDescription>
          Personalized insights from your trading patterns
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* LOADING */}
        {loading && (
          <p className="text-sm text-muted-foreground">
            Analyzing your trades...
          </p>
        )}

        {/* EMPTY */}
        {!loading && (!insights || insights.trim() === "") && (
          <p className="text-sm text-muted-foreground">
            No insights yet. Add more trades.
          </p>
        )}

        {/* INSIGHTS */}
        {!loading && insights && insights.trim() !== "" && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
            <Brain className="h-5 w-5 mt-0.5 text-primary" />
            <p className="text-sm flex-1 whitespace-pre-line">
              {insights}
            </p>
          </div>
        )}

        <Badge variant="outline" className="w-full justify-center">
          {insights ? "Insights generated" : "No insights"}
        </Badge>
      </CardContent>
    </Card>
  );
};