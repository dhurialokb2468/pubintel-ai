const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const ARTIFACTS_DIR = "C:\\Users\\AlokDhuri\\.gemini\\antigravity\\brain\\2bb8a88f-e5af-4256-b50b-5e02acab9e9f";

async function runComprehensiveUITests() {
  console.log("Starting final Playwright verification audit...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const pagesToTest = [
    { name: "home", path: "https://dhurialokb2468.github.io/opportunity-radar/" },
    { name: "discover", path: "https://dhurialokb2468.github.io/opportunity-radar/discover/" },
    { name: "results", path: "https://dhurialokb2468.github.io/opportunity-radar/results/?q=Agentic+AI" },
    { name: "opportunity_detail", path: "https://dhurialokb2468.github.io/opportunity-radar/opportunity/item-agentic-ai-pm-course/" },
    { name: "creator_detail", path: "https://dhurialokb2468.github.io/opportunity-radar/creator/creator-elena-rostova/" },
    { name: "csv_import", path: "https://dhurialokb2468.github.io/opportunity-radar/import/" },
    { name: "saved_searches", path: "https://dhurialokb2468.github.io/opportunity-radar/saved-searches/" },
  ];

  const auditResults = [];

  for (const item of pagesToTest) {
    try {
      const resp = await page.goto(item.path, { waitUntil: "networkidle", timeout: 25000 });
      const status = resp ? resp.status() : 0;
      const screenshotPath = path.join(ARTIFACTS_DIR, `screenshot-${item.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const hasNavbar = await page.isVisible("header");
      const hasHeading = (await page.$$("h1")).length > 0;

      auditResults.push({
        name: item.name,
        status,
        hasNavbar,
        hasHeading,
        screenshot: screenshotPath
      });
      console.log(`✔ ${item.name}: Status ${status}, Navbar: ${hasNavbar}, Heading: ${hasHeading}`);
    } catch (e) {
      console.error(`❌ Error testing ${item.name}:`, e.message);
      auditResults.push({ name: item.name, status: "ERROR", error: e.message });
    }
  }

  console.log("\n=== FINAL AUDIT REPORT ===");
  console.log(JSON.stringify(auditResults, null, 2));

  await browser.close();
}

runComprehensiveUITests().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
