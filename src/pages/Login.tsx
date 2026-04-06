import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo(1).png";
import { UserAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // controlled inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const auth = UserAuth();
  // guard: if auth is missing, show a fallback UI or return null
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">Auth context not available. Make sure AuthProvider wraps your app.</div>
      </div>
    );
  }

  const { signInUser, signUpNewUser } = auth;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // debug log to ensure values are present
    console.log("SignIn payload:", { email, password });

    const { success, error } = await signInUser(email.trim().toLowerCase(), password);

    if (!success) {
      setError(typeof error === "string" ? error : error?.message ?? "Login failed");
      toast({ title: "Login failed", description: String(error?.message ?? error) });
      setIsLoading(false);
      return;
    }

    toast({ title: "Welcome back!", description: "Successfully logged in" });
    setIsLoading(false);
    navigate("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // debug log to ensure values are present
    console.log("SignUp payload:", { fullName, email, password });

    try {
      const result = await signUpNewUser(email.trim().toLowerCase(), password, fullName.trim());

      if (result.success) {
        toast({ title: "Account created", description: "Check your email if confirmation is required" });
        // optionally you can set profile metadata by calling a server route or using Supabase client with service role
        navigate("/dashboard");
      } else {
        const errMsg = result.error?.message ?? String(result.error) ?? "Signup failed";
        setError(errMsg);
        toast({ title: "Signup failed", description: errMsg });
      }
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      setError("An unexpected error occurred.");
      toast({ title: "Error", description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-4 text-center">
          <img src={logo} alt="Finora Logo" className="h-16 mx-auto" />
          <div>
            <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Finora
            </CardTitle>
            <CardDescription>AI-Powered Trade Analytics</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="trader@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <div className="text-sm text-red-400">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Trader"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="trader@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <input
                      id="signup-terms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-muted-foreground/40"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      required
                    />
                    <Label htmlFor="signup-terms" className="space-y-1 text-xs font-normal">
                      <span>
                        I agree to the{" "}
                        <button
                          type="button"
                          className="underline text-primary"
                          onClick={() => setIsTermsOpen(true)}
                        >
                          Terms &amp; Conditions and Privacy Policy
                        </button>
                        .
                      </span>
                    </Label>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80">
                    You must review and accept our legal terms before creating an account.
                  </p>
                </div>

                {error && <div className="text-sm text-red-400">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading || !acceptedTerms}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden p-0">
              <DialogHeader className="px-6 pt-6 pb-0">
                <DialogTitle>Terms &amp; Conditions and Privacy Policy</DialogTitle>
              </DialogHeader>
              <div className="mt-4 border-t border-border/60">
                <iframe
                  src="/terms"
                  title="Terms and Conditions"
                  className="h-[65vh] w-full border-0"
                />
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
