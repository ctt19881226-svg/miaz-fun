import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('console', msg => console.log('[console]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[pageerror]', err.message));

await page.addInitScript(() => {
  localStorage.setItem('miazNickname', 'TestKid');
});

await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
await page.click('#play');
await page.waitForTimeout(300);

const state = await page.evaluate(() => ({
  overlayHidden: document.querySelector('#overlay').classList.contains('hidden'),
  nameLayer: !!document.querySelector('.miaz-name-layer'),
}));
console.log('state after play click', state);
await page.screenshot({ path: '.tmp-test/d2-1-play.png' });

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

await dragLaunch(0.9, 0.3);
await page.waitForTimeout(1500);
const hud1 = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
}));
console.log('HUD after shot 1', hud1);
await page.screenshot({ path: '.tmp-test/d2-2-shot1.png' });

await page.waitForTimeout(2000);
await page.screenshot({ path: '.tmp-test/d2-3-settled1.png' });

await dragLaunch(0.9, 0.5);
await page.waitForTimeout(2500);
const hud2 = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
}));
console.log('HUD after shot 2', hud2);
await page.screenshot({ path: '.tmp-test/d2-4-shot2.png' });

await dragLaunch(0.85, 0.15);
await page.waitForTimeout(3000);
const hud3 = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
  overlayHidden: document.querySelector('#overlay').classList.contains('hidden'),
}));
console.log('HUD after shot 3', hud3);
await page.screenshot({ path: '.tmp-test/d2-5-shot3.png' });

await page.waitForTimeout(1500);
await page.screenshot({ path: '.tmp-test/d2-6-final.png' });

await browser.close();
