import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
await page.addInitScript(() => localStorage.setItem('miazNickname', 'TestKid'));
await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
await page.click('#play');
await page.waitForTimeout(400);
await page.screenshot({ path: '.tmp-test/visual-1-start.png' });

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
  await page.waitForTimeout(150);
  await page.screenshot({ path: '.tmp-test/visual-2-aim.png' });
  await page.mouse.up();
}
await dragLaunch(1.0, 0.3);
await page.waitForTimeout(600);
await page.screenshot({ path: '.tmp-test/visual-3-flight.png' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '.tmp-test/visual-4-shot1-settled.png' });

await dragLaunch(1.0, 0.5);
await page.waitForTimeout(2000);
await page.screenshot({ path: '.tmp-test/visual-5-shot2-settled.png' });

await dragLaunch(1.0, 0.6);
await page.waitForTimeout(2000);
await page.screenshot({ path: '.tmp-test/visual-6-final.png' });

const hud = await page.evaluate(()=>({fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}));
console.log('FINAL HUD', JSON.stringify(hud));
await browser.close();
