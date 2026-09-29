import { env } from "cloudflare:workers";

const GAME_IDS = new Set(["star-garden", "snake-fruit", "neon-rush", "angry-penguins", "keyboard-island"]);

function cleanNickname(value: unknown) {
  if (typeof value !== "string") return null;
  const nickname = value.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (nickname.length < 1 || nickname.length > 16) return null;
  if (/[<>\u0000-\u001f\u007f]/u.test(nickname)) return null;
  return nickname;
}

function unavailable(error: unknown) {
  console.error("Leaderboard unavailable", error);
  return Response.json({ error: "Leaderboard is temporarily unavailable." }, { status: 503 });
}

export async function GET(request: Request) {
  const gameId = new URL(request.url).searchParams.get("game") ?? "";
  if (!GAME_IDS.has(gameId)) return Response.json({ error: "Unknown game." }, { status: 400 });
  try {
    const result = await env.DB.prepare(
      `SELECT player_name AS playerName, MAX(score) AS score
       FROM scores
       WHERE game_id = ?
       GROUP BY player_name
       ORDER BY score DESC, MIN(created_at) ASC
       LIMIT 10`,
    ).bind(gameId).all<{ playerName: string; score: number }>();
    return Response.json({ leaderboard: result.results ?? [] });
  } catch (error) {
    return unavailable(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { gameId?: unknown; nickname?: unknown; score?: unknown };
    const gameId = typeof body.gameId === "string" ? body.gameId : "";
    const nickname = cleanNickname(body.nickname);
    const score = typeof body.score === "number" && Number.isInteger(body.score) ? body.score : -1;
    if (!GAME_IDS.has(gameId) || !nickname || score < 0 || score > 100000) {
      return Response.json({ error: "Invalid score submission." }, { status: 400 });
    }
    await env.DB.prepare("INSERT INTO scores (game_id, player_name, score) VALUES (?, ?, ?)")
      .bind(gameId, nickname, score)
      .run();
    return Response.json({ saved: true }, { status: 201 });
  } catch (error) {
    return unavailable(error);
  }
}
