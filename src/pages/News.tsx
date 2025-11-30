import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, TrendingUp, Search, ExternalLink } from "lucide-react";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const news = [
    {
      id: 1,
      title: "Fed Signals Potential Rate Cuts in 2024",
      source: "Financial Times",
      time: "2 hours ago",
      category: "Economy",
      sentiment: "positive",
      excerpt: "Federal Reserve officials indicate possibility of multiple rate cuts as inflation continues to moderate..."
    },
    {
      id: 2,
      title: "Tech Stocks Rally on Strong Earnings Reports",
      source: "Bloomberg",
      time: "4 hours ago",
      category: "Markets",
      sentiment: "positive",
      excerpt: "Major technology companies exceed earnings expectations, driving significant gains in tech sector..."
    },
    {
      id: 3,
      title: "Oil Prices Surge Amid Middle East Tensions",
      source: "Reuters",
      time: "5 hours ago",
      category: "Commodities",
      sentiment: "neutral",
      excerpt: "Crude oil prices climb to three-month highs as geopolitical concerns impact global supply chains..."
    },
    {
      id: 4,
      title: "European Markets Face Headwinds from Energy Crisis",
      source: "Wall Street Journal",
      time: "6 hours ago",
      category: "International",
      sentiment: "negative",
      excerpt: "European indices decline as energy costs continue to pressure economic growth across the region..."
    },
    {
      id: 5,
      title: "Cryptocurrency Market Sees Renewed Institutional Interest",
      source: "CoinDesk",
      time: "8 hours ago",
      category: "Crypto",
      sentiment: "positive",
      excerpt: "Major financial institutions announce plans to expand digital asset offerings amid regulatory clarity..."
    },
  ];

  const trendingTopics = [
    { topic: "Interest Rates", count: 245 },
    { topic: "AI Technology", count: 189 },
    { topic: "Energy Crisis", count: 156 },
    { topic: "Inflation", count: 143 },
    { topic: "Market Volatility", count: 128 },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success/10 text-success border-success/20";
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market News</h1>
        <p className="text-muted-foreground">Stay updated with the latest financial news and analysis</p>
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

            <TabsContent value="all" className="space-y-4">
              {news.map((article) => (
                <Card key={article.id} className="glass-card hover:bg-secondary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                          <Badge variant="outline" className={getSentimentColor(article.sentiment)}>
                            {article.sentiment}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{article.excerpt}</CardDescription>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Newspaper className="h-4 w-4" />
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="markets">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Market news will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="economy">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Economy news will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crypto">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Crypto news will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
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
            <CardContent>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div key={topic.topic} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer">
                    <span className="font-medium">{topic.topic}</span>
                    <Badge variant="secondary">{topic.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
