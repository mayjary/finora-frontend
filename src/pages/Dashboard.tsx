import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Target, Brain, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RecentTrades } from "@/components/dashboard/RecentTrades";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

interface Summary {
  totalTrades: number;
  totalPnL: number;
  winRate: number;
}

interface PerformanceItem {
  date: string;
  daily_pnl: number;
}

interface Trade {
  id: string;
  symbol: string;
  trade_type: string;
  quantity: number;
  entry_price: number;
  pnl: number;
  created_at: string;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<Summary>({
    totalTrades: 0,
    totalPnL: 0,
    winRate: 0,
  });

  const [performanceData, setPerformanceData] = useState<PerformanceItem[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);

        // Summary
        const summaryRes = await fetch(
          `${API_BASE_URL}/api/trades/summary`
        );
        const summaryData = await summaryRes.json();
        if (!summaryRes.ok) {
          throw new Error(summaryData.error);
        }
        setSummary(summaryData);

        // Performance
        const perfRes = await fetch(
          `${API_BASE_URL}/api/trades/performance`
        );
        const perfData = await perfRes.json();
        if (perfRes.ok) {
          setPerformanceData(perfData);
        }

        // Recent trades
        const tradesRes = await fetch(
          `${API_BASE_URL}/api/trades`
        );
        const tradesData = await tradesRes.json();
        if (tradesRes.ok) {
          setRecentTrades(tradesData.slice(0, 5));
          setAllTrades(tradesData);
        }

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const avgProfit =
    summary.totalTrades > 0
      ? summary.totalPnL / summary.totalTrades
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your trading performance at a glance
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Trades"
          value={isLoading ? "…" : summary.totalTrades.toString()}
          change=""
          icon={Activity}
          trend="up"
        />

        <StatsCard
          title="Win Rate"
          value={
            isLoading
              ? "…"
              : `${summary.winRate.toFixed(1)}%`
          }
          change=""
          icon={Target}
          trend="up"
        />

        <StatsCard
          title="Avg Profit"
          value={
            isLoading
              ? "…"
              : `$${avgProfit.toFixed(2)}`
          }
          change=""
          icon={DollarSign}
          trend={avgProfit >= 0 ? "up" : "down"}
        />

        <StatsCard
          title="Total P&L"
          value={
            isLoading
              ? "…"
              : summary.totalPnL < 0
              ? `-$${Math.abs(summary.totalPnL).toLocaleString()}`
              : `$${summary.totalPnL.toLocaleString()}`
          }
          change=""
          icon={Brain}
          trend={summary.totalPnL >= 0 ? "up" : "down"}
        />
      </div>

      {/* PERFORMANCE + AI */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="glass-card lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Timeline</CardTitle>
            <CardDescription>
              Your trading performance over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performanceData} />
          </CardContent>
        </Card>

        <AIInsightsPanel trades={allTrades} />
      </div>

      <RecentTrades trades={recentTrades} />
    </div>
  );
};

export default Dashboard;