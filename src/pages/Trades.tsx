import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Trades = () => {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState("all");

  const trades = [
    { id: 1, symbol: "AAPL", type: "buy", quantity: 10, price: 182.50, date: "2024-01-15", profit: 250, status: "open" },
    { id: 2, symbol: "TSLA", type: "sell", quantity: 5, price: 238.75, date: "2024-01-14", profit: -120, status: "closed" },
    { id: 3, symbol: "MSFT", type: "buy", quantity: 15, price: 412.30, date: "2024-01-13", profit: 450, status: "closed" },
    { id: 4, symbol: "GOOGL", type: "buy", quantity: 8, price: 141.80, date: "2024-01-12", profit: 180, status: "open" },
    { id: 5, symbol: "AMZN", type: "sell", quantity: 12, price: 175.25, date: "2024-01-11", profit: -95, status: "closed" },
  ];

  const handleAddTrade = () => {
    toast({
      title: "Trade Added",
      description: "Your trade has been successfully recorded.",
    });
  };

  const filteredTrades = trades.filter(trade => 
    filterType === "all" ? true : trade.status === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade Management</h1>
          <p className="text-muted-foreground">Track and analyze your trading activity</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Trade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Trade</DialogTitle>
              <DialogDescription>Enter the details of your trade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input id="symbol" placeholder="e.g., AAPL" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTrade}>Add Trade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.filter(t => t.status === "open").length}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${trades.reduce((acc, t) => acc + t.profit, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>View and manage your trades</CardDescription>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="open">Open Positions</SelectItem>
                <SelectItem value="closed">Closed Trades</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${trade.type === 'buy' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {trade.type === 'buy' ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{trade.symbol}</div>
                    <div className="text-sm text-muted-foreground">{trade.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-medium">{trade.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="font-medium">${trade.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">P&L</div>
                    <div className={`font-medium ${trade.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      ${Math.abs(trade.profit)}
                    </div>
                  </div>
                  <Badge variant={trade.status === 'open' ? 'default' : 'secondary'}>
                    {trade.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trades;
