import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Upload, ImageIcon, TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb, CheckCircle, Target, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  marketBias: "Bullish" | "Bearish" | "Ranging";
  keyObservations: string[];
  mistakesDetected: string[];
  improvementSuggestions: string[];
  tradeQualityScore: number;
}

const ChartReview = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or JPEG image.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setFileName(file.name);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with mock data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult: AnalysisResult = {
      marketBias: ["Bullish", "Bearish", "Ranging"][Math.floor(Math.random() * 3)] as AnalysisResult["marketBias"],
      keyObservations: [
        "Strong support level identified at $42,500",
        "RSI showing oversold conditions (28.5)",
        "Volume declining during consolidation phase",
        "50 EMA acting as dynamic resistance",
        "Price forming a descending wedge pattern"
      ],
      mistakesDetected: [
        "Entry was made before confirmation of breakout",
        "Stop loss placed too tight for current volatility",
        "Position size exceeds recommended 2% risk rule"
      ],
      improvementSuggestions: [
        "Wait for candlestick close above resistance before entry",
        "Use ATR-based stop loss for volatile markets",
        "Consider scaling into positions to improve average entry",
        "Add volume confirmation to your entry criteria"
      ],
      tradeQualityScore: Math.floor(Math.random() * 40) + 55
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const handleSaveToHistory = () => {
    toast({
      title: "Saved to History",
      description: "Your chart analysis has been saved successfully.",
    });
  };

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case "Bullish":
        return <TrendingUp className="h-6 w-6 text-success" />;
      case "Bearish":
        return <TrendingDown className="h-6 w-6 text-destructive" />;
      default:
        return <Minus className="h-6 w-6 text-warning" />;
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case "Bullish":
        return "bg-success/20 text-success border-success/30";
      case "Bearish":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-warning/20 text-warning border-warning/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Chart Review</h1>
        <p className="text-muted-foreground text-lg">
          Upload your trade chart and get AI-driven insights
        </p>
      </div>

      {/* Upload Card */}
      <Card className="glass-card border-2 border-dashed">
        <CardContent className="p-8">
          {!uploadedImage ? (
            <div
              className={`flex flex-col items-center justify-center py-16 rounded-lg transition-all cursor-pointer ${
                isDragging
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-secondary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Drag & drop your chart image
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Badge variant="secondary" className="text-xs">
                Accepts PNG, JPG, JPEG
              </Badge>
              <input
                id="file-input"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={uploadedImage}
                  alt="Uploaded chart"
                  className="w-full max-h-[500px] object-contain bg-background"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  {fileName}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedImage(null);
                    setFileName("");
                    setAnalysisResult(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analyze Button */}
      {uploadedImage && !analysisResult && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-8"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Chart"}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground animate-pulse">
            Analyzing chart with AI...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Market Bias */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Market Bias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {getBiasIcon(analysisResult.marketBias)}
                  <Badge
                    variant="outline"
                    className={`text-lg px-4 py-1 ${getBiasColor(analysisResult.marketBias)}`}
                  >
                    {analysisResult.marketBias}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Trade Quality Score */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Trade Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className={`text-4xl font-bold ${getScoreColor(analysisResult.tradeQualityScore)}`}>
                    {analysisResult.tradeQualityScore}
                  </span>
                  <span className="text-muted-foreground text-lg">/ 100</span>
                </div>
              </CardContent>
            </Card>

            {/* Key Observations */}
            <Card className="glass-card md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Key Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.keyObservations.map((observation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{observation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Mistakes Detected */}
            {analysisResult.mistakesDetected.length > 0 && (
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Mistakes Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.mistakesDetected.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-warning mt-1">•</span>
                        <span className="text-sm">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Improvement Suggestions */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-success" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={handleSaveToHistory}
              className="px-8"
            >
              <Save className="mr-2 h-4 w-4" />
              Save to History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartReview;
