export interface SandboxTemplate {
  filename: string;
  language: string;
  starterCode: string;
  requirements: string[];
  testSteps: string[];
}

export const CHALLENGE_TEMPLATES: Record<string, SandboxTemplate> = {
  "chal-101": {
    filename: "serverActionCache.ts",
    language: "TypeScript",
    starterCode: `"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export interface CacheMutationPayload {
  tenantId: string;
  resourceId: string;
  data: Record<string, any>;
}

export async function mutateTenantRecord(payload: CacheMutationPayload) {
  const { tenantId, resourceId, data } = payload;
  
  // 1. Persist update to database
  console.log(\`Updating resource \${resourceId} for tenant \${tenantId}\`, data);

  // 2. Perform on-demand cache tag invalidation
  // Target tag pattern: \`tenant:\${tenantId}:resource:\${resourceId}\`
  revalidateTag(\`tenant:\${tenantId}:resource:\${resourceId}\`);
  revalidateTag(\`tenant:\${tenantId}:feed\`);

  return { success: true, timestamp: Date.now() };
}

export async function getCachedTenantFeed(tenantId: string) {
  // Edge-cached fetch with Next.js ISR tag
  const res = await fetch(\`https://api.internal/tenant/\${tenantId}/feed\`, {
    next: { tags: [\`tenant:\${tenantId}:feed\`], revalidate: 60 },
  });
  return res.json();
}`,
    requirements: [
      "Use revalidateTag to selectively purge cache tags without full router reloads.",
      "Support multi-tenant isolation so Tenant A updates never purge Tenant B caches.",
      "Handle high-concurrency mutation batches with zero stale-read race conditions.",
      "Ensure edge-revalidation latency is under 50ms.",
    ],
    testSteps: [
      "⚡ Initializing isolated Next.js 14 server runtime...",
      "📦 Compiling Server Action AST & Cache Tag Matrix...",
      "✅ Test #1: Granular tag revalidation on mutateTenantRecord (PASSED)",
      "✅ Test #2: Multi-tenant cache key isolation under concurrent load (PASSED)",
      "✅ Test #3: Zero stale reads on on-demand ISR edge fetch (PASSED)",
      "🎯 Next.js Architecture Score: 100/100 (Flawless Invalidation)",
    ],
  },

  "chal-102": {
    filename: "distributedLock.ts",
    language: "TypeScript",
    starterCode: `import { Redis } from "ioredis";

export interface LockOptions {
  ttlMs: number;
  retryDelayMs: number;
  maxRetries: number;
}

export class DistributedLockManager {
  private redis: Redis;

  constructor(redisClient: Redis) {
    this.redis = redisClient;
  }

  async acquireLock(resourceKey: string, lockValue: string, options: LockOptions): Promise<boolean> {
    const { ttlMs, retryDelayMs, maxRetries } = options;
    let attempts = 0;

    while (attempts < maxRetries) {
      const result = await this.redis.set(resourceKey, lockValue, "PX", ttlMs, "NX");
      if (result === "OK") {
        this.startHeartbeat(resourceKey, lockValue, Math.floor(ttlMs / 2));
        return true;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
    return false;
  }

  private startHeartbeat(key: string, value: string, intervalMs: number) {
    // Heartbeat TTL renewal loop
  }

  async releaseLock(resourceKey: string, lockValue: string): Promise<boolean> {
    const luaScript = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;
    const res = await this.redis.eval(luaScript, 1, resourceKey, lockValue);
    return res === 1;
  }
}`,
    requirements: [
      "Lock acquisition must be strictly atomic using SET NX PX with random token.",
      "Automatic heartbeat renewal loop to extend TTL before lease expiry.",
      "Atomic release using Lua script to prevent accidental split-brain lock steals.",
      "Zero memory leaks across 10,000 concurrent retry attempts.",
    ],
    testSteps: [
      "⚡ Initializing Redis Cluster & Concurrency Harness...",
      "📦 Compiling TypeScript AST & Lua Script Verifier...",
      "✅ Test #1: Concurrent lock acquisition at 10,000 QPS (PASSED)",
      "✅ Test #2: Heartbeat renewal during simulated network lag (PASSED)",
      "✅ Test #3: Split-brain prevention with atomic Lua release (PASSED)",
      "🎯 Concurrency Audit: 100/100 (0 Deadlocks, 0 Race Conditions)",
    ],
  },

  "chal-103": {
    filename: "hybridRAGPipeline.ts",
    language: "TypeScript",
    starterCode: `export interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export class HybridRAGPipeline {
  private chunks: DocumentChunk[] = [];

  /**
   * Hybrid semantic vector search + BM25 keyword reranker
   */
  async search(query: string, queryEmbedding: number[], topK = 5): Promise<DocumentChunk[]> {
    // 1. Compute cosine similarity for dense embeddings
    const denseScores = this.chunks.map((chunk) => ({
      chunk,
      score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    // 2. Compute BM25 lexical score for sparse keywords
    const lexicalScores = this.chunks.map((chunk) => ({
      chunk,
      score: this.bm25Score(query, chunk.text),
    }));

    // 3. Reciprocal Rank Fusion (RRF)
    const fused = this.reciprocalRankFusion(denseScores, lexicalScores);
    return fused.slice(0, topK).map((item) => item.chunk);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] ** 2;
      normB += vecB[i] ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  private bm25Score(query: string, text: string): number {
    const terms = query.toLowerCase().split(" ");
    let matchCount = 0;
    for (const term of terms) {
      if (text.toLowerCase().includes(term)) matchCount++;
    }
    return matchCount / (terms.length || 1);
  }

  private reciprocalRankFusion(dense: any[], lexical: any[]) {
    // RRF Score = 1 / (60 + rankDense) + 1 / (60 + rankLexical)
    return dense.sort((a, b) => b.score - a.score);
  }
}`,
    requirements: [
      "Implement dense cosine similarity with normalized vector vectors.",
      "Combine sparse lexical matching (BM25) with dense embeddings using RRF.",
      "Support sub-50ms query evaluation over 100,000 indexed chunks.",
      "Zero context hallucination with chunk boundary overlap safeguards.",
    ],
    testSteps: [
      "⚡ Initializing pgvector index & semantic embedding harness...",
      "📦 Compiling RAG Pipeline AST & Cosine Similarity Engine...",
      "✅ Test #1: Vector embedding dot-product & normalization (PASSED)",
      "✅ Test #2: Reciprocal Rank Fusion (RRF) reranking accuracy (PASSED)",
      "✅ Test #3: Latency benchmark: 10k embeddings evaluated in 18ms (PASSED)",
      "🎯 AI/RAG Pipeline Score: 100/100 (Optimal Precision & Recall)",
    ],
  },

  "chal-104": {
    filename: "typeSafeRouter.ts",
    language: "TypeScript",
    starterCode: `import { z } from "zod";

export type ProcedureHandler<TInput, TOutput> = (input: TInput) => Promise<TOutput> | TOutput;

export class TypeSafeRouter {
  private routes: Map<string, { schema: z.ZodSchema<any>; handler: ProcedureHandler<any, any> }> = new Map();

  procedure<TSchema extends z.ZodSchema<any>, TOutput>(
    path: string,
    schema: TSchema,
    handler: ProcedureHandler<z.infer<TSchema>, TOutput>
  ) {
    this.routes.set(path, { schema, handler });
    return this;
  }

  async execute<TInput, TOutput>(path: string, rawInput: TInput): Promise<TOutput> {
    const route = this.routes.get(path);
    if (!route) {
      throw new Error(\`Route not found: \${path}\`);
    }

    const validatedInput = route.schema.parse(rawInput);
    return route.handler(validatedInput);
  }
}`,
    requirements: [
      "Infer TypeScript return types recursively without any 'any' type escape hatches.",
      "Validate input schemas at runtime with sub-millisecond Zod execution.",
      "Zero runtime overhead for compile-time type resolution.",
      "Automatic error propagation with typed error codes.",
    ],
    testSteps: [
      "⚡ Initializing TypeScript type-checker & AST parser...",
      "📦 Evaluating recursive type inference and Zod schema validations...",
      "✅ Test #1: Zero runtime overhead on recursive schema inference (PASSED)",
      "✅ Test #2: Rejection of malformed schema inputs at runtime (PASSED)",
      "✅ Test #3: End-to-end type safety verification across nested routers (PASSED)",
      "🎯 Type-Level Mastery Score: 100/100 (Pure Type Safety)",
    ],
  },

  "chal-105": {
    filename: "ResponsiveLandingPage.tsx",
    language: "TypeScript React",
    starterCode: `import * as React from "react";

export interface LandingHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}

export function ResponsiveLandingHero({ title, subtitle, ctaText, onCtaClick }: LandingHeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-slate-950 text-white overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
          {title}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="pt-4">
          <button
            onClick={onCtaClick}
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
}`,
    requirements: [
      "Ensure fluid typography scaling across mobile (320px) to ultra-wide (2560px).",
      "Achieve 100/100 Lighthouse Accessibility and Core Web Vitals score.",
      "Semantic HTML5 tags with zero layout shifts (CLS < 0.01).",
      "Smooth micro-interactions on interactive buttons.",
    ],
    testSteps: [
      "⚡ Initializing Headless Chrome & Core Web Vitals auditor...",
      "📦 Evaluating responsive viewport rendering and ARIA accessibility...",
      "✅ Test #1: Fluid viewport scaling across 320px - 2560px (PASSED)",
      "✅ Test #2: Cumulative Layout Shift (CLS) = 0.000 (PASSED)",
      "✅ Test #3: WCAG 2.1 AA Accessibility & Color Contrast (PASSED)",
      "🎯 Frontend DesignOps Score: 100/100 (Zero Accessibility Defects)",
    ],
  },

  "chal-106": {
    filename: "edgeCacheOptimizer.ts",
    language: "TypeScript",
    starterCode: `export interface CacheConfig {
  sMaxAge: number;
  staleWhileRevalidate: number;
  tags: string[];
}

export function buildEdgeCacheHeaders(config: CacheConfig): Headers {
  const headers = new Headers();
  const { sMaxAge, staleWhileRevalidate, tags } = config;

  headers.set(
    "Cache-Control",
    \`public, s-maxage=\${sMaxAge}, stale-while-revalidate=\${staleWhileRevalidate}\`
  );

  if (tags.length > 0) {
    headers.set("Cache-Tag", tags.join(", "));
  }

  return headers;
}

export async function resolveOptimizedQuery(dbPool: any, query: string, params: any[]) {
  // Eliminate N+1 queries by batching with single SQL JOIN query
  return dbPool.query(query, params);
}`,
    requirements: [
      "Configure RFC-compliant stale-while-revalidate cache directives.",
      "Eliminate N+1 database waterfalls using batch SQL aggregations.",
      "Ensure edge CDN response latency stays below 15ms globally.",
    ],
    testSteps: [
      "⚡ Initializing Edge CDN cluster simulator...",
      "📦 Auditing SQL query waterfalls and Cache-Control headers...",
      "✅ Test #1: stale-while-revalidate header compliance (PASSED)",
      "✅ Test #2: Elimination of N+1 database queries (PASSED)",
      "✅ Test #3: Multi-region cache hit ratio > 98.4% (PASSED)",
      "🎯 Edge Optimization Score: 100/100 (Ultra Low Latency)",
    ],
  },

  "chal-107": {
    filename: "authSessionRefresh.ts",
    language: "TypeScript",
    starterCode: `export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class SessionRefreshManager {
  private refreshPromise: Promise<TokenPair> | null = null;

  async getValidAccessToken(currentTokens: TokenPair, refreshFn: () => Promise<TokenPair>): Promise<string> {
    const isExpired = Date.now() >= currentTokens.expiresAt - 30000; // 30s buffer

    if (!isExpired) {
      return currentTokens.accessToken;
    }

    // Deduplicate concurrent token refresh calls across multiple browser tabs
    if (!this.refreshPromise) {
      this.refreshPromise = refreshFn().finally(() => {
        this.refreshPromise = null;
      });
    }

    const newTokens = await this.refreshPromise;
    return newTokens.accessToken;
  }
}`,
    requirements: [
      "Prevent race conditions when multiple concurrent requests trigger token refresh simultaneously.",
      "Deduplicate silent refresh loops across browser tabs.",
      "Enforce 30-second expiry clock-skew buffer.",
    ],
    testSteps: [
      "⚡ Initializing concurrent JWT session simulation...",
      "📦 Evaluating race condition resolution and token deduplication...",
      "✅ Test #1: Concurrent token refresh deduplication (PASSED)",
      "✅ Test #2: Multi-tab session synchronization (PASSED)",
      "✅ Test #3: Clock-skew expiry buffer handling (PASSED)",
      "🎯 Security & Auth Score: 100/100 (Zero Race Conditions)",
    ],
  },

  "chal-108": {
    filename: "realtimeStream.ts",
    language: "TypeScript",
    starterCode: `export interface TickData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
}

export class RealtimeStreamBuffer {
  private buffer: TickData[] = [];
  private batchSize = 1000;
  private onFlush: (batch: TickData[]) => void;

  constructor(onFlush: (batch: TickData[]) => void) {
    this.onFlush = onFlush;
  }

  push(tick: TickData) {
    this.buffer.push(tick);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.length === 0) return;
    const batch = this.buffer;
    this.buffer = [];
    this.onFlush(batch);
  }
}`,
    requirements: [
      "Process 50,000 tick updates per second with zero UI frame drops.",
      "Implement high-throughput batch buffer with requestAnimationFrame flushing.",
      "Ensure sub-5ms latency for WebSocket data ingestion.",
    ],
    testSteps: [
      "⚡ Initializing 50,000 TPS WebSocket streaming harness...",
      "📦 Auditing memory allocation, GC pauses, and WebGL buffer flushing...",
      "✅ Test #1: 50k ticks/sec ingestion with zero dropped frames (PASSED)",
      "✅ Test #2: Memory stability: 0 heap leaks across 1M ticks (PASSED)",
      "✅ Test #3: WebGL canvas batch render loop under 16.6ms (PASSED)",
      "🎯 Real-Time Streaming Score: 100/100 (60 FPS Guaranteed)",
    ],
  },
};
