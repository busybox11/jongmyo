import {
  type NowPlayingState,
  parseNowPlayingState,
  type ServerMessage,
} from "@jongmyo/protocol";
import type { ServerWebSocket } from "bun";
import { jongmyoDebug } from "./debug";

const PORT = Number.parseInt(process.env.JONGMYO_DAEMON_PORT ?? "8787", 10);

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(res: Response): Response {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders)) {
    h.set(k, v);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: h,
  });
}

let lastState: NowPlayingState | null = null;
const subscribers = new Set<ServerWebSocket>();

function broadcast(msg: ServerMessage): void {
  const payload = JSON.stringify(msg);
  let sent = 0;
  for (const ws of subscribers) {
    try {
      ws.send(payload);
      sent += 1;
    } catch {
      subscribers.delete(ws);
    }
  }
  jongmyoDebug(
    "broadcast",
    msg.type,
    { title: msg.state.title, artist: msg.state.artist },
    `sent=${sent}, subscribers=${subscribers.size}`,
  );
}

function snapshotMessage(): ServerMessage | null {
  if (!lastState) return null;
  return { type: "now_playing", state: lastState };
}

Bun.serve({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      jongmyoDebug("http", "OPTIONS", url.pathname);
      return withCors(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/ws") {
      jongmyoDebug("ws", "upgrade request");
      const upgraded = server.upgrade(req);
      if (upgraded) {
        return undefined;
      }
      return withCors(
        new Response("WebSocket upgrade failed", { status: 500 }),
      );
    }

    if (url.pathname === "/health" && req.method === "GET") {
      jongmyoDebug("http", "GET /health");
      return withCors(new Response("ok", { status: 200 }));
    }

    if (url.pathname === "/v1/now-playing" && req.method === "GET") {
      jongmyoDebug("http", "GET /v1/now-playing", {
        hasState: lastState !== null,
      });
      return withCors(Response.json({ state: lastState }));
    }

    if (url.pathname === "/v1/now-playing" && req.method === "POST") {
      jongmyoDebug("http", "POST /v1/now-playing");
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        jongmyoDebug("http", "POST body: invalid JSON");
        return withCors(
          Response.json({ error: "invalid_json" }, { status: 400 }),
        );
      }
      let state: NowPlayingState;
      try {
        state = parseNowPlayingState(body);
      } catch {
        jongmyoDebug("http", "POST body: validation failed", body);
        return withCors(
          Response.json({ error: "validation_failed" }, { status: 400 }),
        );
      }
      jongmyoDebug("http", "POST ok", {
        title: state.title,
        artist: state.artist,
        playing: state.progress.playing,
      });
      lastState = state;
      const msg: ServerMessage = { type: "now_playing", state };
      broadcast(msg);
      return withCors(Response.json({ ok: true }));
    }

    jongmyoDebug("http", "404", req.method, url.pathname);
    return withCors(new Response("Not found", { status: 404 }));
  },
  websocket: {
    open(ws) {
      subscribers.add(ws);
      jongmyoDebug("ws", "open", `subscribers=${subscribers.size}`);
      const snap = snapshotMessage();
      if (snap) {
        ws.send(JSON.stringify(snap));
        jongmyoDebug("ws", "snapshot sent", snap?.type);
      }
    },
    message(_ws, _message) {
      if (_message != null && String(_message).length > 0) {
        jongmyoDebug("ws", "message (ignored)", String(_message));
      }
    },
    close(ws) {
      subscribers.delete(ws);
      jongmyoDebug("ws", "close", `subscribers=${subscribers.size}`);
    },
  },
});

console.log(`[jongmyo-daemon] listening on http://127.0.0.1:${PORT} (ws /ws)`);
jongmyoDebug("boot", `JONGMYO_DEBUG=${process.env.JONGMYO_DEBUG ?? "(unset)"}`);
