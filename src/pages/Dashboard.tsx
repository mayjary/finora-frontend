import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Target, Brain, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RecentTrades } from "@/components/dashboard/RecentTrades";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your trading performance at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Trades"
          value="127"
          change="+12%"
          icon={Activity}
          trend="up"
        />
        <StatsCard
          title="Win Rate"
          value="68.5%"
          change="+3.2%"
          icon={Target}
          trend="up"
        />
        <StatsCard
          title="Avg Profit"
          value="$284"
          change="-5.1%"
          icon={DollarSign}
          trend="down"
        />
        <StatsCard
          title="Accuracy"
          value="73.2%"
          change="+1.8%"
          icon={Brain}
          trend="up"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="glass-card lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Timeline</CardTitle>
            <CardDescription>Your trading performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        <AIInsightsPanel />
      </div>

      <RecentTrades />
    </div>
  );
};

export default Dashboard;
