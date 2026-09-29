import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 } });
page.on('pageerror', err => console.log('[pageerror]', err.message));
await page.addInitScript(() => localStorage.setItem('miazNickname', 'TestKid'));
await page.goto('http://localhost:4321/games/angry-penguins/index.html');
await page.waitForSelector('#play');
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
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY, { steps: 10 });
  await page.waitForTimeout(200);
  await page.mouse.up();
}

async function waitReady() {
  for (let i=0;i<40;i++){
    await page.waitForTimeout(150);
    const s = await page.evaluate(() => window.__ap());
    if (!s.penguin.active) return s;
  }
  return await page.evaluate(() => window.__ap());
}

// Shot 1: aim for the first ice ledge / seal cluster, fairly flat & powerful
await dragLaunch(1.0, 0.42, 1.0);
let s1 = await waitReady();
console.log('AFTER SHOT1', JSON.stringify(await page.evaluate(()=>({birds:document.querySelector('#birds').textContent,fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}))));
console.log('  dead:', s1.boxes.filter(b=>!b.alive).map(b=>b.type));

// Shot 2: higher arc to try to reach the second cluster (tnt/seal/fish around x=900-970)
await dragLaunch(1.0, 0.55, 1.0);
let s2 = await waitReady();
console.log('AFTER SHOT2', JSON.stringify(await page.evaluate(()=>({birds:document.querySelector('#birds').textContent,fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}))));
console.log('  dead:', s2.boxes.filter(b=>!b.alive).map(b=>b.type));
console.log('  alive:', s2.boxes.filter(b=>b.alive).map(b=>b.type+'@'+b.x));

// Shot 3
await dragLaunch(1.0, 0.6, 1.0);
let s3 = await waitReady();
console.log('AFTER SHOT3', JSON.stringify(await page.evaluate(()=>({birds:document.querySelector('#birds').textContent,fish:document.querySelector('#fish').textContent,score:document.querySelector('#score').textContent}))));
console.log('  dead:', s3.boxes.filter(b=>!b.alive).map(b=>b.type));
console.log('  alive:', s3.boxes.filter(b=>b.alive).map(b=>b.type+'@'+b.x));

await page.screenshot({ path: '.tmp-test/d9-final.png' });
await browser.close();
