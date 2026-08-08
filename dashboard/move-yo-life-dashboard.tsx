import React, { useMemo, useState } from "react";

/* ---------- Data (from the Move Yo Life 2026 guide) ---------- */

const CHAKRAS = {
  root:    { name: "Root",         color: "#A8442E", soft: "#F4E2DA" },
  sacral:  { name: "Sacral",       color: "#C75B2E", soft: "#F7E4D6" },
  solar:   { name: "Solar Plexus", color: "#CE8F22", soft: "#F8ECD3" },
  heart:   { name: "Heart",        color: "#7E8F6E", soft: "#E9EDE2" },
  throat:  { name: "Throat",       color: "#54718E", soft: "#E1E8EF" },
  thirdEye:{ name: "Third Eye",    color: "#6E5494", soft: "#EAE3F1" },
  crown:   { name: "Crown",        color: "#A08BB8", soft: "#F0EAF5" },
};

const SEASONS = [
  { theme: "Foundation",    chakra: "root",     start: "2026-01-18",
    checkIn: { date: "2026-02-01", theme: "Confidence",    chakra: "solar" },
    lesson: "Trust life's bigger picture. Step into your power with faith and trust, knowing you are guided, supported, and exactly where you need to be." },
  { theme: "Purpose",       chakra: "crown",    start: "2026-02-17",
    checkIn: { date: "2026-03-03", theme: "Communication", chakra: "throat" },
    lesson: "Speak your truth with clarity. Express yourself honestly and kindly. Your voice matters, and when you communicate with integrity, you inspire trust and understanding." },
  { theme: "Intuition",     chakra: "thirdEye", start: "2026-03-18",
    checkIn: { date: "2026-04-01", theme: "Connection",    chakra: "heart" },
    lesson: "Open your heart and lead with love. Nurture compassion, deepen your relationships, and create space for love to flow." },
  { theme: "Confidence",    chakra: "solar",    start: "2026-04-17",
    checkIn: { date: "2026-05-01", theme: "Creativity",    chakra: "sacral" },
    lesson: "Create, explore, and enjoy the flow. Tap into your creativity and allow yourself to play, explore, and express. Embrace pleasure, joy, and the beauty of being fully present." },
  { theme: "Connection",    chakra: "heart",    start: "2026-05-16",
    checkIn: { date: "2026-05-31", theme: "Intuition",     chakra: "thirdEye" },
    lesson: "Listen within and trust your wisdom. Quiet the noise, connect to your inner knowing, and let your intuition guide your heart." },
  { theme: "Communication", chakra: "throat",   start: "2026-06-14",
    checkIn: { date: "2026-06-29", theme: "Foundation",    chakra: "root" },
    lesson: "Build your foundation with intention. Create stability by aligning your daily habits, environment, and mindset. Root into what truly matters so you can move forward with strength and clarity." },
  { theme: "Creativity",    chakra: "sacral",   start: "2026-07-14",
    checkIn: { date: "2026-07-29", theme: "Purpose",       chakra: "crown" },
    lesson: "Reconnect to your purpose. Reflect on what truly fulfills you. Realign with your values and the impact you're here to make." },
  { theme: "Confidence",    chakra: "solar",    start: "2026-08-12",
    checkIn: { date: "2026-08-27", theme: "Intuition",     chakra: "thirdEye" },
    lesson: "Strengthen your intuition. Go deeper within. Meditation, journaling, and quiet time help you receive the insights and answers already waiting for you." },
  { theme: "Communication", chakra: "throat",   start: "2026-09-10",
    checkIn: { date: "2026-09-26", theme: "Confidence",    chakra: "solar" },
    lesson: "Refine your confidence and stand in your truth. Reaffirm your self-worth and continue building your inner strength. Let your actions reflect your values and your belief in yourself." },
  { theme: "Connection",    chakra: "heart",    start: "2026-10-10",
    checkIn: { date: "2026-10-25", theme: "Connection",    chakra: "heart" },
    lesson: "Cultivate gratitude and meaningful relationships. Deepen your bonds, forgive where needed, and practice heart-centered living." },
  { theme: "Creativity",    chakra: "sacral",   start: "2026-11-08",
    checkIn: { date: "2026-11-24", theme: "Communication", chakra: "throat" },
    lesson: "Express your creativity and share your unique gifts. Let your ideas, art, and passions flow freely. When you share what you love, you inspire others and create positive change." },
  { theme: "Intuition",     chakra: "thirdEye", start: "2026-12-08",
    checkIn: { date: "2026-12-23", theme: "Creativity",    chakra: "sacral" },
    lesson: "Reflect, integrate, and prepare for what's next. Honor all you've learned this year. Release what no longer serves you, celebrate your growth, and set intentions for the beautiful new cycle ahead." },
];

const CYCLE_END = "2027-01-18";

/* ---------- Helpers ---------- */

const d = (s) => { const [y, m, day] = s.split("-").map(Number); return new Date(y, m - 1, day); };
const fmt = (s) => d(s).toLocaleDateString("en-US", { month: "long", day: "numeric" });
const fmtShort = (s) => d(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const dayDiff = (a, b) => Math.round((b - a) / 86400000);

function locateToday(today) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (t < d(SEASONS[0].start)) return { idx: 0, status: "before" };
  for (let i = 0; i < SEASONS.length; i++) {
    const end = i < SEASONS.length - 1 ? d(SEASONS[i + 1].start) : d(CYCLE_END);
    if (t >= d(SEASONS[i].start) && t < end) return { idx: i, status: "in", end };
  }
  return { idx: SEASONS.length - 1, status: "after", end: d(CYCLE_END) };
}

/* ---------- Small visual pieces ---------- */

const Orb = ({ chakra, size = 44, glow = false }) => {
  const c = CHAKRAS[chakra];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `radial-gradient(circle at 32% 28%, ${c.color}EE, ${c.color})`,
      boxShadow: glow ? `0 0 0 6px ${c.soft}, 0 0 24px ${c.color}55` : `0 0 0 4px ${c.soft}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: size * 0.42, height: size * 0.42, borderRadius: "50%",
        border: "1.5px solid rgba(255,253,248,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: size * 0.11, height: size * 0.11, borderRadius: "50%", background: "#FFFDF8" }} />
      </div>
    </div>
  );
};

const Moon = ({ phase = "full", size = 26, tint = "#C9A24B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {phase === "new" ? (
      <circle cx="12" cy="12" r="10" fill="none" stroke={tint} strokeWidth="1.4" strokeDasharray="2.5 3" />
    ) : (
      <>
        <circle cx="12" cy="12" r="10" fill={tint} opacity="0.92" />
        <circle cx="9" cy="9" r="1.4" fill="#FFFDF8" opacity="0.5" />
        <circle cx="14.5" cy="13.5" r="2" fill="#FFFDF8" opacity="0.35" />
        <circle cx="10" cy="15" r="1" fill="#FFFDF8" opacity="0.4" />
      </>
    )}
  </svg>
);

const Sun = ({ size = 24, tint = "#CE8F22" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="4.4" fill={tint} />
    {[...Array(8)].map((_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i}
        x1={12 + Math.cos(a) * 6.6} y1={12 + Math.sin(a) * 6.6}
        x2={12 + Math.cos(a) * 9.6} y2={12 + Math.sin(a) * 9.6}
        stroke={tint} strokeWidth="1.5" strokeLinecap="round" />;
    })}
  </svg>
);

/* Signature: the season arc — new moon → full moon → next new moon, with a marker for today */
const SeasonArc = ({ progress, checkProgress, chakra, checkChakra }) => {
  const W = 340, H = 130, cx = W / 2, rx = 140, ry = 96, cy = 118;
  const pt = (p) => {
    const th = Math.PI * (1 - p);
    return { x: cx + rx * Math.cos(th), y: cy - ry * Math.sin(th) };
  };
  const you = pt(Math.min(Math.max(progress, 0.02), 0.98));
  const chk = pt(checkProgress);
  const c = CHAKRAS[chakra];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }} aria-hidden="true">
      <path d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
        fill="none" stroke="#E4D9C6" strokeWidth="1.6" strokeDasharray="1 5" strokeLinecap="round" />
      {/* new moon start */}
      <circle cx={cx - rx} cy={cy} r="7" fill="none" stroke="#C9A24B" strokeWidth="1.4" strokeDasharray="2 2.5" />
      {/* full moon check-in */}
      <circle cx={chk.x} cy={chk.y} r="8" fill={CHAKRAS[checkChakra].color} opacity="0.9" />
      <circle cx={chk.x} cy={chk.y} r="12" fill="none" stroke={CHAKRAS[checkChakra].color} strokeWidth="1" opacity="0.35" />
      {/* next new moon */}
      <circle cx={cx + rx} cy={cy} r="7" fill="none" stroke="#C9A24B" strokeWidth="1.4" strokeDasharray="2 2.5" />
      {/* today marker */}
      <circle cx={you.x} cy={you.y} r="11" fill={c.color} opacity="0.16" />
      <circle cx={you.x} cy={you.y} r="5.5" fill={c.color} stroke="#FFFDF8" strokeWidth="2" />
      <text x={you.x} y={you.y - 18} textAnchor="middle" fontSize="9.5" fill="#8A7A64"
        style={{ letterSpacing: "0.18em", fontFamily: "inherit" }}>YOU ARE HERE</text>
      <text x={cx - rx} y={cy + 12} textAnchor="middle" fontSize="8.5" fill="#A6987F" style={{ letterSpacing: "0.1em" }}>NEW MOON</text>
      <text x={chk.x} y={chk.y - 18} textAnchor="middle" fontSize="8.5" fill={CHAKRAS[checkChakra].color} style={{ letterSpacing: "0.1em" }}>FULL MOON</text>
      <text x={cx + rx} y={cy + 12} textAnchor="middle" fontSize="8.5" fill="#A6987F" style={{ letterSpacing: "0.1em" }}>NEXT MOON</text>
    </svg>
  );
};

/* ---------- Main ---------- */

export default function MoveYoLife() {
  const today = new Date();
  const loc = useMemo(() => locateToday(today), []);
  const [openIdx, setOpenIdx] = useState(loc.idx);

  const season = SEASONS[loc.idx];
  const start = d(season.start);
  const end = loc.idx < SEASONS.length - 1 ? d(SEASONS[loc.idx + 1].start) : d(CYCLE_END);
  const check = d(season.checkIn.date);
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const total = dayDiff(start, end);
  const elapsed = Math.min(Math.max(dayDiff(start, t0), 0), total);
  const progress = elapsed / total;
  const checkProgress = dayDiff(start, check) / total;

  const daysToCheck = dayDiff(t0, check);
  const daysToNext = dayDiff(t0, end);
  const c = CHAKRAS[season.chakra];
  const cc = CHAKRAS[season.checkIn.chakra];

  let phaseLabel, phaseNote;
  if (loc.status === "before") {
    phaseLabel = "The cycle begins soon";
    phaseNote = `Foundation season opens ${fmt(SEASONS[0].start)}. Rest, reflect, and get ready to set your first intention.`;
  } else if (Math.abs(daysToCheck) <= 1) {
    phaseLabel = "Mid-season check-in window";
    phaseNote = "The full moon is here. Pause, take a breath, and realign with the season you're in.";
  } else if (daysToCheck > 1) {
    phaseLabel = "Season opening — set your intention";
    phaseNote = `${daysToCheck} days until your ${season.checkIn.theme} full-moon check-in on ${fmt(season.checkIn.date)}.`;
  } else {
    phaseLabel = "Integration — carry the lesson forward";
    phaseNote = `Your check-in has passed. ${daysToNext} day${daysToNext === 1 ? "" : "s"} until the next new season begins.`;
  }

  const S = styles;

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        .myl-row:hover { background: #FBF7EE; }
        .myl-row:focus-visible { outline: 2px solid #C9A24B; outline-offset: 2px; }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: "center", padding: "40px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Sun size={22} tint="#C9A24B" />
          <h1 style={S.title}>MOVE YO LIFE</h1>
          <Moon size={20} tint="#C9A24B" />
        </div>
        <div style={S.rule} />
        <p style={S.subtitle}>A GUIDE TO MOVING THROUGH LIFE'S SEASONS · 2026</p>
      </header>

      {/* Hero: where you are now */}
      <section style={{ ...S.card, borderTop: `3px solid ${c.color}` }}>
        <p style={S.eyebrow}>{today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "10px 0 4px", flexWrap: "wrap" }}>
          <Orb chakra={season.chakra} size={54} glow />
          <div style={{ textAlign: "left" }}>
            <h2 style={{ ...S.seasonName, color: c.color }}>{season.theme} Season</h2>
            <p style={S.chakraLine}>{c.name} Chakra · {fmtShort(season.start)} – {fmtShort(loc.idx < SEASONS.length - 1 ? SEASONS[loc.idx + 1].start : CYCLE_END)}</p>
          </div>
        </div>

        <SeasonArc progress={loc.status === "before" ? 0.02 : progress} checkProgress={checkProgress}
          chakra={season.chakra} checkChakra={season.checkIn.chakra} />

        <div style={{ ...S.phasePill, background: c.soft, color: "#4A3C30" }}>{phaseLabel}</div>
        <p style={S.phaseNote}>{phaseNote}</p>

        {/* Moon ↔ chakra connection */}
        <div style={S.connectBox}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <Moon phase="full" size={22} tint={cc.color} />
            <span style={S.connectTitle}>HOW THE MOON CONNECTS</span>
            <Orb chakra={season.checkIn.chakra} size={22} />
          </div>
          <p style={S.connectText}>
            While the {fmtShort(season.start)} new moon opened your <strong style={{ color: c.color }}>{c.name}</strong> chakra
            for {season.theme} season, the {fmtShort(season.checkIn.date)} full moon illuminates
            your <strong style={{ color: cc.color }}>{cc.name}</strong> chakra — a {season.checkIn.theme} check-in.
            The sun sets the season in motion; the moon invites you to pause, reflect, and realign.
          </p>
        </div>

        {/* Season lesson */}
        <div style={S.lessonBox}>
          <p style={S.lessonLabel}>🌿 SEASON LESSON — GO DEEPER, GROW DEEPER</p>
          <p style={S.lessonText}>{season.lesson}</p>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "8px 16px 48px" }}>
        <h3 style={S.timelineTitle}>The Full Cycle</h3>
        <p style={S.timelineSub}>Tap any season to see its new moon, mid-season check-in, and lesson.</p>

        <div style={{ position: "relative" }}>
          <div style={S.spine} />
          {SEASONS.map((s, i) => {
            const isNow = i === loc.idx && loc.status === "in";
            const past = d(s.start) < start || (loc.status === "in" && i < loc.idx);
            const open = openIdx === i;
            const col = CHAKRAS[s.chakra];
            const ccol = CHAKRAS[s.checkIn.chakra];
            return (
              <div key={i} style={{ position: "relative", paddingLeft: 58, marginBottom: 10 }}>
                <div style={{ position: "absolute", left: 12, top: 14 }}>
                  <Orb chakra={s.chakra} size={30} glow={isNow} />
                </div>
                <button className="myl-row" onClick={() => setOpenIdx(open ? -1 : i)}
                  aria-expanded={open}
                  style={{ ...S.rowBtn, borderColor: isNow ? col.color : "#EAE0CE", background: isNow ? "#FFFDF8" : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ ...S.rowTheme, color: col.color }}>{s.theme}</span>
                    <span style={S.rowChakra}>{col.name}</span>
                    <span style={S.rowDate}>☀ {fmtShort(s.start)}</span>
                    {isNow && <span style={{ ...S.nowTag, background: col.color }}>NOW</span>}
                    {past && !isNow && <span style={S.doneTag}>✓</span>}
                  </div>
                  <span style={{ ...S.chev, transform: open ? "rotate(90deg)" : "none" }}>›</span>
                </button>

                {open && (
                  <div style={S.detail}>
                    <div style={S.detailRow}>
                      <Sun size={18} tint={col.color} />
                      <div>
                        <p style={S.detailHead}>New Season · {fmt(s.start)}</p>
                        <p style={S.detailBody}>{s.theme} — {col.name} chakra. Set your intention, welcome the lesson, take the first step forward.</p>
                      </div>
                    </div>
                    <div style={S.detailRow}>
                      <Moon phase="full" size={18} tint={ccol.color} />
                      <div>
                        <p style={S.detailHead}>Mid-Season Check-In · {fmt(s.checkIn.date)}</p>
                        <p style={S.detailBody}>{s.checkIn.theme} full moon — {ccol.name} chakra. Pause · Reflect · Realign. Release what no longer serves you.</p>
                      </div>
                    </div>
                    <div style={{ ...S.detailLesson, borderLeft: `3px solid ${col.color}` }}>
                      <p style={{ ...S.detailHead, marginBottom: 4 }}>Season Lesson</p>
                      <p style={S.detailBody}>{s.lesson}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer style={S.footer}>
        <p style={{ margin: 0 }}>☀ EVERY SEASON BEGINS WITH INTENTION · ☾ EVERY CHECK-IN BRINGS AWARENESS · 🌿 EVERY LESSON INVITES TRANSFORMATION</p>
        <p style={{ margin: "10px 0 0", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>
          Life isn't meant to be rushed. Like nature, we grow through seasons.
        </p>
      </footer>
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  page: { minHeight: "100vh", background: "#F7F2E7", color: "#3A2E26", fontFamily: "'Jost', sans-serif" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "clamp(30px, 6vw, 44px)", letterSpacing: "0.14em", margin: 0, color: "#3A2E26" },
  rule: { width: 180, height: 1, background: "#C9A24B", margin: "10px auto 8px", opacity: 0.6 },
  subtitle: { fontSize: 11, letterSpacing: "0.28em", color: "#8A7A64", margin: 0 },
  card: { maxWidth: 720, margin: "24px auto", background: "#FFFDF8", borderRadius: 14, padding: "26px 22px 24px", boxShadow: "0 2px 18px rgba(90,70,40,0.08)", textAlign: "center", marginLeft: "auto", marginRight: "auto", width: "calc(100% - 32px)" },
  eyebrow: { fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A6987F", margin: 0 },
  seasonName: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 600, letterSpacing: "0.04em", margin: 0 },
  chakraLine: { fontSize: 13, color: "#8A7A64", margin: "2px 0 0", letterSpacing: "0.06em" },
  phasePill: { display: "inline-block", padding: "7px 18px", borderRadius: 999, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, marginTop: 6 },
  phaseNote: { fontSize: 14.5, color: "#5C4F41", maxWidth: 460, margin: "10px auto 0", lineHeight: 1.55 },
  connectBox: { background: "#F9F4E9", borderRadius: 10, padding: "16px 18px", margin: "20px auto 0", maxWidth: 560 },
  connectTitle: { fontSize: 11, letterSpacing: "0.22em", color: "#8A7A64" },
  connectText: { fontSize: 14, lineHeight: 1.65, color: "#4A3C30", margin: 0 },
  lessonBox: { marginTop: 16, padding: "16px 18px", borderTop: "1px solid #EAE0CE" },
  lessonLabel: { fontSize: 11, letterSpacing: "0.22em", color: "#7E8F6E", margin: "0 0 8px" },
  lessonText: { fontFamily: "'Cormorant Garamond', serif", fontSize: 19, lineHeight: 1.55, fontStyle: "italic", color: "#3A2E26", margin: 0, maxWidth: 540, marginLeft: "auto", marginRight: "auto" },
  timelineTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, textAlign: "center", margin: "26px 0 4px", letterSpacing: "0.06em" },
  timelineSub: { textAlign: "center", fontSize: 13, color: "#8A7A64", margin: "0 0 22px" },
  spine: { position: "absolute", left: 26, top: 10, bottom: 10, width: 1, background: "repeating-linear-gradient(#D8CBB2 0 3px, transparent 3px 8px)" },
  rowBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, textAlign: "left", padding: "13px 14px", borderRadius: 10, border: "1px solid", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", color: "inherit", transition: "background 0.15s" },
  rowTheme: { fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 14 },
  rowChakra: { fontSize: 12.5, color: "#8A7A64" },
  rowDate: { fontSize: 12.5, color: "#A6987F", letterSpacing: "0.04em" },
  nowTag: { color: "#FFFDF8", fontSize: 10, letterSpacing: "0.16em", padding: "3px 9px", borderRadius: 999 },
  doneTag: { color: "#A6987F", fontSize: 12 },
  chev: { color: "#B7A88E", fontSize: 20, lineHeight: 1, transition: "transform 0.15s", flexShrink: 0 },
  detail: { background: "#FFFDF8", border: "1px solid #EAE0CE", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 16px 14px", margin: "-6px 0 0", display: "grid", gap: 12 },
  detailRow: { display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left" },
  detailHead: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B5B49", margin: "0 0 3px", fontWeight: 500 },
  detailBody: { fontSize: 13.5, lineHeight: 1.6, color: "#4A3C30", margin: 0 },
  detailLesson: { textAlign: "left", paddingLeft: 12 },
  footer: { textAlign: "center", padding: "10px 20px 46px", fontSize: 10.5, letterSpacing: "0.14em", color: "#8A7A64" },
};
