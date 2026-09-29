import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('console', msg => console.log('[console]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[pageerror]', err.message));

await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
await page.screenshot({ path: '.tmp-test/1-overlay.png' });

await page.click('#play');
await page.waitForTimeout(300);
await page.screenshot({ path: '.tmp-test/2-play-start.png' });

const canvasBox = await page.locator('#canvas').boundingBox();
console.log('canvas box', canvasBox);

// Convert game coords (190,440) to screen coords using same logic as browser: we'll just estimate.
// The canvas maps 1100x650 virtual space onto canvas.clientWidth/Height with letterboxing.
// Let's ask the page for penguin position directly via evaluate isn't possible (closured). Instead do drag near left-center.

async function dragLaunch(dxRatio, dyRatio, power=0.9) {
  const box = await page.locator('#canvas').boundingBox();
  // approximate penguin start screen pos: game coords (190,440) in 1100x650 space, centered/scaled (letterboxed)
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
await page.screenshot({ path: '.tmp-test/3-after-launch1.png' });

await page.waitForTimeout(2000);
await page.screenshot({ path: '.tmp-test/4-settled1.png' });

const hud1 = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
}));
console.log('HUD after shot 1', hud1);

await dragLaunch(0.9, 0.5);
await page.waitForTimeout(2500);
await page.screenshot({ path: '.tmp-test/5-after-launch2.png' });

const hud2 = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
}));
console.log('HUD after shot 2', hud2);

await dragLaunch(0.85, 0.15);
await page.waitForTimeout(3000);
await page.screenshot({ path: '.tmp-test/6-after-launch3.png' });

const hud3 = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
  overlayHidden: document.querySelector('#overlay').classList.contains('hidden'),
}));
console.log('HUD after shot 3', hud3);

await page.waitForTimeout(1500);
await page.screenshot({ path: '.tmp-test/7-final.png' });

await browser.close();
