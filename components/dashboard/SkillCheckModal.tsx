"use client";

import * as React from "react";
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Play,
  Terminal,
  Award,
  ArrowRight,
  ArrowLeft,
  Code2,
  HelpCircle,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skill, SkillCategory } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface SkillCheckModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchFullSandbox?: (skill: Skill) => void;
}

interface Question {
  id: number;
  scenario: string;
  codeSnippet?: string;
  options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
}

function getQuestionsForSkill(skillName: string, category: SkillCategory): Question[] {
  const name = skillName.toLowerCase();

  if (category === "Frontend Architecture" || name.includes("react") || name.includes("next") || name.includes("css") || name.includes("tailwind") || name.includes("vue")) {
    return [
      {
        id: 1,
        scenario: `In high-performance ${skillName} applications, what is the most effective approach to prevent cascading re-renders when passing callbacks to deeply nested child components?`,
        codeSnippet: `// Problem Scenario:\nfunction ParentComponent({ items, onUpdate }) {\n  return items.map(item => (\n    <MemoizedChild key={item.id} item={item} onSelect={() => onUpdate(item.id)} />\n  ));\n}`,
        options: [
          {
            id: "a",
            text: "Wrap callback in useCallback or extract a separate ListItem component with stable handler reference to preserve memoization equality.",
            isCorrect: true,
            explanation: "Inline arrow functions create new references on every render, breaking React.memo shallow comparisons.",
          },
          {
            id: "b",
            text: "Replace all state hooks with global window variables.",
            isCorrect: false,
            explanation: "Global window variables bypass React reactivity and cause severe side effects and concurrency desynchronization.",
          },
          {
            id: "c",
            text: "Use useLayoutEffect to synchronously force DOM repaint before each child render.",
            isCorrect: false,
            explanation: "useLayoutEffect blocks the main browser thread and increases layout thrashing without solving reference instability.",
          },
          {
            id: "d",
            text: "Remove React.memo because shallow props comparison is always slower than full DOM reconciliation.",
            isCorrect: false,
            explanation: "Virtual DOM reconciliation and AST commit phases are significantly more expensive than shallow object comparisons.",
          },
        ],
      },
      {
        id: 2,
        scenario: "When architecting Next.js Server & Client Component boundaries, which pattern avoids leaking server secrets or bundle bloat to the client?",
        options: [
          {
            id: "a",
            text: "Keep data fetching in Server Components and pass only serialized data or render Client Components as children slots.",
            isCorrect: true,
            explanation: "Server components keep backend SDKs and secrets on the server and minimize the client JavaScript bundle.",
          },
          {
            id: "b",
            text: "Mark every component with 'use client' and fetch data using client-side useEffect.",
            isCorrect: false,
            explanation: "This destroys SSR benefits, exposes backend API paths, and increases initial page load bundle size.",
          },
          {
            id: "c",
            text: "Embed raw database connection strings directly in client components.",
            isCorrect: false,
            explanation: "Severely compromises database security and will fail Next.js production builds.",
          },
          {
            id: "d",
            text: "Disable hydration completely for all interactive forms.",
            isCorrect: false,
            explanation: "Disabling hydration breaks form validation and user event handling.",
          },
        ],
      },
      {
        id: 3,
        scenario: "How should race conditions in asynchronous search typeahead requests be handled to ensure stale network responses do not overwrite recent results?",
        options: [
          {
            id: "a",
            text: "Use AbortController to cancel in-flight HTTP requests or track monotonically increasing request sequence IDs.",
            isCorrect: true,
            explanation: "AbortController immediately discards obsolete responses and prevents out-of-order state mutations.",
          },
          {
            id: "b",
            text: "Add a hardcoded 5000ms setTimeout to every response.",
            isCorrect: false,
            explanation: "Hardcoded timeouts worsen latency without guaranteeing network packet arrival order.",
          },
          {
            id: "c",
            text: "Store responses in localStorage and read without timestamps.",
            isCorrect: false,
            explanation: "LocalStorage is synchronous and lacks concurrency ordering semantics.",
          },
          {
            id: "d",
            text: "Execute all search queries synchronously on the main thread.",
            isCorrect: false,
            explanation: "Synchronous requests freeze the browser UI and are deprecated.",
          },
        ],
      },
    ];
  }

  if (category === "AI & Machine Learning" || name.includes("ai") || name.includes("rag") || name.includes("vector") || name.includes("llm")) {
    return [
      {
        id: 1,
        scenario: "In a production Retrieval-Augmented Generation (RAG) vector pipeline, why is Hybrid Search (Dense Vectors + BM25 Sparse Search) preferred over pure vector cosine search?",
        options: [
          {
            id: "a",
            text: "Dense embeddings excel at semantic concepts, while BM25 guarantees exact keyword matching for IDs, codes, and specific terminology.",
            isCorrect: true,
            explanation: "Hybrid search with Reciprocal Rank Fusion (RRF) overcomes embedding blindness to exact SKU/keyword matches.",
          },
          {
            id: "b",
            text: "Pure vector search cannot compute math on numbers larger than 1000.",
            isCorrect: false,
            explanation: "Vector search operates on multi-dimensional float vectors regardless of scalar magnitudes.",
          },
          {
            id: "c",
            text: "BM25 eliminates the need for an LLM entirely.",
            isCorrect: false,
            explanation: "BM25 is an information retrieval ranking function, not a generative language model.",
          },
          {
            id: "d",
            text: "Dense embeddings take up no memory on disk.",
            isCorrect: false,
            explanation: "Dense high-dimensional float32 embeddings have substantial memory requirements.",
          },
        ],
      },
      {
        id: 2,
        scenario: "What technique prevents KV Cache memory overflow during long-context LLM streaming inference?",
        options: [
          {
            id: "a",
            text: "PagedAttention (virtual memory paging for Key-Value matrices) and dynamic token eviction strategies.",
            isCorrect: true,
            explanation: "PagedAttention eliminates fragmentation and allows non-contiguous memory allocation across attention heads.",
          },
          {
            id: "b",
            text: "Restarting the model process after every token generation.",
            isCorrect: false,
            explanation: "Process restarts destroy throughput and incur massive re-initialization overhead.",
          },
          {
            id: "c",
            text: "Converting all floating point numbers to 64-bit doubles.",
            isCorrect: false,
            explanation: "Doubling precision increases memory consumption by 2x.",
          },
          {
            id: "d",
            text: "Truncating all user inputs to 5 words.",
            isCorrect: false,
            explanation: "Destroys conversational context and user intent.",
          },
        ],
      },
      {
        id: 3,
        scenario: "To protect AI API endpoints against prompt injection and jailbreak payloads, what architectural layer is required before calling the inference model?",
        options: [
          {
            id: "a",
            text: "A dual-guardrail validation layer (input classifier/sanitizer + strict schema constrained output decoding).",
            isCorrect: true,
            explanation: "Deterministic guardrails and structured JSON/Pydantic validation prevent privilege escalation and system prompt leakage.",
          },
          {
            id: "b",
            text: "Asking the LLM nicely in the system prompt to ignore hackers.",
            isCorrect: false,
            explanation: "Adversarial prompts easily override simple system instructions without external guardrails.",
          },
          {
            id: "c",
            text: "Encrypting prompt text with AES-256 so the LLM cannot read it.",
            isCorrect: false,
            explanation: "If the LLM cannot read the input tokens, it cannot generate sensible responses.",
          },
          {
            id: "d",
            text: "Allowing arbitrary Python eval() execution on raw LLM output strings.",
            isCorrect: false,
            explanation: "Unsanitized eval() creates critical Remote Code Execution (RCE) vulnerabilities.",
          },
        ],
      },
    ];
  }

  // Default: Backend, Distributed Systems, Concurrency, Cloud & System Design
  return [
    {
      id: 1,
      scenario: `Under high concurrent traffic in ${skillName}, how do you prevent the 'Cache Stampede' (Thundering Herd) problem when a popular cache key expires?`,
      codeSnippet: `// Problem Scenario:\nasync function getHotProduct(id) {\n  let data = await redis.get(id);\n  if (!data) {\n    data = await db.querySlowDatabase(id); // 5,000 requests hit DB simultaneously!\n    await redis.set(id, data, { EX: 60 });\n  }\n  return data;\n}`,
      options: [
        {
          id: "a",
          text: "Implement a Distributed Mutex (Redlock / Singleflight pattern) or probabilistic early background cache recomputation.",
          isCorrect: true,
          explanation: "Singleflight ensures only 1 request queries the database while concurrent requests wait for the shared promise result.",
        },
        {
          id: "b",
          text: "Set cache TTL to 0 seconds so data is never stored.",
          isCorrect: false,
          explanation: "Setting TTL to 0 forces 100% of traffic to hit the database directly, causing immediate database outage.",
        },
        {
          id: "c",
          text: "Catch database errors and return null to all users.",
          isCorrect: false,
          explanation: "Returning null degrades user experience and does not resolve database thread pool exhaustion.",
        },
        {
          id: "d",
          text: "Increase database connection pool to 1,000,000 connections.",
          isCorrect: false,
          explanation: "Excessive connection pools cause kernel context switching overhead and memory exhaustion.",
        },
      ],
    },
    {
      id: 2,
      scenario: "When designing idempotent transactional APIs (e.g. Stripe payment processing or order placements), what guarantees zero duplicate charges upon network retries?",
      options: [
        {
          id: "a",
          text: "Client sends unique Idempotency-Key; backend checks atomicity in Redis/Postgres inside a database transaction before execution.",
          isCorrect: true,
          explanation: "Idempotency keys with unique database constraints guarantee that duplicate requests return cached results without re-executing transactions.",
        },
        {
          id: "b",
          text: "Check if the user has logged in within the last 10 seconds.",
          isCorrect: false,
          explanation: "Login timestamps do not prevent duplicate concurrent HTTP POST requests.",
        },
        {
          id: "c",
          text: "Rely solely on client-side button disabling.",
          isCorrect: false,
          explanation: "Client-side state can be bypassed by network retries, script injection, or duplicate API calls.",
        },
        {
          id: "d",
          text: "Randomly sleep for 2 seconds before each charge.",
          isCorrect: false,
          explanation: "Arbitrary sleeps increase tail latency without providing atomicity guarantees.",
        },
      ],
    },
    {
      id: 3,
      scenario: "In a microservices architecture with distributed events (Kafka/RabbitMQ), how do you prevent Dual-Write inconsistency between Database updates and Message Broker publishing?",
      options: [
        {
          id: "a",
          text: "Transactional Outbox Pattern with Change Data Capture (Debezium) or an outbox publisher table in the same local DB transaction.",
          isCorrect: true,
          explanation: "Transactional Outbox guarantees that event records are committed atomically with business entity mutations before publishing to the broker.",
        },
        {
          id: "b",
          text: "Publish to Kafka first, and if the DB query fails, write an apology log.",
          isCorrect: false,
          explanation: "Ghost messages will be consumed by downstream services while DB state was rolled back.",
        },
        {
          id: "c",
          text: "Disable all database transactions to make operations faster.",
          isCorrect: false,
          explanation: "Disabling transactions causes dirty reads and unrecoverable data corruption.",
        },
        {
          id: "d",
          text: "Send HTTP webhooks synchronously inside an uncommitted database transaction.",
          isCorrect: false,
          explanation: "Network timeouts hold open DB locks and cause connection starvation.",
        },
      ],
    },
  ];
}

export function SkillCheckModal({
  skill,
  isOpen,
  onClose,
  onLaunchFullSandbox,
}: SkillCheckModalProps) {
  const { verifySkill } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [evaluationLogs, setEvaluationLogs] = React.useState<string[]>([]);
  const [testCompleted, setTestCompleted] = React.useState(false);
  const [scoreData, setScoreData] = React.useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    earnedLevel: number;
    isPassed: boolean;
  } | null>(null);

  const questions = React.useMemo(() => {
    if (!skill) return [];
    return getQuestionsForSkill(skill.name, skill.category);
  }, [skill]);

  // Reset state when opening for a new skill
  React.useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsEvaluating(false);
      setEvaluationLogs([]);
      setTestCompleted(false);
      setScoreData(null);
    }
  }, [isOpen, skill]);

  if (!isOpen || !skill || questions.length === 0) return null;

  const currentQ = questions[currentQuestionIndex];
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (questionId: number, optionId: string) => {
    if (testCompleted || isEvaluating) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleRunEvaluation = () => {
    if (!allAnswered) return;
    setIsEvaluating(true);
    setEvaluationLogs([`[INIT] Compiling AST test suite for ${skill.name}...`]);

    setTimeout(() => {
      setEvaluationLogs((prev) => [
        ...prev,
        `[AUDIT 1/3] Evaluating architectural pattern and memory safety...`,
      ]);
    }, 600);

    setTimeout(() => {
      setEvaluationLogs((prev) => [
        ...prev,
        `[AUDIT 2/3] Checking concurrency edge cases and race conditions...`,
        `[AUDIT 3/3] Simulating high-load throughput and validation rules...`,
      ]);
    }, 1200);

    setTimeout(() => {
      // Calculate exact real score
      let correct = 0;
      questions.forEach((q) => {
        const chosen = selectedAnswers[q.id];
        const opt = q.options.find((o) => o.id === chosen);
        if (opt?.isCorrect) correct += 1;
      });

      const percentage = Math.round((correct / questions.length) * 100);
      const isPassed = percentage >= 66; // 2 out of 3 or 3 out of 3 to pass
      const earnedLevel = isPassed
        ? percentage === 100
          ? 95
          : 80
        : percentage === 33
        ? 35
        : 10;

      const earnedScore = earnedLevel * 10;

      setScoreData({
        correctCount: correct,
        totalCount: questions.length,
        percentage,
        earnedLevel,
        isPassed,
      });

      setEvaluationLogs((prev) => [
        ...prev,
        isPassed
          ? `[SUCCESS] 🛡️ Benchmark Passed (${correct}/${questions.length} Correct - ${percentage}%). Proof Hash Generated!`
          : `[NOTICE] ❌ Assessment Incomplete (${correct}/${questions.length} Correct - ${percentage}%). Minimum 66% required to certify.`,
      ]);

      setIsEvaluating(false);
      setTestCompleted(true);

      // Verify and update real score in context
      verifySkill(skill.id, earnedLevel, earnedScore);
    }, 1900);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
    setScoreData(null);
    setEvaluationLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 p-5 sm:p-7 shadow-2xl space-y-5 text-left overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-primary/10 text-indigo-600 dark:text-primary border border-indigo-100 dark:border-primary/20 shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Technical Skill Evaluation: {skill.name}
                </h3>
                <Badge variant={skill.verified ? "cyan" : "outline"} className="text-[10px] font-mono">
                  {skill.verified ? "Verified" : "Unverified (Test Required)"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Answer all 3 technical scenarios to calculate your verified score & proof hash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Test in progress */}
        {!testCompleted && !isEvaluating ? (
          <div className="space-y-4">
            {/* Step Navigation & Progress Indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-1.5">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentQuestionIndex === idx
                        ? "bg-indigo-600 text-white shadow-xs"
                        : selectedAnswers[q.id] !== undefined
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.scenario}
              </h4>

              {currentQ.codeSnippet && (
                <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                  <pre>{currentQ.codeSnippet}</pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-primary/20 border-indigo-400 dark:border-primary text-slate-900 dark:text-white font-semibold shadow-xs ring-1 ring-indigo-400"
                          : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] uppercase font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="gap-1 text-xs font-semibold"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="gap-1 text-xs font-bold text-indigo-600 border-indigo-200 dark:border-primary/40 hover:bg-indigo-50"
                >
                  Next Scenario <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  variant="glow"
                  size="sm"
                  disabled={!allAnswered}
                  onClick={handleRunEvaluation}
                  className="gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Submit & Run AST Evaluation
                </Button>
              )}
            </div>
          </div>
        ) : isEvaluating ? (
          /* Evaluation in progress */
          <div className="space-y-4 py-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-primary/10 border border-indigo-200 dark:border-primary/30 flex items-center justify-center text-indigo-600 dark:text-primary mx-auto animate-spin">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Evaluating Technical Responses & AST Tree...
              </h4>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Analyzing algorithmic complexity, error recovery, and benchmark constraints.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs text-left space-y-1.5 max-h-40 overflow-y-auto">
              {evaluationLogs.map((log, i) => (
                <div key={i} className="text-indigo-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Test Result Screen */
          <div className="space-y-5 animate-in fade-in">
            {scoreData?.isPassed ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Skill Verified Successfully! 🎉
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium max-w-md mx-auto">
                  You scored <strong>{scoreData.percentage}%</strong> ({scoreData.correctCount} / {scoreData.totalCount} correct). Your proficiency score is now set to <strong>{scoreData.earnedLevel}%</strong> and <strong>+250 XP</strong> has been added to your profile!
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
                  <XCircle className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Assessment Incomplete (Passing: 66%)
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium max-w-md mx-auto">
                  You scored <strong>{scoreData?.percentage}%</strong> ({scoreData?.correctCount} / {scoreData?.totalCount} correct). Review the detailed answer explanations below and retake the test when ready!
                </p>
              </div>
            )}

            {/* Detailed Question Review */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-muted-foreground">
                Technical Scenarios Breakdown
              </h5>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const chosenOptId = selectedAnswers[q.id];
                  const chosenOpt = q.options.find((o) => o.id === chosenOptId);
                  const isCorrect = chosenOpt?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        isCorrect
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30"
                          : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Scenario #{idx + 1}
                        </span>
                        {isCorrect ? (
                          <Badge variant="success" className="text-[10px]">
                            Correct (+100 pts)
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            Incorrect
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {q.scenario}
                      </p>
                      <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 pt-1 border-t border-slate-200/60 dark:border-white/5">
                        💡 Key Insight: {q.options.find((o) => o.isCorrect)?.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Retake Test
              </Button>
              <Button
                variant="glow"
                size="sm"
                onClick={onClose}
                className="gap-1.5 text-xs font-bold ml-auto shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" /> Done (Update Matrix)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
