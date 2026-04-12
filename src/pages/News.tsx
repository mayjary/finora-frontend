import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Newspaper,
  TrendingUp,
  Search,
  ExternalLink,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  source: string;
  time: string;
  category: "Markets" | "Economy" | "Crypto";
  sentiment: "positive" | "negative" | "neutral";
  excerpt: string;
  url: string;
};

type Entity = {
  type?: string;
  sentiment_score?: number;
};

const formatTime = (iso: string) => {
  const hours = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 3600000
  );
  return hours <= 1 ? "Just now" : `${hours} hours ago`;
};

const getCategory = (
  entities?: Entity[],
  title?: string,
  excerpt?: string
): "Markets" | "Economy" | "Crypto" => {
  const text = `${title || ""} ${excerpt || ""}`.toLowerCase();

  // Crypto detection
  if (
    text.includes("crypto") ||
    text.includes("bitcoin") ||
    text.includes("ethereum") ||
    entities?.some((e) => e.type === "crypto")
  ) {
    return "Crypto";
  }

  // Markets detection
  if (
    text.includes("stock") ||
    text.includes("market") ||
    text.includes("shares") ||
    text.includes("equity") ||
    text.includes("nasdaq") ||
    text.includes("dow") ||
    text.includes("s&p") ||
    entities?.some((e) => e.type === "equity")
  ) {
    return "Markets";
  }

  // Default
  return "Economy";
};

const getSentimentColor = (sentiment: string) => {
  const s = sentiment?.toLowerCase().trim();

  switch (s) {
    case "positive":
      return "bg-success/10 text-success border-success/20";
    case "negative":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/50 text-muted-foreground";
  }
};

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  const analyzeSentiment = async (text: string) => {
    const res = await fetch("http://localhost:5001/api/ai/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  
    if (!res.ok) {
      throw new Error("Sentiment API failed");
    }
  
    return res.json();
  };
  

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchNews = async () => {
      setLoading(true);

      try {
        const allArticles: Article[] = [];
        let page = 1;

        while (page <= 5) {
          const params = new URLSearchParams({
            api_token: import.meta.env.VITE_MARKETAUX_API_KEY,
            language: "en",
            limit: "3",
            page: page.toString(),
          });

          const res = await fetch(
            `https://api.marketaux.com/v1/news/all?${params.toString()}`
          );

          const json = await res.json();
          if (!json.data || json.data.length === 0) break;

          const mapped: Article[] = await Promise.all(
            json.data.map(async (n: any) => {
              const text =
                n.title + " " + (n.snippet || n.description || "");
          
              let sentiment: "positive" | "negative" | "neutral" = "neutral";
          
              try {
                const result = await analyzeSentiment(text);
                sentiment = result.sentiment;
              } catch (err) {
                console.error("Sentiment failed for article:", n.title);
              }
          
              return {
                id: n.uuid,
                title: n.title,
                source: n.source,
                time: formatTime(n.published_at),
                category: getCategory(
                  n.entities,
                  n.title,
                  n.snippet || n.description
                ),
                sentiment,
                excerpt: n.snippet || n.description || "",
                url: n.url,
              };
            })
          );          

          allArticles.push(...mapped);
          page++;
        }

        // Deduplicate by id
        const unique = Array.from(
          new Map(allArticles.map((a) => [a.id, a])).values()
        );

        setArticles(unique);
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterByCategory = (category: string) =>
    category === "all"
      ? filtered
      : filtered.filter(
          (a) => a.category.toLowerCase() === category
        );

  const trendingTopics = [
    "Interest Rates",
    "AI Stocks",
    "Inflation",
    "Market Volatility",
    "Energy Sector",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Market News
        </h1>
        <p className="text-muted-foreground">
          Stay updated with real time financial news
        </p>
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="markets">Markets</TabsTrigger>
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>

            {["all", "markets", "economy", "crypto"].map(
              (tab) => (
                <TabsContent
                  key={tab}
                  value={tab}
                  className="space-y-4"
                >
                  {loading && (
                    <p className="text-muted-foreground">
                      Loading news...
                    </p>
                  )}

                  {!loading &&
                    filterByCategory(tab).map(
                      (article) => (
                        <Card
                          key={article.id}
                          className="glass-card hover:bg-secondary/50 transition-colors"
                        >
                          <CardHeader>
                            <div className="flex justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex gap-2 mb-2">
                                  <Badge variant="outline">
                                    {article.category}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={getSentimentColor(
                                      article.sentiment
                                    )}
                                  >
                                    {article.sentiment}
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg">
                                  {article.title}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                  {article.excerpt}
                                </CardDescription>
                              </div>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              </a>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <Newspaper className="h-4 w-4" />
                              <span>{article.source}</span>
                              <span>•</span>
                              <span>{article.time}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}

                  {!loading &&
                    filterByCategory(tab).length === 0 && (
                      <p className="text-muted-foreground">
                        No news available
                      </p>
                    )}
                </TabsContent>
              )
            )}
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic) => (
                <div
                  key={topic}
                  className="flex justify-between p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                >
                  <span className="font-medium">{topic}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
