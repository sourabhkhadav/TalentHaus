// ─────────────────────────────────────────────────────────────
// TALENTHAUS AUTOMATED SECURITY & PERMISSIONS REGRESSION SUITE
// Runs live empirical tests against running Next.js application
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function testSuite() {
  console.log(`\n🔍 [SUITE 1] Testing Unauthenticated Rejection on Founder APIs...`);
  const founderEndpoints = [
    { method: "GET", path: "/api/upload", body: null },
    { method: "POST", path: "/api/upload", body: new FormData() },
    { method: "DELETE", path: "/api/upload?publicId=test", body: null },
    { method: "PUT", path: "/api/team", body: JSON.stringify({ slug: "test", name: "Test" }), headers: { "Content-Type": "application/json" } },
    { method: "POST", path: "/api/creators", body: JSON.stringify({ slug: "test", name: "Test" }), headers: { "Content-Type": "application/json" } },
    { method: "PUT", path: "/api/creators", body: JSON.stringify({ slug: "test" }), headers: { "Content-Type": "application/json" } },
    { method: "DELETE", path: "/api/creators?slug=test", body: null },
    { method: "GET", path: "/api/contact", body: null },
    { method: "PATCH", path: "/api/contact/123/status", body: JSON.stringify({ status: "read" }), headers: { "Content-Type": "application/json" } },
    { method: "GET", path: "/api/applications", body: null },
    { method: "PATCH", path: "/api/applications/123/status", body: JSON.stringify({ status: "reviewing" }), headers: { "Content-Type": "application/json" } },
  ];

  for (const ep of founderEndpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`, {
      method: ep.method,
      headers: ep.headers || {},
      body: ep.body,
    });
    const isRejected = res.status === 401 || res.status === 403 || res.status === 503;
    assert(isRejected, `Unauthenticated ${ep.method} ${ep.path} rejected (HTTP ${res.status})`);
  }

  console.log(`\n🔍 [SUITE 2] Testing Forged 'x-founder-auth' Header Bypass Immunity...`);
  for (const ep of founderEndpoints) {
    const headers = { ...(ep.headers || {}), "x-founder-auth": "sourabh" };
    const res = await fetch(`${BASE_URL}${ep.path}`, {
      method: ep.method,
      headers,
      body: ep.body,
    });
    const isRejected = res.status === 401 || res.status === 403 || res.status === 503;
    assert(isRejected, `Forged header ${ep.method} ${ep.path} rejected (HTTP ${res.status})`);
  }

  console.log(`\n🔍 [SUITE 3] Testing Public Endpoints and Approved Public Data...`);
  const publicPages = [
    "/",
    "/about",
    "/services",
    "/roster",
    "/campaigns",
    "/insights",
    "/contact",
    "/join",
    "/login",
    "/signup",
  ];

  for (const p of publicPages) {
    const res = await fetch(`${BASE_URL}${p}`);
    assert(res.status === 200, `Public page ${p} accessible (HTTP ${res.status})`);
  }

  // Public GET endpoints
  const rosterRes = await fetch(`${BASE_URL}/api/creators`);
  assert(rosterRes.status === 200, `Public GET /api/creators accessible (HTTP ${rosterRes.status})`);
  const rosterJson = await rosterRes.json();
  assert(Array.isArray(rosterJson.data) && rosterJson.data.length > 0, `Public roster returns array of creators (${rosterJson.data?.length || 0} creators)`);

  const teamRes = await fetch(`${BASE_URL}/api/team`);
  assert(teamRes.status === 200, `Public GET /api/team accessible (HTTP ${teamRes.status})`);
  const teamJson = await teamRes.json();
  assert(Array.isArray(teamJson.data) && teamJson.data.length > 0, `Public team returns array of founders (${teamJson.data?.length || 0} founders)`);

  console.log(`\n🔍 [SUITE 4] Testing Security Headers and Content Security Policy...`);
  const homeRes = await fetch(`${BASE_URL}/`);
  const hsts = homeRes.headers.get("strict-transport-security");
  assert(Boolean(hsts && hsts.includes("max-age=63072000")), `HSTS header active: ${hsts}`);

  const csp = homeRes.headers.get("content-security-policy");
  assert(Boolean(csp && csp.includes("default-src 'self'")), `CSP default-src 'self' present`);
  assert(Boolean(csp && csp.includes("res.cloudinary.com")), `CSP allows Cloudinary images`);
  assert(Boolean(csp && csp.includes("*.supabase.co")), `CSP allows Supabase endpoints`);
  assert(Boolean(csp && csp.includes("frame-ancestors 'none'")), `CSP frame-ancestors 'none' present`);

  const xfo = homeRes.headers.get("x-frame-options");
  assert(xfo === "DENY", `X-Frame-Options is DENY`);

  const xcto = homeRes.headers.get("x-content-type-options");
  assert(xcto === "nosniff", `X-Content-Type-Options is nosniff`);

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

testSuite().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
