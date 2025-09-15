import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function MagicSentPage() {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Check your inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <div className="flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            We sent you a magic link. Open it on this device to complete sign-in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
