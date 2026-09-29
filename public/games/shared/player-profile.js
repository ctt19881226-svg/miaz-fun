(() => {
  const STORAGE_KEY = "miazNickname";
  const styles = `
    .miaz-name-layer{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:#2a2430aa;backdrop-filter:blur(7px)}
    .miaz-name-card{width:min(420px,100%);padding:26px;border:4px solid #fff;border-radius:28px;background:#fff8ec;color:#3e342f;box-shadow:0 24px 70px #18121c66;text-align:center;font-family:"Trebuchet MS","Microsoft YaHei",sans-serif}
    .miaz-name-card h2{margin:0 0 8px;font-size:1.7rem}.miaz-name-card p{margin:0 0 17px;color:#74645c;line-height:1.45}
    .miaz-name-card input{width:100%;padding:13px 16px;border:3px solid #35aed0;border-radius:15px;background:#fff;font:700 1.05rem inherit;color:#3e342f;outline:none}.miaz-name-card input:focus{box-shadow:0 0 0 4px #35aed044}
    .miaz-name-card button{margin-top:15px;padding:12px 24px;border:0;border-radius:999px;background:#ff8738;color:#fff;font-weight:900;font-size:1rem;box-shadow:0 5px 0 #d96822;cursor:pointer}.miaz-name-error{min-height:1.2em;margin-top:8px!important;color:#b83c4d!important;font-size:.85rem}
    .miaz-player-chip{position:fixed;z-index:50;left:10px;bottom:10px;border:2px solid #ffffff99;border-radius:999px;padding:7px 11px;background:#3e342fdd;color:#fff;font:700 .78rem "Trebuchet MS",sans-serif;cursor:pointer}
    .miaz-leaderboard{margin-top:14px;padding:11px 13px;border-radius:16px;background:#ffffff14;text-align:left;font-size:.85rem}.miaz-leaderboard strong{display:block;margin-bottom:6px;text-align:center}.miaz-leaderboard ol{margin:0;padding-left:24px}.miaz-leaderboard li{padding:2px 0}.miaz-leaderboard span{float:right;font-weight:900}
    .miaz-sticker-reward{margin:16px auto 5px;text-align:center}.miaz-sticker-reward strong{display:block;margin-bottom:8px;color:#ffd84d;font-size:1rem}.miaz-sticker{width:150px;aspect-ratio:1;margin:auto;background-image:url('/mia/reactions.png');background-size:300% 300%;background-repeat:no-repeat;filter:drop-shadow(0 8px 10px #08091f66);animation:miaz-sticker-pop .45s cubic-bezier(.2,1.5,.5,1)}@keyframes miaz-sticker-pop{from{opacity:0;transform:scale(.35) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(0)}}
  `;
  const style = document.createElement("style"); style.textContent = styles; document.head.append(style);

  const clean = value => value.normalize("NFKC").trim().replace(/\s+/g, " ");
  const valid = value => value.length > 0 && value.length <= 16 && !/[<>\u0000-\u001f\u007f]/u.test(value);
  const getNickname = () => localStorage.getItem(STORAGE_KEY) || "";
  let confirmedThisVisit = false;

  function ensureNickname() {
    if (confirmedThisVisit && getNickname()) return Promise.resolve(getNickname());
    return askNickname();
  }

  function askNickname() {
    return new Promise(resolve => {
      document.querySelector(".miaz-name-layer")?.remove();
      const layer = document.createElement("div");
      layer.className = "miaz-name-layer";
      layer.innerHTML = `<form class="miaz-name-card"><h2>What should we call you?</h2><p>Your nickname will appear on this game's leaderboard.</p><input maxlength="16" autocomplete="nickname" placeholder="Nickname" aria-label="Nickname"><p class="miaz-name-error" aria-live="polite"></p><button type="submit">Let's play! 🎮</button></form>`;
      document.body.append(layer);
      const form = layer.querySelector("form"), input = layer.querySelector("input"), error = layer.querySelector(".miaz-name-error");
      input.value = getNickname(); input.focus();
      form.addEventListener("submit", event => {
        event.preventDefault(); const nickname = clean(input.value);
        if (!valid(nickname)) { error.textContent = "Use 1–16 characters and leave out < or >."; return; }
        localStorage.setItem(STORAGE_KEY, nickname); confirmedThisVisit = true; updateChip(); layer.remove(); resolve(nickname);
      });
    });
  }

  async function submitScore(gameId, score) {
    const nickname = getNickname();
    if (!nickname) return false;
    try {
      const response = await fetch("/api/scores", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({gameId,nickname,score}) });
      return response.ok;
    } catch { return false; }
  }

  async function renderLeaderboard(gameId, container) {
    container.className = "miaz-leaderboard"; container.innerHTML = "<strong>🏆 Leaderboard</strong><div>Loading…</div>";
    try {
      const response = await fetch(`/api/scores?game=${encodeURIComponent(gameId)}`); const data = await response.json();
      if (!response.ok) throw new Error();
      container.innerHTML = `<strong>🏆 Leaderboard</strong>${data.leaderboard.length ? `<ol>${data.leaderboard.map(row => `<li>${escapeHtml(row.playerName)} <span>${row.score}</span></li>`).join("")}</ol>` : "<div>Be the first on the board!</div>"}`;
    } catch { container.innerHTML = "<strong>🏆 Leaderboard</strong><div>Scores will appear when the site is online.</div>"; }
  }

  function stickerFor(gameId, score) {
    const thresholds = gameId === "star-garden" ? [12, 25, 35] : gameId === "neon-rush" ? [500, 1500, 3000] : gameId === "angry-penguins" ? [400, 900, 1500] : [50, 120, 200];
    if (score >= thresholds[2]) return { label:"Perfect!", position:"50% 0%" };
    if (score >= thresholds[1]) return { label:"Awesome!", position:"100% 0%" };
    if (score >= thresholds[0]) return { label:"Good!", position:"0% 0%" };
    return { label:"Try again!", position:"0% 100%" };
  }

  function showSticker(container, gameId, score) {
    const sticker = stickerFor(gameId, score);
    container.querySelector(".miaz-sticker-reward")?.remove();
    const reward = document.createElement("div"); reward.className = "miaz-sticker-reward";
    reward.innerHTML = `<strong>🎉 You earned a Mia sticker!</strong><div class="miaz-sticker" role="img" aria-label="${sticker.label} sticker" style="background-position:${sticker.position}"></div>`;
    container.append(reward);
  }

  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const chip = document.createElement("button"); chip.className = "miaz-player-chip"; chip.type = "button"; chip.onclick = askNickname; document.body.append(chip);
  function updateChip(){ chip.textContent = getNickname() ? `👋 ${getNickname()} · change` : "👋 Choose nickname"; } updateChip();
  window.MiazPlayer = { ensureNickname, getNickname, askNickname, submitScore, renderLeaderboard, showSticker };
})();
