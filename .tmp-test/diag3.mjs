import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('pageerror', err => console.log('[pageerror]', err.message));

await page.addInitScript(() => {
  localStorage.setItem('miazNickname', 'TestKid');
});

await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
await page.click('#play');
await page.waitForTimeout(300);

async function dragLaunch(dxRatio, dyRatio, power=0.9) {
  const box = await page.locator('#canvas').boundingBox();
  const scale = Math.min(box.width/1100, box.height/650);
  const offX = (box.width - 1100*scale)/2;
  const offY = (box.height - 650*scale)/2;
  const startX = box.x + offX + 190*scale;
  const startY = box.y + offY + 440*scale;
  const pullX = startX - dxRatio*145*scale;
  const pullY = startY - dyRatio*145*scale*power;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY, { steps: 10 });
  await page.waitForTimeout(200);
  await page.mouse.up();
}

const initial = await page.evaluate(() => window.__ap());
console.log('INITIAL', JSON.stringify(initial));

await dragLaunch(0.9, 0.3);
await page.waitForTimeout(300);
const midFlight = await page.evaluate(() => window.__ap());
console.log('MID-FLIGHT after shot1 (0.3s)', JSON.stringify(midFlight));

await page.waitForTimeout(1200);
const settled1 = await page.evaluate(() => window.__ap());
console.log('SETTLED after shot1', JSON.stringify(settled1));

await dragLaunch(0.9, 0.5);
await page.waitForTimeout(300);
const midFlight2 = await page.evaluate(() => window.__ap());
console.log('MID-FLIGHT after shot2 (0.3s)', JSON.stringify(midFlight2));

await page.waitForTimeout(2000);
const settled2 = await page.evaluate(() => window.__ap());
console.log('SETTLED after shot2', JSON.stringify(settled2));

await browser.close();
