"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/coach/ChatWindow";
import { SuggestedActions } from "@/components/coach/SuggestedActions";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function CoachPage() {
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | undefined>(undefined);

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* App Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Page Header */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="gap-1 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Autonomous Skill Coach
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Skill Coach & Architecture Mentor
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Get instant feedback on system designs, request tailored code drills, and receive personalized hints to ace advanced verification challenges.
          </p>
        </div>

        {/* Chat & Prompt Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Chat Interface (2 cols) */}
          <div className="lg:col-span-2">
            <ChatWindow
              externalPrompt={selectedPrompt}
              onClearExternalPrompt={() => setSelectedPrompt(undefined)}
            />
          </div>

          {/* Suggested Prompts & Actions (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            <SuggestedActions onSelectPrompt={(prompt) => setSelectedPrompt(prompt)} />
          </div>
        </div>
      </main>
    </div>
  );
}
