import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, TrendingUp, BarChart3, Calculator, Newspaper, Settings, LogOut, LineChart } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: LineChart, label: "Stocks", path: "/stocks" },
  { icon: TrendingUp, label: "Trades", path: "/trades" },
  { icon: BarChart3, label: "Chart Analyzer", path: "/chart-analyzer" },
  { icon: Calculator, label: "Valuation", path: "/valuation" },
  { icon: Newspaper, label: "Market News", path: "/news" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = UserAuth();

  const handleLogout = async () => {
    // Call Supabase sign-out if auth context is available
    if (auth?.signOut) {
      await auth.signOut();
    }

    // Optionally clear any client-side session state here via auth.setSession(null)
    if (auth?.setSession) {
      auth.setSession(null);
    }

    // Redirect to landing / login
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Finora" className="h-10" />
              <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Finora
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start", !isActive && "hover:bg-secondary")}
                onClick={() => navigate(item.path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
