import { chromium } from 'playwright';

const browser = await chromium.launch();

async function dragLaunch(page, dxRatio, dyRatio, power=1.0) {
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

// Poll HUD text (#fish, #score, #birds) until it stops changing for a stretch,
// since window.__ap() debug hook has been removed from the shipped game.
async function waitSettled(page, maxMs=6000, stableFor=500) {
  const start = Date.now();
  let last = null, lastChangeAt = Date.now();
  while (Date.now() - start < maxMs) {
    const hud = await page.evaluate(() => ({
      fish: document.querySelector('#fish')?.textContent,
      score: document.querySelector('#score')?.textContent,
      birds: document.querySelector('#birds')?.textContent,
    }));
    const key = JSON.stringify(hud);
    if (key !== last) { last = key; lastChangeAt = Date.now(); }
    if (Date.now() - lastChangeAt >= stableFor) return hud;
    await page.waitForTimeout(100);
  }
  return JSON.parse(last);
}

const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
await page.addInitScript(() => localStorage.setItem('miazNickname', 'TestKid'));
await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
await page.screenshot({ path: 'final-1-start.png' });
await page.click('#play');
await page.waitForTimeout(300);

const shots = [[1.0, 0.3], [1.0, 0.5], [1.0, 0.6]];
for (let i = 0; i < shots.length; i++) {
  const [dx, dy] = shots[i];
  await dragLaunch(page, dx, dy, 1.0);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `final-2-shot${i+1}-flight.png` });
  const hud = await waitSettled(page);
  await page.screenshot({ path: `final-3-shot${i+1}-settled.png` });
  console.log(`after shot ${i+1} ->`, JSON.stringify(hud));
}

await page.waitForTimeout(500);
await page.screenshot({ path: 'final-4-end.png' });

await browser.close();
