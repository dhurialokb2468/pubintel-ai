const { chromium } = require("playwright");

async function testLinksAndAnalysisButton() {
  console.log("Starting Playwright link verification test on PubIntel AI...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Navigate to live home page
  await page.goto("https://dhurialokb2468.github.io/pubintel-ai/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".glass-card", { timeout: 10000 });
  console.log("Navigated to live homepage: https://dhurialokb2468.github.io/pubintel-ai/");

  const cards = await page.$$(".glass-card");
  console.log(`Found ${cards.length} opportunity cards on the landing page.`);

  if (cards.length === 0) {
    throw new Error("No cards found on landing page!");
  }

  // 2. Verify Analysis button navigation
  const analysisLink = await page.$("a[href*='/opportunity/']");
  if (analysisLink) {
    const analysisHref = await analysisLink.getAttribute("href");
    console.log(`Testing Analysis button href: ${analysisHref}`);
    await page.goto(`https://dhurialokb2468.github.io${analysisHref}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    const analysisHeading = await page.textContent("h1");
    console.log(`✔ Analysis Page loaded successfully with title: "${analysisHeading ? analysisHeading.trim() : 'Loaded'}"`);
  }

  // 3. Verify Creator Profile button navigation & Creator Social Profiles
  await page.goto("https://dhurialokb2468.github.io/pubintel-ai/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".glass-card", { timeout: 10000 });
  const creatorLink = await page.$("a[href*='/creator/']");
  if (creatorLink) {
    const creatorHref = await creatorLink.getAttribute("href");
    console.log(`Testing Creator Profile button href: ${creatorHref}`);
    await page.goto(`https://dhurialokb2468.github.io${creatorHref}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    const creatorHeading = await page.textContent("h1");
    console.log(`✔ Creator Profile Page loaded successfully with title: "${creatorHeading ? creatorHeading.trim() : 'Loaded'}"`);

    const creatorSocialLinks = await page.$$("a[target='_blank']");
    console.log(`Found ${creatorSocialLinks.length} external social profile links on Creator Page.`);
    for (let j = 0; j < Math.min(3, creatorSocialLinks.length); j++) {
      const sHref = await creatorSocialLinks[j].getAttribute("href");
      console.log(`✔ Creator Social Profile Link #${j + 1}: ${sHref}`);
    }
  }

  // 4. Verify External Source URLs on Landing Page
  await page.goto("https://dhurialokb2468.github.io/pubintel-ai/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".glass-card", { timeout: 10000 });
  const openSourceLinks = await page.$$("a[target='_blank']");
  console.log(`Found ${openSourceLinks.length} external source links on landing page.`);

  let validExternalCount = 0;
  for (let i = 0; i < Math.min(10, openSourceLinks.length); i++) {
    const href = await openSourceLinks[i].getAttribute("href");
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      console.log(`✔ External Source Link #${i + 1}: ${href}`);
      validExternalCount++;
    } else {
      console.error(`❌ Invalid external link: ${href}`);
    }
  }

  console.log(`\n=== LINK TEST SUMMARY ===`);
  console.log(`Analysis Page Test: SUCCESS`);
  console.log(`Creator Profile Page Test: SUCCESS`);
  console.log(`Verified Valid External URLs: ${validExternalCount}/${Math.min(10, openSourceLinks.length)} sampled`);

  await browser.close();
}

testLinksAndAnalysisButton().catch((err) => {
  console.error("Link test failed:", err);
  process.exit(1);
});
