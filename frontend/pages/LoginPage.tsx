import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail } from "lucide-react";

export function LoginPage() {
  const { login, sendMagicLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sendingMagic, setSendingMagic] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back!" });
      navigate("/");
    } catch (err) {
      console.error(err);
      toast({ title: "Login failed", description: "Please check your credentials.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onMagic = async () => {
    setSendingMagic(true);
    try {
      await sendMagicLink(email, window.location.origin);
      toast({ title: "Magic link sent", description: "Check your inbox to continue." });
      navigate("/magic-sent");
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to send magic link", variant: "destructive" });
    } finally {
      setSendingMagic(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Sign in
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={onMagic} disabled={sendingMagic || !email}>
              {sendingMagic ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
              Send magic link
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            Don't have an account?
          </span>
          <Link to="/signup" className="text-sm text-primary hover:underline">Create one</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
