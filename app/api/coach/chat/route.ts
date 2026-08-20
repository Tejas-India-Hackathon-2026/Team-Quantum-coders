import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { MOCK_CHALLENGES } from "@/data/mockChallenges";

interface ChatReply {
  text: string;
  suggestedAction?: {
    label: string;
    href: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { message, userName } = await req.json();
    const query = (message || "").toLowerCase().trim();
    const displayName = userName || "Engineer";

    let reply: ChatReply = {
      text: "I'm analyzing your request across our architectural benchmarks. What specific engineering concept or code challenge would you like to explore today?",
      suggestedAction: {
        label: "Browse Marketplace Challenges",
        href: "/challenges",
      },
    };

    // 1. Greetings & Introductions
    if (
      query === "hello" ||
      query === "hi" ||
      query === "hey" ||
      query.startsWith("hello") ||
      query.startsWith("hi ") ||
      query.includes("good morning") ||
      query.includes("good evening") ||
      query.includes("namaste")
    ) {
      reply = {
        text: `Hello ${displayName}! 👋 I'm your LifeProof AI Architecture & Skill Mentor. I can help you evaluate system designs, review code algorithms, optimize database locks, or recommend your next proof-of-work assessment. What domain would you like to dive into today?`,
        suggestedAction: {
          label: "View Recommended Challenges",
          href: "/challenges",
        },
      };
    }
    // 2. Recommendations / Next Challenge
    else if (
      query.includes("recommend") ||
      query.includes("next challenge") ||
      query.includes("what should i do") ||
      query.includes("which challenge") ||
      query.includes("suggest") ||
      query.includes("start")
    ) {
      reply = {
        text: `Based on current technical benchmarks, I recommend attempting **"Zero-Downtime Distributed Lock with Redis"** (500 XP, $2,500 Bounty) or **"Vector Search & Hybrid RAG Pipeline"** (250 XP). These assessments will boost your verified Backend and AI competencies by ~+24%.`,
        suggestedAction: {
          label: "Accept Redis Distributed Lock",
          href: "/challenges",
        },
      };
    }
    // 3. Skill DNA & Gaps Analysis
    else if (
      query.includes("skill") ||
      query.includes("dna") ||
      query.includes("gap") ||
      query.includes("weak") ||
      query.includes("score") ||
      query.includes("percentile") ||
      query.includes("radar")
    ) {
      reply = {
        text: `I've audited your Skill DNA across all 6 core vectors:\n\n• **Frontend Architecture**: In Progress (Next.js, Server Actions)\n• **Backend & Distributed Systems**: High potential for growth via concurrency drills\n• **AI & ML**: Semantic embeddings and RAG pipelines ready for verification\n• **Smart Contracts & Web3**: Unverified\n\nCompleting 1 distributed lock challenge will level up your overall percentile to top 15%!`,
        suggestedAction: {
          label: "Inspect Full Skill Radar on Profile",
          href: "/profile",
        },
      };
    }
    // 4. Redis / Distributed Locking / Concurrency / System Design
    else if (
      query.includes("redis") ||
      query.includes("lock") ||
      query.includes("concurrency") ||
      query.includes("distributed") ||
      query.includes("system design") ||
      query.includes("race condition")
    ) {
      reply = {
        text: `To implement a fault-tolerant distributed lock with zero downtime:\n\n1. **Atomic Acquisition**: Use \`SET resource_name my_random_value NX PX 30000\` so lock acquisition is strictly atomic.\n2. **Safe Release**: Use a Lua script to check that the key still contains \`my_random_value\` before deleting to prevent accidental lock stealing under latency spikes.\n3. **Heartbeat Renewal**: Implement an asynchronous renewal loop extending the TTL before lease expiration.`,
        suggestedAction: {
          label: "Practice Distributed Lock Challenge",
          href: "/challenges",
        },
      };
    }
    // 5. Next.js / React / Server Actions / Caching
    else if (
      query.includes("next") ||
      query.includes("server action") ||
      query.includes("react") ||
      query.includes("cache") ||
      query.includes("isr") ||
      query.includes("ssr")
    ) {
      reply = {
        text: `In Next.js 14 App Router, optimal cache invalidation requires combining **\`revalidateTag()\`** inside Server Actions with granular tag keys on your \`fetch\` calls:\n\n\`\`\`typescript\n// Server Action\nexport async function updateBounty(id: string) {\n  await db.challenge.update({ ... });\n  revalidateTag(\`challenge-\${id}\`);\n}\n\`\`\`\nThis guarantees immediate on-demand cache purges with zero stale read anomalies.`,
        suggestedAction: {
          label: "Solve Server Action Challenge",
          href: "/challenges",
        },
      };
    }
    // 6. AI, RAG & Vector Search
    else if (
      query.includes("rag") ||
      query.includes("vector") ||
      query.includes("embedding") ||
      query.includes("pgvector") ||
      query.includes("llm") ||
      query.includes("ai")
    ) {
      reply = {
        text: `For a production hybrid RAG pipeline:\n\n1. **Chunking**: Chunk documents into 500-token segments with 50-token overlap.\n2. **Hybrid Retrieval**: Combine dense semantic embeddings (cosine similarity via pgvector/HNSW index) with sparse keyword matching (BM25).\n3. **Reranking**: Run cross-encoder reranking on top 20 candidates before passing the top 5 chunks into the context window.`,
        suggestedAction: {
          label: "Start Vector Search Pipeline Challenge",
          href: "/challenges",
        },
      };
    }
    // 7. Verification / Proof Badges / Cryptography
    else if (
      query.includes("proof") ||
      query.includes("badge") ||
      query.includes("verification") ||
      query.includes("crypto") ||
      query.includes("hash")
    ) {
      reply = {
        text: `LifeProof mints tamper-evident SHA-256 cryptographic proofs for every completed challenge. Each submission undergoes automated Abstract Syntax Tree (AST) validation and concurrency assertions. Once passed, an immutable hash (e.g. \`0x8f4b...39a1\`) is sealed to your verified developer ledger.`,
        suggestedAction: {
          label: "View Your Verification Badges",
          href: "/profile",
        },
      };
    }
    // 8. Help / General Code Debugging
    else {
      reply = {
        text: `I've analyzed your query regarding "${message}". Here are 3 immediate action items:\n\n1. **Isolate State**: Break the algorithm down into deterministic pure functions.\n2. **Verify Edge Cases**: Check boundary conditions (0-length inputs, high network latency, concurrent writes).\n3. **Benchmark**: Test with our in-browser TypeScript sandbox to confirm sub-millisecond execution times.`,
        suggestedAction: {
          label: "Launch Interactive Code Sandbox",
          href: "/challenges",
        },
      };
    }

    return successResponse(reply);
  } catch (error: any) {
    return errorResponse(error.message || "AI Coach response failed", 500);
  }
}
