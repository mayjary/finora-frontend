import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  ImageIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase-client";

interface AnalysisResult {
  marketBias: "Bullish" | "Bearish" | "Ranging";
  keyObservations: string[];
  mistakesDetected: string[];
  improvementSuggestions: string[];
  tradeQualityScore: number;
}

interface HistoryItem {
  id: string;
  image_path: string;
  market_bias: string;
  trade_score: number;
  observations: string[];
  mistakes: string[];
  suggestions: string[];
  created_at: string;
}

const ChartReview = () => {
  const { toast } = useToast();
  const { session } = UserAuth();

  const user = session?.user;

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  /* ---------------- FETCH HISTORY ---------------- */
  const fetchHistory = async () => {
    if (!user) return;

    setLoadingHistory(true);

    const { data, error } = await supabase
      .from("chart_reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setHistory(data || []);
    }

    setLoadingHistory(false);
  };

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  /* ---------------- FILE HANDLING ---------------- */
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
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG or JPG image.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setFileName(file.name);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- ANALYZE ---------------- */
  const handleAnalyze = async () => {
    if (!uploadedImage || !session) return;

    setIsAnalyzing(true);

    try {
      const blob = await fetch(uploadedImage).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image", blob);

      const res = await fetch(
        "http://localhost:5001/api/ai/chart-image-analysis",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAnalysisResult({
        marketBias: data.market_bias,
        tradeQualityScore: data.trade_score,
        keyObservations: data.observations,
        mistakesDetected: data.mistakes,
        improvementSuggestions: data.suggestions,
      });

      fetchHistory();
    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  const getBiasIcon = (bias: string) => {
    if (bias === "Bullish")
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (bias === "Bearish")
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage
      .from("chart-images")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  /* ====================== UI ====================== */
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Chart Review</h1>
        <p className="text-muted-foreground">
          Upload your trade chart and get AI insights
        </p>
      </div>

      {/* Upload */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8">
          {!uploadedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
              className="cursor-pointer text-center py-16"
            >
              <Upload className="mx-auto h-10 w-10 mb-4" />
              <p>Drag & drop your chart image</p>
              <input
                id="file-input"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={uploadedImage}
                className="rounded-lg max-h-[400px] mx-auto"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysisResult(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {uploadedImage && !analysisResult && (
        <div className="text-center">
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze Chart"}
          </Button>
        </div>
      )}

      {/* HISTORY */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your History</h2>

        {loadingHistory ? (
          <Skeleton className="h-32 w-full" />
        ) : history.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <img
                    src={getImageUrl(item.image_path)}
                    className="rounded-lg max-h-[250px]"
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getBiasIcon(item.market_bias)}
                      <Badge>{item.market_bias}</Badge>
                    </div>
                    <span className={getScoreColor(item.trade_score)}>
                      {item.trade_score}/100
                    </span>
                  </div>

                  <ul className="text-sm space-y-1">
                    {item.observations.slice(0, 3).map((o, i) => (
                      <li key={i}>• {o}</li>
                    ))}
                  </ul>

                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartReview;