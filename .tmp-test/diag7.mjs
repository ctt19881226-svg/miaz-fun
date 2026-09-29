import { chromium } from 'playwright';

const browser = await chromium.launch();

async function testAngle(dyRatio) {
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
  const pullX = startX - 1.0*145*scale;
  const pullY = startY - dyRatio*145*scale;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY, { steps: 10 });
  await page.waitForTimeout(200);
  await page.mouse.up();

  let last;
  for (let i=0;i<20;i++){
    await page.waitForTimeout(300);
    last = await page.evaluate(() => window.__ap());
    if (!last.penguin.active) break;
  }
  const hud = await page.evaluate(()=>({birds:document.querySelector('#birds').textContent,fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}));
  console.log('dyRatio', dyRatio, 'penguin', JSON.stringify(last.penguin), 'hud', JSON.stringify(hud));
  console.log('  boxes alive:', last.boxes.filter(b=>!b.alive).map(b=>b.type));
  await page.close();
}

for (const dy of [0.15, 0.25, 0.35, 0.45, 0.55, 0.65]) {
  await testAngle(dy);
}

await browser.close();
