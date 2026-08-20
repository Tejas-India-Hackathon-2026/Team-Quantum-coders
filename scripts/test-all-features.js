/**
 * Comprehensive Automated Test Suite for LifeProof Full-Stack Web Application
 */
const http = require("http");

const BASE_URL = "http://localhost:3000";

function fetchEndpoint(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url, BASE_URL);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log("==================================================================");
  console.log("🧪 STARTING LIFEPROOF FULL-STACK COMPREHENSIVE TEST SUITE");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`⏳ Testing: ${name}... `);
      await fn();
      console.log(`✅ PASSED`);
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // --- 1. FRONTEND PAGES ROUTING TESTS ---
  console.log("📂 SECTION 1: FRONTEND PAGES ACCESSIBILITY & ROUTING");
  const pages = [
    { name: "Landing Page", path: "/" },
    { name: "Login Page", path: "/login" },
    { name: "Signup Page", path: "/signup" },
    { name: "Dashboard Page", path: "/dashboard" },
    { name: "Challenges Marketplace", path: "/challenges" },
    { name: "AI Coach & Architecture Mentor", path: "/coach" },
    { name: "Verified Profile & Skill DNA", path: "/profile" },
    { name: "Recruiter & Employer Suite", path: "/recruiter" },
    { name: "User Settings Page", path: "/settings" },
  ];

  for (const page of pages) {
    await test(`Page: ${page.name} (${page.path})`, async () => {
      const res = await fetchEndpoint(page.path);
      if (res.status !== 200) {
        throw new Error(`Expected HTTP 200, got ${res.status}`);
      }
    });
  }

  // --- 2. BACKEND API ENDPOINTS ---
  console.log("\n🔌 SECTION 2: BACKEND API ENDPOINTS & SERVICES");

  await test("API: GET /api/challenges (List all challenges)", async () => {
    const res = await fetchEndpoint("/api/challenges");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    const challenges = json.data?.challenges || json.data;
    if (!Array.isArray(challenges) || challenges.length === 0) {
      throw new Error("Challenge list is empty or malformed");
    }
  });

  await test("API: POST /api/challenges (Create new challenge)", async () => {
    const res = await fetchEndpoint("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Distributed Raft Consensus Protocol",
        slug: "chal-test-raft",
        companyName: "Quantum Labs",
        description: "Implement leader election and log replication with heartbeats.",
        difficulty: "Mastery",
        prizeAmount: "$3,500 Bounty",
        estimatedTime: 60,
        category: "Backend & Distributed Systems",
        tags: ["Raft", "Distributed", "Consensus"],
        xpReward: 600,
        featured: true,
      }),
    });
    if (res.status !== 201 && res.status !== 200) throw new Error(`HTTP ${res.status}`);
  });

  await test("API: POST /api/coach/chat (AI Coach Conversation)", async () => {
    const res = await fetchEndpoint("/api/coach/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "How to implement distributed lock with Redis?",
        userName: "Alex",
      }),
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    if (!json.data || !json.data.text || !json.data.suggestedAction) {
      throw new Error("AI Coach response missing text or suggestedAction");
    }
  });

  await test("API: GET /api/dashboard/summary (Dashboard Metrics)", async () => {
    const res = await fetchEndpoint("/api/dashboard/summary");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    if (!json.data || (!json.data.stats && typeof json.data.totalXp !== "number")) {
      throw new Error("Dashboard summary missing stats");
    }
  });

  await test("API: GET /api/dashboard/skills (Skill DNA Metrics)", async () => {
    const res = await fetchEndpoint("/api/dashboard/skills");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Skills list malformed");
    }
  });

  await test("API: GET /api/dashboard/achievements (Proof Badges)", async () => {
    const res = await fetchEndpoint("/api/dashboard/achievements");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    if (!json.data) throw new Error("Achievements data missing");
  });

  await test("API: GET /api/dashboard/activity (Activity Log)", async () => {
    const res = await fetchEndpoint("/api/dashboard/activity");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    if (!json.data) throw new Error("Activity data missing");
  });

  await test("API: GET /api/dashboard/coach-insight (AI Insights)", async () => {
    const res = await fetchEndpoint("/api/dashboard/coach-insight");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  });

  await test("API: GET /api/profile/me (User Profile)", async () => {
    const res = await fetchEndpoint("/api/profile/me");
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
    const json = JSON.parse(res.body);
    if (!json.data || !json.data.fullName) throw new Error("Profile missing fullName");
  });

  await test("API: PATCH /api/settings (Update Settings)", async () => {
    const res = await fetchEndpoint("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Alex Rivera",
        headline: "Principal Distributed Systems Engineer",
        theme: "dark",
      }),
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  });

  console.log("\n==================================================================");
  console.log(`📊 TEST RESULTS SUMMARY: ${passed} PASSED / ${failed} FAILED (Total: ${passed + failed})`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
