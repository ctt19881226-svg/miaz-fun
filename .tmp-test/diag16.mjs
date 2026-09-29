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

async function playthrough(page, shots) {
  await page.goto('http://localhost:4321/games/angry-penguins/index.html');
  await page.waitForSelector('#play');
  await page.click('#play');
  await page.waitForTimeout(300);
  for (const [dx, dy] of shots) {
    await dragLaunch(page, dx, dy, 1.0);
    await waitReady(page);
  }
  const hud = await page.evaluate(()=>({fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}));
  return hud;
}

const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
await page.addInitScript(() => localStorage.setItem('miazNickname', 'TestKid'));

let wins = 0, total = 0;
const results = [];
for (const dy1 of [0.38, 0.4, 0.42]) {
  for (const dy2 of [0.42, 0.48, 0.55]) {
    for (const dy3 of [0.55, 0.65]) {
      total++;
      const hud = await playthrough(page, [[1.0,dy1],[1.0,dy2],[1.0,dy3]]);
      const win = hud.fish === '3/3';
      if (win) wins++;
      results.push(`dy(${dy1},${dy2},${dy3}) -> ${hud.fish} ${hud.score}${win?' WIN':''}`);
    }
  }
}
console.log(results.join('\n'));
console.log(`\n${wins}/${total} combos won all 3 fish`);
await browser.close();
