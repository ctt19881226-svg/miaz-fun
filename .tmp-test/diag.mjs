import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('console', msg => console.log('[console]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[pageerror]', err.message));

await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');

// hook diagnostics before starting the game
await page.evaluate(() => {
  const cv = document.querySelector('#canvas');
  ['pointerdown','pointermove','pointerup'].forEach(type => {
    cv.addEventListener(type, e => {
      console.log('DIAG', type, e.clientX, e.clientY, e.pointerType, e.buttons);
    });
  });
});

await page.click('#play');
await page.waitForTimeout(300);

const state = await page.evaluate(() => ({
  overlayHidden: document.querySelector('#overlay').classList.contains('hidden'),
  nameLayer: !!document.querySelector('.miaz-name-layer'),
}));
console.log('state after play click', state);

const box = await page.locator('#canvas').boundingBox();
const scale = Math.min(box.width/1100, box.height/650);
const offX = (box.width - 1100*scale)/2;
const offY = (box.height - 650*scale)/2;
const startX = box.x + offX + 190*scale;
const startY = box.y + offY + 440*scale;
const pullX = startX - 0.9*145*scale;
const pullY = startY - 0.3*145*scale*0.9;

console.log('moving to', startX, startY);
await page.mouse.move(startX, startY);
console.log('mouse down');
await page.mouse.down();
console.log('dragging to', pullX, pullY);
await page.mouse.move(pullX, pullY, { steps: 10 });
await page.waitForTimeout(200);
console.log('mouse up');
await page.mouse.up();

await page.waitForTimeout(500);
const hud = await page.evaluate(() => ({
  birds: document.querySelector('#birds').textContent,
  fish: document.querySelector('#fish').textContent,
  score: document.querySelector('#score').textContent,
}));
console.log('HUD after drag', hud);

await browser.close();
