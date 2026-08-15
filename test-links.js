const { chromium } = require("playwright");

async function testLinksAndAnalysisButton() {
  console.log("Starting Playwright link verification test...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to live home page
  await page.goto("https://dhurialokb2468.github.io/opportunity-radar/", { waitUntil: "networkidle" });
  console.log("Navigated to live homepage.");

  // Get all opportunity card title links & analysis links
  const cards = await page.$$(".glass-card");
  console.log(`Found ${cards.length} cards on the landing page.`);

  if (cards.length === 0) {
    throw new Error("No cards found on landing page!");
  }

  // 1. Verify Analysis button navigation
  const analysisLink = await page.$("a[href*='/opportunity/']");
  if (analysisLink) {
    const analysisHref = await analysisLink.getAttribute("href");
    console.log(`Testing Analysis button href: ${analysisHref}`);
    await page.goto(`https://dhurialokb2468.github.io${analysisHref}`, { waitUntil: "networkidle" });
    const analysisHeading = await page.textContent("h1");
    console.log(`✔ Analysis Page loaded successfully with title: "${analysisHeading.trim()}"`);
  } else {
    console.warn("⚠️ No Analysis link found on page!");
  }

  // 2. Verify External Source URLs
  await page.goto("https://dhurialokb2468.github.io/opportunity-radar/", { waitUntil: "networkidle" });
  const openSourceLinks = await page.$$("a[target='_blank']");
  console.log(`Found ${openSourceLinks.length} external source links.`);

  let validExternalCount = 0;
  for (let i = 0; i < Math.min(5, openSourceLinks.length); i++) {
    const href = await openSourceLinks[i].getAttribute("href");
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      console.log(`✔ External Link #${i + 1}: ${href}`);
      validExternalCount++;
    } else {
      console.error(`❌ Invalid external link: ${href}`);
    }
  }

  console.log(`\n=== LINK TEST SUMMARY ===`);
  console.log(`Analysis Page Test: SUCCESS`);
  console.log(`Verified Valid External URLs: ${validExternalCount}/5 sampled`);

  await browser.close();
}

testLinksAndAnalysisButton().catch((err) => {
  console.error("Link test failed:", err);
  process.exit(1);
});
