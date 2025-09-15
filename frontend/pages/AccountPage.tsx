import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AccountPage() {
  const { user, logout, refresh } = useAuth();

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted-foreground">You are not signed in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Verified</span>
            <span className="font-medium">{user.emailVerified ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user.profile?.fullName ?? "-"}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={refresh}>Refresh session</Button>
            <Button variant="destructive" onClick={logout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
