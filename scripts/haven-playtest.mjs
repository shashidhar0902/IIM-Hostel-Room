import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=angle", "--use-angle=swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const consoleErrors = [];
const pageErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => pageErrors.push(String(err?.message || err)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(2500);
const canvasCount = await page.locator("canvas").count();
await page.getByRole("button", { name: /enter the room/i }).click();
await page.waitForTimeout(1500);

const probe = await page.evaluate(async () => {
  const p = window.__controlsTest;
  if (!p) return { ok: false, reason: "no probe" };
  p.startGame();
  p.setYaw(0);
  const a0 = p.getPos();
  p.setKeys(["KeyA"]);
  await new Promise((r) => setTimeout(r, 450));
  const a1 = p.getPos();
  p.setKeys(["KeyD"]);
  await new Promise((r) => setTimeout(r, 450));
  const d1 = p.getPos();
  p.setKeys(["KeyW"]);
  await new Promise((r) => setTimeout(r, 400));
  const w1 = p.getPos();
  p.setKeys([]);
  return { ok: true, a0, a1, d1, w1, yaw: p.getYaw(), speed: p.getSpeed() };
});

try {
  await page.screenshot({
    path: "/workspace/screenshots/haven-play.png",
    timeout: 8000,
    animations: "disabled",
  });
} catch (err) {
  console.log("screenshot_failed", String(err));
}

console.log(JSON.stringify({ consoleErrors, pageErrors, canvasCount, probe }, null, 2));
await browser.close();
if (pageErrors.length || !probe.ok) process.exit(1);
