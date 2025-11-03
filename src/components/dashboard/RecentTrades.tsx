import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentTrades = [
  { symbol: "EUR/USD", entry: "1.0850", exit: "1.0890", profit: "+$240", type: "Long", time: "2 hours ago" },
  { symbol: "GBP/JPY", entry: "188.50", exit: "187.90", profit: "-$120", type: "Short", time: "5 hours ago" },
  { symbol: "XAU/USD", entry: "2025", exit: "2040", profit: "+$450", type: "Long", time: "1 day ago" },
];

export const RecentTrades = () => {
  const navigate = useNavigate();

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Your latest trading activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/trades")}>
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead>Profit/Loss</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTrades.map((trade, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <Badge variant={trade.type === "Long" ? "default" : "secondary"}>
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell>{trade.entry}</TableCell>
                <TableCell>{trade.exit}</TableCell>
                <TableCell className={trade.profit.startsWith("+") ? "text-success" : "text-destructive"}>
                  {trade.profit}
                </TableCell>
                <TableCell className="text-muted-foreground">{trade.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
