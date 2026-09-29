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

async function dragLaunch(dxRatio, dyRatio, power=1.0) {
  const box = await page.locator('#canvas').boundingBox();
  const scale = Math.min(box.width/1100, box.height/650);
  const offX = (box.width - 1100*scale)/2;
  const offY = (box.height - 650*scale)/2;
  const startX = box.x + offX + 190*scale;
  const startY = box.y + offY + 440*scale;
  const pullX = startX - dxRatio*145*scale*power;
  const pullY = startY - dyRatio*145*scale*power;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY, { steps: 10 });
  await page.waitForTimeout(200);
  await page.mouse.up();
}

await dragLaunch(1.0, 0.6, 1.0);
for (let i=0;i<25;i++){
  await page.waitForTimeout(300);
  const s = await page.evaluate(() => window.__ap());
  const birds = await page.evaluate(() => document.querySelector('#birds').textContent);
  console.log(i, 'birds='+birds, 'penguin', JSON.stringify(s.penguin));
}
await browser.close();
