import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, TrendingDown, Filter, Upload, FileSpreadsheet, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { UserAuth } from "@/context/AuthContext";
import { Trash } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

interface Trade {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  exitPrice?: number;
  date: string;
  exitDate?: string;
  profit: number;
  status: "open" | "closed";
}

interface ParsedTrade {
  symbol: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  entry_time: string;
  exit_time: string;
  trade_type: string;
}

const REQUIRED_COLUMNS = ["symbol", "entry_price", "exit_price", "quantity", "entry_time", "exit_time", "trade_type"];

const Trades = () => {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState("all");
  const [entryMode, setEntryMode] = useState<"manual" | "csv">("manual");
  const [isDragging, setIsDragging] = useState(false);
  const [parsedTrades, setParsedTrades] = useState<ParsedTrade[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [manualSymbol, setManualSymbol] = useState<string>("");
  const [manualType, setManualType] = useState<"buy" | "sell">("buy");
  const [manualQuantity, setManualQuantity] = useState<string>("");
  const [manualPrice, setManualPrice] = useState<string>("");
  const [manualExitPrice, setManualExitPrice] = useState<string>("");

  const { session } = UserAuth();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      console.log("USER ID:", user.id);
    } else {
      console.log("NO USER LOGGED IN");
    }
  }, [user]);

  console.log("USER ID:", user?.id);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setIsLoading(true);
  
        const res = await fetch(`${API_BASE_URL}/api/trades`);
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Failed to load trades");
        }
  
        const mappedTrades: Trade[] = (data || []).map(
          (t: any) => ({
            id: t.id,
            symbol: t.symbol,
            type: t.trade_type,
            quantity: Number(t.quantity),
            price: Number(t.entry_price),
            exitPrice:
              t.exit_price != null ? Number(t.exit_price) : undefined,
            date: t.entry_time,
            exitDate: t.exit_time ?? undefined,
            profit: Number(t.pnl),
            status: t.exit_time ? "closed" : "open",
          })
        );
  
        setTrades(mappedTrades);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error loading trades",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTrades();
  }, [toast]);

  const handleAddTrade = async () => {
    if (!manualSymbol || !manualQuantity || !manualPrice) {
      toast({
        title: "Missing fields",
        description: "Please provide symbol, quantity, and price.",
        variant: "destructive",
      });
      return;
    }

    try {
      const now = new Date().toISOString();
      const body = {
        user_id: user?.id,
        symbol: manualSymbol,
        trade_type: manualType,
        quantity: Number(manualQuantity),
        entry_price: Number(manualPrice),
        exit_price: manualExitPrice ? Number(manualExitPrice) : Number(manualPrice),
        entry_time: now,
        exit_time: now,
      };

      const res = await fetch(`${API_BASE_URL}/api/trades/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const saved = await res.json();

      if (!res.ok) {
        throw new Error(saved.error || "Failed to add trade");
      } 

      const newTrade: Trade = {
        id: saved.id,
        symbol: saved.symbol,
        type: saved.trade_type,
        quantity: Number(saved.quantity),
        price: Number(saved.entry_price),
        exitPrice: saved.exit_price != null ? Number(saved.exit_price) : undefined,
        date: saved.entry_time,
        exitDate: saved.exit_time ?? undefined,
        profit: Number(saved.pnl),
        status: saved.exit_time ? "closed" : "open",
      };

      setTrades([newTrade, ...trades]);
      setManualSymbol("");
      setManualType("buy");
      setManualQuantity("");
      setManualPrice("");
      setManualExitPrice("");

      toast({
        title: "Trade Added",
        description: "Your trade has been successfully recorded.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error adding trade",
        description: "Could not save trade to the server.",
        variant: "destructive",
      });
    }
  };

  const validateCSV = (data: any[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push("CSV file is empty");
      return { valid: false, errors };
    }

    const headers = Object.keys(data[0]).map(h => h.toLowerCase().trim());
    const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
    }

    return { valid: errors.length === 0, errors };
  };

  const parseFile = (file: File) => {
    setFileName(file.name);
    setValidationErrors([]);
    setParsedTrades([]);

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { valid, errors } = validateCSV(results.data);
          
          if (!valid) {
            setValidationErrors(errors);
            return;
          }

          const parsed: ParsedTrade[] = results.data.map((row: any) => ({
            symbol: row.symbol?.toUpperCase() || "",
            entry_price: parseFloat(row.entry_price) || 0,
            exit_price: parseFloat(row.exit_price) || 0,
            quantity: parseInt(row.quantity) || 0,
            entry_time: row.entry_time || "",
            exit_time: row.exit_time || "",
            trade_type:
              row.trade_type?.toLowerCase() === "short"
                ? "sell"
                : row.trade_type?.toLowerCase() === "long"
                ? "buy"
                : row.trade_type?.toLowerCase() || "buy",
          }));

          setParsedTrades(parsed);
          toast({
            title: "File Parsed",
            description: `Found ${parsed.length} trades in the CSV file.`,
          });
        },
        error: (error) => {
          setValidationErrors([`Error parsing file: ${error.message}`]);
        },
      });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setValidationErrors(["Excel files (.xlsx) require additional processing. Please convert to CSV format."]);
    } else {
      setValidationErrors(["Unsupported file format. Please upload a .csv file."]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      parseFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleImportTrades = async () => {
    if (parsedTrades.length === 0) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/trades/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          trades: parsedTrades,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to import trades");
      }

      const data = await res.json();

      const newTrades: Trade[] = (data.trades || []).map((t: any, index: number) => ({
        id: t.id,
        symbol: t.symbol,
        type: t.trade_type,
        quantity: Number(t.quantity),
        price: Number(t.entry_price),
        exitPrice: t.exit_price != null ? Number(t.exit_price) : undefined,
        date: t.entry_time,
        exitDate: t.exit_time ?? undefined,
        profit: Number(t.pnl),
        status: t.exit_time ? "closed" : "open",
      }));

      setTrades([...newTrades, ...trades]);
      setParsedTrades([]);
      setFileName("");

      toast({
        title: "Trades Imported",
        description: `Successfully imported ${newTrades.length} trades.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error importing trades",
        description: "Could not import trades to the server.",
        variant: "destructive",
      });
    }
  };

  const filteredTrades = trades.filter(trade => 
    filterType === "all" ? true : trade.status === filterType
  );

  const handleDeleteTrade = async (id: string) => {
    try {
      if (!confirm("Delete this trade?")) return;
  
      const res = await fetch(`${API_BASE_URL}/api/trades/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error);
      }
  
      console.log("Deleted:", data);
  
      // remove from UI
      setTrades((prev) => prev.filter((t) => t.id !== id));
  
      toast({
        title: "Deleted",
        description: "Trade removed from database",
      });
  
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const totalPnL = Math.round(trades.reduce((acc, t) => acc + t.profit, 0) * 100) / 100;
  const winningTrades = trades.filter(t => t.profit > 0).length;
  const winRate = trades.length > 0 ? ((winningTrades / trades.length) * 100).toFixed(1) : "0";

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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record New Trade</DialogTitle>
              <DialogDescription>Enter trade details manually or upload a CSV file</DialogDescription>
            </DialogHeader>
            
            <Tabs value={entryMode} onValueChange={(v) => setEntryMode(v as "manual" | "csv")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="csv" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL"
                    value={manualSymbol}
                    onChange={(e) => setManualSymbol(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={manualType} onValueChange={(v) => setManualType(v as "buy" | "sell")}>
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
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={manualQuantity}
                    onChange={(e) => setManualQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price (optional)</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    placeholder="0.00"
                    value={manualExitPrice}
                    onChange={(e) => setManualExitPrice(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTrade}>Add Trade</Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="csv" className="space-y-4 py-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">
                    {fileName ? fileName : "Drag & drop your file here"}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Accepts .csv files
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs font-medium mb-2">Required CSV columns:</p>
                  <code className="text-xs text-muted-foreground">
                    symbol, entry_price, exit_price, quantity, entry_time, exit_time, trade_type
                  </code>
                </div>

                {validationErrors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Validation Errors</span>
                    </div>
                    <ul className="text-sm text-destructive/80 list-disc list-inside">
                      {validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsedTrades.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-success">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {parsedTrades.length} trades ready to import
                      </span>
                    </div>
                    
                    <div className="max-h-48 overflow-auto border border-border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Symbol</TableHead>
                            <TableHead className="text-xs">Type</TableHead>
                            <TableHead className="text-xs">Qty</TableHead>
                            <TableHead className="text-xs">Entry</TableHead>
                            <TableHead className="text-xs">Exit</TableHead>
                            <TableHead className="text-xs">P&L</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedTrades.slice(0, 5).map((trade, i) => {
                            const pnl = (trade.exit_price - trade.entry_price) * trade.quantity * (trade.trade_type === "buy" ? 1 : -1);
                            return (
                              <TableRow key={i}>
                                <TableCell className="text-xs font-medium">{trade.symbol}</TableCell>
                                <TableCell className="text-xs capitalize">{trade.trade_type}</TableCell>
                                <TableCell className="text-xs">{trade.quantity}</TableCell>
                                <TableCell className="text-xs">${trade.entry_price}</TableCell>
                                <TableCell className="text-xs">${trade.exit_price}</TableCell>
                                <TableCell className={`text-xs ${pnl >= 0 ? "text-success" : "text-destructive"}`}>
                                  ${pnl.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    {parsedTrades.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Showing 5 of {parsedTrades.length} trades
                      </p>
                    )}
                    
                    <Button onClick={handleImportTrades} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Import {parsedTrades.length} Trades
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : trades.length}
            </div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-success" : "text-destructive"}`}>
              {totalPnL < 0
                ? `-$${Math.abs(totalPnL).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : `$${totalPnL.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </div>
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
                    {trade.profit < 0
                      ? `-$${Math.abs(trade.profit).toFixed(2)}`
                      : `$${trade.profit.toFixed(2)}`}
                    </div>
                  </div>
                  <Badge variant={trade.status === 'open' ? 'default' : 'secondary'}>
                    {trade.status}
                  </Badge>
                  <div
                    className="p-2 rounded-lg hover:bg-destructive/10 cursor-pointer transition"
                    onClick={() => handleDeleteTrade(trade.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </div>
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
