javascript
const fs = require("fs");
(async () => {
  const d = new Date().toISOString().split("T")[0], dc = d.replace(/-/g, "");
  const urls = ["soccer/all", "basketball/nba", "football/nfl"];
  const matches = [];
  for (const u of urls) {
    try {
      const r = await (await fetch(`https://espn.com{u}/scoreboard?dates=${dc}`)).json();
      (r.events || []).forEach(e => {
        const c = e.competitions?.[0]; if (!c || c.competitors.length < 2) return;
        const a = c.competitors[0].team, b = c.competitors[1].team;
        matches.push({ id: e.id, date: d, time: new Date(e.date).toTimeString().slice(0, 5), name: `${a.displayName} vs ${b.displayName}`, ok: true });
      });
    } catch (_) {}
  }
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/paired-matches.json", JSON.stringify({ date: d, updatedAt: new Date().toUTCString(), matches }, null, 2));
})();
