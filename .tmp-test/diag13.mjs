import { chromium } from 'playwright';

const browser = await chromium.launch();

async function testShot(dx, dy) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
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
  const pullX = startX - dx*145*scale;
  const pullY = startY - dy*145*scale;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY, { steps: 10 });
  await page.waitForTimeout(200);
  await page.mouse.up();

  const launchState = await page.evaluate(() => window.__ap());
  let maxX = launchState.penguin.x, apex = launchState.penguin.y;
  for (let i=0;i<40;i++){
    await page.waitForTimeout(100);
    const s = await page.evaluate(() => window.__ap());
    maxX = Math.max(maxX, s.penguin.x);
    apex = Math.min(apex, s.penguin.y);
    if (!s.penguin.active) break;
  }
  console.log('dx',dx,'dy',dy, 'launchV', JSON.stringify({vx:launchState.penguin.vx.toFixed(0),vy:launchState.penguin.vy.toFixed(0)}), 'maxX', maxX.toFixed(0), 'apexY', apex.toFixed(0));
  await page.close();
}

for (const [dx,dy] of [[1.0,0.3],[1.0,0.6],[1.0,1.0],[0.7,1.0],[0.5,1.0],[0.3,1.0]]) {
  await testShot(dx, dy);
}
await browser.close();
