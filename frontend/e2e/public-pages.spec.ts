import { expect, test } from "@playwright/test";

/**
 * Pre-rendered public pages (ADR 0008, design 06 H8) on the patient-web mock build: the content is
 * in the HTML before JavaScript runs, and hydration doesn't change what is visible.
 */
const PATIENT = "http://localhost:4174";

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ["/", "/for-facilities"]) {
    test(`${path} is readable from the HTML alone`, async ({ page }) => {
      await page.goto(PATIENT + path);
      await expect(page.locator("html")).toHaveAttribute("lang", "rw");
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page).toHaveTitle(/ · MediLink Rwanda$/);
    });
  }

  test("a facility page is pre-rendered from the public profile", async ({ page }) => {
    await page.goto(PATIENT + "/facilities/kigali-clinic");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kigali Clinic");
  });
});

test("hydration keeps the pre-rendered landing page as it is", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.request.get(PATIENT + "/");
  const html = await response.text();
  // the heading's text: tags dropped and HTML entities decoded ("y&#x27;aho" reads "y'aho")
  const prerendered = /<h1\b[^>]*>([\s\S]*?)<\/h1>/
    .exec(html)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  await page.goto(PATIENT + "/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText(prerendered!.trim());
  // interactive once hydrated: the language switch re-renders the page in English. A change
  // made before React attaches is lost, so retry until hydration has taken over.
  await expect(async () => {
    await page.getByRole("combobox", { name: "Ururimi" }).first().selectOption("en");
    await expect(heading).not.toHaveText(prerendered!.trim(), { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  expect(errors.filter((e) => /hydrat|did not match/i.test(e))).toEqual([]);
});

/** English, so names and messages are matched in one language (the site defaults to Kinyarwanda). */
const ENGLISH = `localStorage.setItem("medilink.language", "en")`;
// MOCK_PASSWORD in packages/api-client/src/mocks/data.ts (test fixture)
const PASSWORD = "MediLink-demo-2026";

/**
 * Public site audit 2026-11-07, phase 5: search → facility → book (signed out) → sign in → back on
 * the booking, with the sign-in page saying what was being booked.
 */
test("search, open a facility, book, sign in and land back on the booking", async ({ page }) => {
  // Monday 10:00 in Kigali: facilities are open
  await page.clock.setFixedTime(new Date("2026-11-09T08:00:00Z"));
  await page.addInitScript({ content: ENGLISH });
  await page.goto(PATIENT + "/");
  await page.getByRole("searchbox").first().fill("Kigali Clinic");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/\/find-care/);
  await page
    .getByRole("link", { name: /Kigali Clinic/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kigali Clinic");

  await page
    .getByRole("link", { name: /^(Book appointment|Join today's queue)$/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByText(/^Sign in to (book|join the queue for) .*Kigali Clinic/),
  ).toBeVisible();

  await page.getByLabel("Email").fill("patient@medilink.test");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/book\/kigali-clinic\?/);
  await expect(page.getByText(/^Step 1 of \d$/)).toBeVisible();
});

test("the home page says when everything is closed, with no empty figures", async ({ page }) => {
  // Sunday 23:00 in Kigali: every mock facility is closed
  await page.clock.setFixedTime(new Date("2026-11-08T21:00:00Z"));
  await page.addInitScript({ content: ENGLISH });
  await page.goto(PATIENT + "/");
  await expect(page.getByText("All facilities are closed now")).toBeVisible();
  await expect(page.getByRole("link", { name: /next opening Mon/ })).toBeVisible();
  // exact: the home FAQ's answer mentions "the people waiting now"
  await expect(page.getByText("People waiting", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Typical wait", { exact: true })).toHaveCount(0);
});

test.describe("phone width", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the menu opens full screen, closes with Escape and navigates", async ({ page }) => {
    await page.addInitScript({ content: ENGLISH });
    await page.goto(PATIENT + "/");
    const button = page.getByRole("button", { name: "Menu" });
    const menu = page.getByRole("dialog", { name: "Menu" });
    // the home page is pre-rendered: a tap before React attaches does nothing, so retry
    await expect(async () => {
      await button.click();
      await expect(menu).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await menu.getByRole("link", { name: "Doctors" }).click();
    await expect(page).toHaveURL(/\/doctors$/);
    await expect(menu).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // nothing wider than the screen
    const overflow = await page.evaluate<number>(
      "document.documentElement.scrollWidth - document.documentElement.clientWidth",
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

/**
 * Public site audit 2026-11-07 (A1 #1–2): every doctor and service link on the directories opens a
 * real page with its own <h1>, never "not found".
 */
for (const [list, prefix, missing] of [
  ["/doctors", "/doctors/", "Doctor not found"],
  ["/services", "/services/", "Service not found"],
] as const) {
  test(`every link on ${list} opens its page`, async ({ page }) => {
    // English names, so "not found" is matched in one language (the site defaults to Kinyarwanda)
    await page.addInitScript({ content: `localStorage.setItem("medilink.language", "en")` });
    await page.goto(PATIENT + list);
    const links = page.locator(`main a[href^="${prefix}"]`);
    await expect(links.first()).toBeVisible();
    const hrefs = new Set<string>();
    for (const link of await links.all()) hrefs.add((await link.getAttribute("href")) ?? "");
    expect(hrefs.size).toBeGreaterThan(3);
    for (const href of hrefs) {
      await page.goto(PATIENT + href);
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toHaveCount(1);
      await expect(heading, href).not.toHaveText(missing);
    }
  });
}
