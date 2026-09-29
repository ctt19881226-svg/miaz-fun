import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('pageerror', err => console.log('[pageerror]', err.message));
await page.addInitScript(() => localStorage.setItem('miazNickname', 'TestKid'));
await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
await page.click('#play');
await page.waitForTimeout(300);

const box = await page.locator('#canvas').boundingBox();
const scale = Math.min(box.width/1100, box.height/650);
const offX = (box.width - 1100*scale)/2;
const offY = (box.height - 650*scale)/2;
const startX = box.x + offX + 190*scale;
const startY = box.y + offY + 440*scale;
const pullX = startX - 1.0*145*scale;
const pullY = startY - 0.45*145*scale;

await page.mouse.move(startX, startY);
await page.mouse.down();
await page.mouse.move(pullX, pullY, { steps: 10 });
await page.waitForTimeout(200);
await page.mouse.up();

let maxX = 0;
for (let i=0;i<20;i++){
  await page.waitForTimeout(150);
  const s = await page.evaluate(() => window.__ap());
  maxX = Math.max(maxX, s.penguin.x);
  console.log(i, JSON.stringify(s.penguin));
  if (!s.penguin.active) break;
}
console.log('maxX', maxX);
await browser.close();
