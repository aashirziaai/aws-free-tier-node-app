// app/server.js
import express from "express";
import os from "os";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  const inst = os.hostname();
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>AWS Free Tier Node App</title>
      <style>
        :root { --bg:#0f172a; --card:#111827; --text:#e5e7eb; --accent:#22d3ee; }
        *{box-sizing:border-box} body{margin:0;background:radial-gradient(1200px 600px at 20% -10%,rgba(34,211,238,.15),transparent),var(--bg);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial;color:var(--text)}
        .wrap{min-height:100vh;display:grid;place-items:center;padding:32px}
        .card{max-width:720px;width:100%;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:28px 28px 24px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
        .title{font-size:28px;margin:0 0 6px}
        .subtitle{margin:0 0 20px;color:#a3a3a3}
        .pill{display:inline-flex;gap:8px;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.3);color:#67e8f9;font-weight:600;font-size:13px}
        .grid{display:grid;gap:12px;margin:18px 0 0}
        .row{display:flex;gap:10px;align-items:center}
        .key{color:#9ca3af;min-width:120px}
        .value{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}
        .footer{margin-top:22px;display:flex;gap:10px;flex-wrap:wrap}
        .btn{appearance:none;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.04);color:#e5e7eb;padding:8px 12px;border-radius:10px;text-decoration:none;transition:all .2s}
        .btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.25)}
        .ok{color:#22c55e;font-weight:700}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="card">
          <div class="pill">🚀 Deployed via GitHub Actions → Docker Hub → EC2</div>
          <h1 class="title">Hello from Node.js on AWS Free Tier (t2.micro)</h1>
          <p class="subtitle">This page is served by an Express container running on your EC2 instance.</p>

          <div class="grid">
            <div class="row"><div class="key">Instance</div><div class="value">${inst}</div></div>
            <div class="row"><div class="key">Port</div><div class="value">3000 → 80</div></div>
            <div class="row"><div class="key">Health</div><div class="value ok">/health = ok</div></div>
          </div>

          <div class="footer">
            <a class="btn" href="/health">Health JSON</a>
            <a class="btn" href="https://hub.docker.com/r/aashirziaai/free-tier-node-app" target="_blank">Docker Hub</a>
            <a class="btn" href="https://github.com/aashirziaai/aws-free-tier-node-app" target="_blank">GitHub</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", hostname: os.hostname(), ts: new Date().toISOString() });
});

app.listen(port, "0.0.0.0", () => console.log(`Server listening on ${port}`));
