// ─────────────────────────────────────────────────────────────
// TALENTHAUS CREATOR LIFECYCLE & SYNC REGRESSION TEST
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const ADMIN_BEARER = "Bearer th_test_admin_session_token_123456789";

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

async function runLifecycleTest() {
  console.log(`\n======================================================`);
  console.log(`🚀 RUNNING CREATOR MANAGEMENT & SYNC VERIFICATION`);
  console.log(`======================================================\n`);

  const testSlug = "aarav-sharma";
  const testCreator = {
    name: "Aarav Sharma",
    slug: testSlug,
    location: "Mumbai, India",
    audienceSize: "750K",
    engagementRate: "6.2%",
    niche: ["Lifestyle", "Fashion"],
    platforms: ["Instagram", "YouTube"],
    status: "published",
    featured: true,
    bio: "Aarav Sharma is a premier luxury lifestyle and fashion creator.",
    shortBio: "Luxury lifestyle & high-fashion creator · Mumbai",
    image: "/images/roster/placeholder.jpg",
    coverImage: "/images/roster/placeholder-cover.jpg",
    instagramHandle: "@aaravsharma",
    instagramFollowers: "500K",
    youtubeHandle: "@aaravsharma_official",
    youtubeSubscribers: "250K",
  };

  // STEP 0: Clean up if previously exists
  console.log(`[STEP 0] Ensuring test slug is clear before starting...`);
  await fetch(`${BASE_URL}/api/creators?slug=${testSlug}`, {
    method: "DELETE",
    headers: { Authorization: ADMIN_BEARER },
  });

  // STEP 1: Verify Unauthorized Admin cannot create creator
  console.log(`\n[STEP 1] Testing unauthenticated creator creation rejection...`);
  const unauthRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testCreator),
  });
  assert(unauthRes.status === 401, `Unauthenticated POST /api/creators rejected with 401 (got ${unauthRes.status})`);

  // STEP 2: Authorized Admin creates creator
  console.log(`\n[STEP 2] Creating creator via authorized admin...`);
  const createRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: ADMIN_BEARER,
    },
    body: JSON.stringify(testCreator),
  });
  assert(createRes.status === 200, `Authorized POST /api/creators returned 200 (got ${createRes.status})`);
  const createJson = await createRes.json();
  assert(createJson.success === true, `API response indicates success`);
  assert(createJson.data?.slug === testSlug, `Created creator has correct slug: ${createJson.data?.slug}`);
  assert(createJson.data?.name === "Aarav Sharma", `Created creator has correct name: ${createJson.data?.name}`);

  // STEP 3: Duplicate creator rejection
  console.log(`\n[STEP 3] Testing duplicate creator submission prevention...`);
  const duplicateRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: ADMIN_BEARER,
    },
    body: JSON.stringify(testCreator),
  });
  assert(duplicateRes.status === 409, `Duplicate submission rejected with 409 Conflict (got ${duplicateRes.status})`);
  const duplicateJson = await duplicateRes.json();
  assert(duplicateJson.success === false && duplicateJson.error.includes("already exists"), `Error feedback clearly mentions duplicate: "${duplicateJson.error}"`);

  // STEP 4: Admin listing verification across admin sessions
  console.log(`\n[STEP 4] Verifying creator in shared data layer for all admin sessions...`);
  const adminListRes = await fetch(`${BASE_URL}/api/creators?includeDrafts=true`, {
    headers: { Authorization: ADMIN_BEARER },
  });
  assert(adminListRes.status === 200, `Admin GET /api/creators returned 200`);
  const adminListJson = await adminListRes.json();
  const foundInAdmin = adminListJson.data?.find((c) => c.slug === testSlug);
  assert(Boolean(foundInAdmin), `New creator "${testSlug}" is present in admin shared roster`);
  assert(foundInAdmin?.location === "Mumbai, India", `Creator location verified: ${foundInAdmin?.location}`);

  // STEP 5: Public API verification (Landing Page & Roster source of truth)
  console.log(`\n[STEP 5] Verifying creator appears in public roster API...`);
  const publicListRes = await fetch(`${BASE_URL}/api/creators`);
  assert(publicListRes.status === 200, `Public GET /api/creators returned 200`);
  const publicListJson = await publicListRes.json();
  const foundInPublic = publicListJson.data?.find((c) => c.slug === testSlug);
  assert(Boolean(foundInPublic), `New creator "${testSlug}" is present in public roster API`);
  assert(foundInPublic?.featured === true, `Creator is marked as featured`);

  // STEP 6: Public Individual Profile Page route
  console.log(`\n[STEP 6] Verifying individual creator profile page (/roster/${testSlug})...`);
  const profileRes = await fetch(`${BASE_URL}/roster/${testSlug}`);
  assert(profileRes.status === 200, `Profile route /roster/${testSlug} returned 200 (got ${profileRes.status})`);
  const profileHtml = await profileRes.text();
  assert(profileHtml.includes("Aarav Sharma"), `Profile page contains creator name "Aarav Sharma"`);
  assert(profileHtml.includes("Mumbai, India"), `Profile page contains creator location "Mumbai, India"`);

  // STEP 7: Public Roster Page route
  console.log(`\n[STEP 7] Verifying public creators/roster section page (/roster)...`);
  const rosterPageRes = await fetch(`${BASE_URL}/roster`);
  assert(rosterPageRes.status === 200, `Roster page /roster returned 200`);
  const rosterPageHtml = await rosterPageRes.text();
  assert(rosterPageHtml.includes("Aarav Sharma"), `Roster page rendered HTML includes "Aarav Sharma"`);

  // STEP 8: Public Landing Page route
  console.log(`\n[STEP 8] Verifying public landing page (/)...`);
  const homeRes = await fetch(`${BASE_URL}/`);
  assert(homeRes.status === 200, `Landing page / returned 200`);
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes("Aarav Sharma"), `Landing page rendered HTML includes "Aarav Sharma"`);

  // STEP 9: Creator Update Propagation
  console.log(`\n[STEP 9] Updating creator details and verifying propagation...`);
  const updateRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: ADMIN_BEARER,
    },
    body: JSON.stringify({
      slug: testSlug,
      engagementRate: "8.4%",
      location: "Bengaluru, India",
    }),
  });
  assert(updateRes.status === 200, `PUT /api/creators returned 200 (got ${updateRes.status})`);
  const updateJson = await updateRes.json();
  assert(updateJson.data?.engagementRate === "8.4%", `Updated engagement rate verified: ${updateJson.data?.engagementRate}`);
  assert(updateJson.data?.location === "Bengaluru, India", `Updated location verified: ${updateJson.data?.location}`);

  // STEP 10: Toggle status to Draft (Hiding from public)
  console.log(`\n[STEP 10] Testing unpublished creator visibility rules (draft status)...`);
  const draftUpdateRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: ADMIN_BEARER,
    },
    body: JSON.stringify({
      slug: testSlug,
      status: "draft",
    }),
  });
  assert(draftUpdateRes.status === 200, `Set creator to draft returned 200`);

  // Public listing must NOT include draft creator
  const publicDraftCheck = await fetch(`${BASE_URL}/api/creators`);
  const publicDraftJson = await publicDraftCheck.json();
  const inPublicWhenDraft = publicDraftJson.data?.find((c) => c.slug === testSlug);
  assert(!inPublicWhenDraft, `Draft creator is HIDDEN from public API`);

  // Admin listing MUST still include draft creator
  const adminDraftCheck = await fetch(`${BASE_URL}/api/creators?includeDrafts=true`, {
    headers: { Authorization: ADMIN_BEARER },
  });
  const adminDraftJson = await adminDraftCheck.json();
  const inAdminWhenDraft = adminDraftJson.data?.find((c) => c.slug === testSlug);
  assert(Boolean(inAdminWhenDraft), `Draft creator is VISIBLE to admins`);
  assert(inAdminWhenDraft?.status === "draft", `Creator status is "draft"`);

  // STEP 11: Clean up test creator
  console.log(`\n[STEP 11] Cleaning up test creator...`);
  const deleteRes = await fetch(`${BASE_URL}/api/creators?slug=${testSlug}`, {
    method: "DELETE",
    headers: { Authorization: ADMIN_BEARER },
  });
  assert(deleteRes.status === 200, `DELETE /api/creators returned 200`);

  // Verify removed
  const postDeleteCheck = await fetch(`${BASE_URL}/api/creators?includeDrafts=true`, {
    headers: { Authorization: ADMIN_BEARER },
  });
  const postDeleteJson = await postDeleteCheck.json();
  const inAdminAfterDelete = postDeleteJson.data?.find((c) => c.slug === testSlug);
  assert(!inAdminAfterDelete, `Creator cleanly removed after test completion`);

  console.log(`\n======================================================`);
  console.log(`Lifecycle Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runLifecycleTest().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
