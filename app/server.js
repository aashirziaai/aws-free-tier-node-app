// app/server.js
const express = require("express");
const os = require("os");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.get("/", (_, res) => {
  const host = os.hostname();
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AWS Free Tier Node.js App</title>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --fg:#eaf2ff;
      --muted:#cbd5e1;
      --accent:#7dd3fc;
      --accent-2:#a78bfa;
      --glass:rgba(255,255,255,.08);
      --stroke:rgba(255,255,255,.12);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial,sans-serif;
      color:var(--fg);
      background:
        radial-gradient(1200px 600px at 10% -10%, #0ea5e9 0%, transparent 60%),
        radial-gradient(1000px 600px at 110% 10%, #8b5cf6 0%, transparent 55%),
        #0b1220;
      display:grid; place-items:center;
    }
    .wrap{width:min(920px,92%); padding:28px}
    .card{
      background:var(--glass);
      border:1px solid var(--stroke);
      border-radius:18px;
      box-shadow:0 10px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
      backdrop-filter: blur(12px);
      padding:38px;
    }
    h1{font-size:clamp(28px,4.2vw,40px); margin:0 0 8px; line-height:1.1}
    .subtitle{color:var(--muted); margin:0 0 24px; font-size:clamp(14px,2.6vw,16px)}
    .badge{
      display:inline-flex; gap:10px; align-items:center;
      border:1px solid var(--stroke); color:var(--fg);
      padding:8px 12px; border-radius:999px; font-weight:600; font-size:14px;
      background:linear-gradient(90deg, rgba(125,211,252,.25), rgba(167,139,250,.25));
    }
    .grid{display:flex; flex-wrap:wrap; gap:12px; margin:24px 0 30px}
    .btn{
      display:inline-flex; align-items:center; gap:10px;
      padding:12px 16px; border-radius:12px; border:1px solid var(--stroke);
      color:var(--fg); text-decoration:none; font-weight:600;
      background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
      transition:transform .15s ease, background .2s ease, border-color .2s ease;
    }
    .btn:hover{transform:translateY(-1px); border-color:rgba(255,255,255,.22)}
    .btn.primary{
      border-color:transparent;
      background:linear-gradient(90deg, #38bdf8, #8b5cf6);
      color:#091427;
    }
    .muted{color:var(--muted); font-size:13px}
    .footer{margin-top:18px; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap}
    code{padding:4px 8px; background:rgba(255,255,255,.06); border:1px solid var(--stroke); border-radius:8px}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>🚀 AWS Free Tier Node.js App</h1>
      <p class="subtitle">Dockerized Express app deployed to <strong>EC2 (t2.micro)</strong> via <strong>GitHub Actions</strong>. Zero-downtime, automated pull & restart.</p>

      <div class="grid">
        <span class="badge">✅ Status: Healthy</span>
        <span class="badge">🐳 Container: <code>node-free-tier-app</code></span>
        <span class="badge">🖥️ Host: <code>${host}</code></span>
        <span class="badge">🌐 Port: <code>80 → 3000</code></span>
      </div>

      <div class="grid">
        <a class="btn primary" href="/health">Health JSON</a>
        <a class="btn" href="https://github.com/aashirziaai/aws-free-tier-node-app" target="_blank" rel="noopener">GitHub Repo</a>
        <a class="btn" href="https://hub.docker.com/r/aashirziaai/free-tier-node-app/tags" target="_blank" rel="noopener">Docker Hub</a>
      </div>

      <div class="footer">
        <span class="muted">Built on <code>Node 20 (Alpine)</code> • Hardened container flags</span>
        <span class="muted">© ${new Date().getFullYear()} Aashir Zia</span>
      </div>
    </div>
  </div>
</body>
</html>`);
});

app.listen(PORT, () =>
  console.log(`App listening on http://0.0.0.0:${PORT}`)
);
