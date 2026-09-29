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

async function waitReady(page) {
  for (let i=0;i<40;i++){
    await page.waitForTimeout(150);
    const s = await page.evaluate(() => window.__ap());
    if (!s.penguin.active) return s;
  }
  return await page.evaluate(() => window.__ap());
}

async function playthrough(shots, label) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
  await page.addInitScript(() => localStorage.setItem('miazNickname', 'TestKid'));
  await page.goto('http://localhost:4321/games/angry-penguins/index.html');
  await page.waitForSelector('#play');
  await page.click('#play');
  await page.waitForTimeout(300);

  for (const [dx, dy] of shots) {
    await dragLaunch(page, dx, dy, 1.0);
    await waitReady(page);
  }
  const hud = await page.evaluate(()=>({fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}));
  const s = await page.evaluate(() => window.__ap());
  console.log(label, JSON.stringify(hud), 'alive:', s.boxes.filter(b=>b.alive).map(b=>b.type+'@'+b.x));
  await page.close();
}

await playthrough([[1.0,0.42],[1.0,0.32],[1.0,0.32]], 'flat-flat-flat');
await playthrough([[1.0,0.42],[1.0,0.6],[1.0,0.6]], 'near-mid-mid');
await playthrough([[1.0,0.35],[1.0,0.5],[1.0,0.7]], 'v2');
await playthrough([[1.0,0.4],[1.0,0.45],[1.0,0.55]], 'v3');
await browser.close();
