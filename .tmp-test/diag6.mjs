import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('console', msg => console.log('[console]', msg.text()));
page.on('pageerror', err => console.log('[pageerror]', err.message));

await page.addInitScript(() => {
  localStorage.setItem('miazNickname', 'TestKid');
});

await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');

await page.evaluate(() => {
  const cv = document.querySelector('#canvas');
  ['pointerdown','pointermove','pointerup'].forEach(type => {
    cv.addEventListener(type, e => {
      console.log('DIAG', type, e.clientX.toFixed(0), e.clientY.toFixed(0));
    });
  });
});

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
  console.log('DRAG plan', startX.toFixed(0), startY.toFixed(0), '->', pullX.toFixed(0), pullY.toFixed(0));
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY, { steps: 10 });
  await page.waitForTimeout(200);
  await page.mouse.up();
}

console.log('=== SHOT 1 ===');
await dragLaunch(1.0, 0.6, 1.0);
await page.waitForTimeout(3500);
console.log('birds after shot1', await page.evaluate(() => document.querySelector('#birds').textContent));

console.log('=== SHOT 2 ===');
await dragLaunch(1.0, 0.75, 1.0);
await page.waitForTimeout(500);
console.log('birds right after shot2 drag', await page.evaluate(() => document.querySelector('#birds').textContent));
const st = await page.evaluate(() => window.__ap());
console.log('penguin state after shot2 drag', JSON.stringify(st.penguin));

await browser.close();
