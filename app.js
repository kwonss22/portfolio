// 페이지 렌더링 — body[data-page] 값(index · about · goop · cps · route)에 따라 그림
const page = document.body.dataset.page;
const pad = (n) => String(n).padStart(2, "0");
const varStyle = (v) => Object.entries(v).map(([k, c]) => `--${k}:${c}`).join(";");
const lines = (s) => s.replace(/\n/g, "<br>");
const arrow = `<span class="arr" aria-hidden="true">→</span>`;
const ext = (label, href) => `<a class="ulink" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;

// ---------- 공통 ----------
function nav() {
  const link = (href, label, cur, style = "") => `<a href="${href}"${cur ? ' aria-current="page"' : ""}${style}>${label}</a>`;
  return `<header class="nav"><div class="wrap">
    <a class="brand" href="index.html">권소영<span>.</span></a>
    <nav>
      ${link("about.html", "About", page === "about")}
      <a class="wk" href="index.html#work">Work</a>
      ${PROJECTS.map((p) => `<span class="pj">${link(`${p.id}.html`, p.name, page === p.id, ` style="${varStyle(p.vars)}"`)}</span>`).join("")}
      <a href="#contact">Contact</a>
    </nav>
  </div></header>`;
}

function footer() {
  return `<footer class="contact" id="contact"><div class="wrap">
    <p class="label">CONTACT</p>
    <h2>함께 일할 기회를<br>기다리고 있습니다</h2>
    <div class="clinks">
      <a class="cbtn" href="mailto:${PROFILE.email}"><span>Email</span>${PROFILE.email}${arrow}</a>
      <a class="cbtn" href="https://${PROFILE.blog}" target="_blank" rel="noopener"><span>Blog</span>${PROFILE.blog}${arrow}</a>
    </div>
    <p class="copy">© 2026 ${PROFILE.name}</p>
  </div></footer>
  <div class="toggle" role="group" aria-label="디자인 버전"><button data-set="mono">MONO</button><button data-set="color">COLOR</button></div>
  <div class="wipe" aria-hidden="true"></div>`;
}

// ---------- 다이어그램 / 사례 ----------
const node = ([t, d], hl) => `<div class="node${hl ? " hl" : ""}">${lines(t)}${d ? `<small>${d}</small>` : ""}</div>`;

function vis(b) {
  const label = b.label ? `<p class="dlabel">${b.label}</p>` : "";
  if (b.img) return `<figure class="vimg"><img src="${b.img}" alt="${b.cap}" loading="lazy"><figcaption class="cap">${b.cap}</figcaption></figure>`;
  if (b.note) return `<p class="vnote">${b.note}</p>`;
  if (b.flow) return `<div>${label}<div class="flow">${b.flow.map((n, i) => node(n, i === b.hl)).join("")}</div></div>`;
  if (b.chain) return `<div>${label}<div class="chain">${b.chain.map((t, i) => node([t], i === b.hl)).join("<i>→</i>")}</div></div>`;
  if (b.ba) return `<div class="ba"><span></span><p class="dlabel">BEFORE</p><p class="dlabel">AFTER</p>${b.ba.map(([k, x, y]) => `<span class="k">${k}</span>${node([x])}${node([y], true)}`).join("")}</div>`;
}

function pspr(c) {
  const q = Array.isArray(c.q) ? `<ul>${c.q.map((x) => `<li>${x}</li>`).join("")}</ul>` : `<p>${c.q}</p>`;
  const r = c.metric ? `<div class="metric"><b>${c.metric[0]}<small>${c.metric[1]}</small></b><p>${c.r}</p></div>` : `<p>${c.r}</p>`;
  return `<div><h5>문제상황</h5><p>${c.p}</p></div><div><h5>과정</h5>${q}</div><div class="res"><h5>결과</h5>${r}</div>`;
}

function caseHTML(p, c, i) {
  const head = `<div class="head"><span class="big">${pad(i + 1)}</span><div><p class="label">${p.name} 문제해결 ${pad(i + 1)}</p><h3>${c.t}</h3></div></div>`;
  const body = c.subs
    ? `<div class="subs">${c.subs.map((s, j) => `<div><h4><span>${pad(j + 1)}</span>${s.t}</h4><div class="pspr">${pspr(s)}</div></div>`).join("")}</div>`
    : `<div class="body"><div class="pspr">${pspr(c)}</div><div class="vis panel">${c.vis.map(vis).join("")}</div></div>`;
  return `<article class="case" id="case-${i + 1}"><div class="wrap">${head}${body}</div></article>`;
}

// ---------- 페이지 ----------
function indexPage() {
  return `
<section class="cover">
  <h1>안녕하세요,<br>풀스택 개발자를 찾으시나요?</h1>
  <a class="prompt" href="about.html">
    <span class="plus">+</span>
    <p>기획부터 백엔드·프론트엔드·배포·운영까지 가능한 풀스택 개발자 <b>‘권소영’</b>입니다</p>
    <span class="send">↑</span>
  </a>
  <div class="chips">${["기획·설계", "백엔드", "프론트엔드", "배포·운영"].map((c) => `<a href="about.html#skills">${c}</a>`).join("")}</div>
  <a class="scroll" href="#intro">scroll ↓</a>
</section>

<section class="intro" id="intro"><div class="wrap">
  <div class="intro-grid">
    <div><p class="label">ABOUT</p><p class="statement">${PROFILE.statement}</p></div>
    <div><p class="lead">${PROFILE.intro[0]}</p><a class="more" href="about.html">더 알아보기${arrow}</a></div>
  </div>
  <div class="stats">${PROFILE.stats.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
</div></section>

<section class="work" id="work"><div class="wrap">
  <p class="label">SELECTED WORK</p><h2 class="h2">현장의 불편을 시스템으로 바꿨습니다</h2>
  <div class="prows">${PROJECTS.map((p) => `<a class="prow" href="${p.id}.html" style="${varStyle(p.vars)}">
    <div class="pr-text">
      <span class="no">${p.no}</span>
      <h3>${p.name}</h3><p class="sub">${p.sub}</p>
      <div class="nums">${p.nums.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
      <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <span class="go">케이스 스터디 · 문제해결 ${p.cases.length}건${arrow}</span>
    </div>
    <div class="pr-thumb">${p.imgs.map((s) => `<img src="${s}" alt="" loading="lazy">`).join("")}</div>
  </a>`).join("")}</div>
</div></section>

${othersHTML()}`;
}

function othersHTML() {
  return `<section class="others-sec"><div class="wrap">
  <p class="label">OTHER PROJECTS</p><h2 class="h2">그 외 프로젝트</h2>
  <div class="others">
    <div class="oc feat"><div class="ocimg"><img src="${A}/safety/dashboard.jpg" alt="안전성평가시스템 대시보드" loading="lazy"></div>
      <h4>안전성평가시스템</h4><p>놀이기구별 안전성평가 작성·이력관리, 보고서 인쇄, 전자서명, 대시보드. 소셜 로그인 지원. 단독 개발</p>
      <em>Spring Boot 3.5 · JPA · QueryDSL · OAuth2 · React 18 (TS)</em></div>
    ${OTHERS.map(([t, d, m, href]) => href
      ? `<a class="oc" href="${href}" target="_blank" rel="noopener"><h4>${t}<span class="ext">↗</span></h4><p>${d}</p><em>${m}</em></a>`
      : `<div class="oc"><h4>${t}</h4><p>${d}</p><em>${m}</em></div>`).join("")}
  </div>
</div></section>`;
}

function aboutPage() {
  const P = PROFILE;
  return `
<section class="ahero"><div class="wrap">
  <p class="label">ABOUT</p>
  <h1 class="statement">${P.statement}</h1>
  <div class="ahero-grid">
    <div class="card-id">
      <p class="name">${P.name}.</p><p class="role">${P.role}</p>
      <p class="org">${P.org}</p>
      <p><a class="ulink" href="mailto:${P.email}">${P.email}</a><br>${ext(P.blog, "https://" + P.blog)}</p>
    </div>
    <div>${P.intro.map((t) => `<p class="lead">${t}</p>`).join("")}</div>
  </div>
  <div class="stats">${P.stats.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
</div></section>

<section class="how"><div class="wrap">
  <p class="label">HOW I WORK</p><h2 class="h2">일하는 방식</h2>
  <div class="pcs">${P.principles.map(([t, d], i) => `<div class="pc"><span class="no">${pad(i + 1)}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
</div></section>

<section class="skills" id="skills"><div class="wrap">
  <p class="label">SKILLS</p><h2 class="h2">기술 스택</h2>
  <div class="srows">${P.skills.map(([k, v]) => `<div class="srow"><h4>${k}</h4><div class="tags">${v.map((t) => `<span>${t}</span>`).join("")}</div></div>`).join("")}</div>
</div></section>

<section class="career"><div class="wrap">
  <p class="label">EXPERIENCE</p><h2 class="h2">경력</h2>
  ${P.career.map(([d, org, role, items]) => `<div class="job"><div><time>${d}</time><h3>${org}</h3><p class="role">${role}</p></div><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`).join("")}
  <div class="edu">${P.edu.map(([h, rows]) => `<div><h4>${h}</h4>${rows.map(([d, b, s]) => `<p><time>${d}</time><b>${b}</b>${s ? `<span>${s}</span>` : ""}</p>`).join("")}</div>`).join("")}</div>
</div></section>

<section class="tlsec"><div class="wrap">
  <p class="label">CAREER</p><h2 class="h2">Timeline</h2>
  <ul class="tl">${TIMELINE.map(([d, t, n, id]) => {
    const p = PROJECTS.find((x) => x.id === id);
    const inner = `<time>${d}</time><div><b>${t}</b>${n ? `<small>${n}</small>` : ""}</div>${p ? arrow : ""}`;
    return p ? `<li class="key"><a href="${p.id}.html" style="${varStyle(p.vars)}">${inner}</a></li>` : `<li>${inner}</li>`;
  }).join("")}</ul>
  <p class="tl-note">● 상세 사례 수록 프로젝트 — 누르면 해당 페이지로 이동합니다. 그 외 시스템은 운영 중 점검, 라이브러리 업데이트, 앱 스토어 정책 변경 대응 등 유지보수 병행</p>
</div></section>`;
}

function projectPage(p) {
  const idx = PROJECTS.indexOf(p);
  const ident = p.logo ? `<img class="logo" src="${p.logo}" alt="${p.name}">` : `<p class="word">${p.name}</p>`;
  const others = [PROJECTS[(idx + PROJECTS.length - 1) % PROJECTS.length], PROJECTS[(idx + 1) % PROJECTS.length]];
  return `
<section class="pdiv"><div class="wrap">
  <div>
    <p class="crumb"><a href="index.html#work">Work</a> / PROJECT ${p.no}</p>
    ${ident}<h1>${p.sub}</h1><p class="meta">${p.meta}</p>
    ${p.links.length ? `<p class="plinks">${p.links.map(([l, h]) => ext(l, h)).join("")}</p>` : ""}
  </div>
  <div><p class="label">문제해결</p><ol>${p.cases.map((c, i) => `<li><a href="#case-${i + 1}"><span>${pad(i + 1)}</span>${c.t}${arrow}</a></li>`).join("")}</ol></div>
</div></section>

<section class="ovsec"><div class="wrap ov">
  <div><p class="label">OVERVIEW</p><h2>${p.name}</h2><p class="sub">${p.sub}</p>
    <div class="chips">${p.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
    <dl>${p.rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl></div>
  <div class="panel zoom"><div class="imgs">${p.imgs.map((s) => `<img src="${s}" alt="${p.name} 화면" loading="lazy">`).join("")}</div>${p.cap ? `<p class="cap">${p.cap}</p>` : ""}</div>
</div></section>

<div class="cases">${p.cases.map((c, i) => caseHTML(p, c, i)).join("")}</div>

<section class="moresec"><div class="wrap">
  <p class="label">MORE</p><h2 class="h2">그 외 구현</h2>
  <ul class="more-list">${p.more.map((t, i) => `<li><span>${pad(i + 1)}</span>${t}</li>`).join("")}</ul>
</div></section>

<section class="nextsec"><div class="wrap">
  <p class="label">NEXT PROJECT</p>
  <div class="nexts">${others.map((o) => `<a class="next" href="${o.id}.html" style="${varStyle(o.vars)}">
    <span class="no">${o.no}</span><div><h3>${o.name}</h3><p>${o.sub}</p></div>${arrow}</a>`).join("")}</div>
</div></section>`;
}

// ---------- 그리기 ----------
const proj = PROJECTS.find((p) => p.id === page);
const main = page === "about" ? aboutPage() : proj ? projectPage(proj) : indexPage();
document.body.insertAdjacentHTML("afterbegin", `${nav()}<main class="${proj ? "proj" : ""}" ${proj ? `style="${varStyle(proj.vars)}"` : ""}>${main}</main>${footer()}`);

// ---------- 버전 토글 (#color / #mono 로 바로 열기 가능) ----------
function setV(v) {
  document.documentElement.dataset.v = v;
  document.querySelectorAll(".toggle button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.set === v));
  try { localStorage.setItem("pf-v", v); } catch {}
}
setV(location.hash === "#color" ? "color" : location.hash === "#mono" ? "mono" : document.documentElement.dataset.v || "mono");
document.querySelectorAll(".toggle button").forEach((b) => b.onclick = () => setV(b.dataset.set));

// ---------- 페이지 이동 와이프: 프로젝트 색 패널이 올라와 덮고, 다음 페이지에서 위로 빠짐 ----------
const wipe = document.querySelector(".wipe");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
let incoming = null;
try { incoming = sessionStorage.getItem("pf-wipe"); sessionStorage.removeItem("pf-wipe"); } catch {}
// instant: 트랜지션 없이 위치만 옮김 (아래 대기 ↔ 덮음)
function wipeTo(state, color) {
  if (color) wipe.style.background = color;
  wipe.className = "wipe instant " + (state === "cover" ? "" : "on");
  wipe.offsetHeight;
  wipe.className = "wipe " + (state === "cover" ? "on" : "on out");
}
if (incoming && !calm) wipeTo("reveal", incoming);
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || calm || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  const href = a.getAttribute("href");
  if (!/^[\w-]+\.html(#.*)?$/.test(href) || href.split("#")[0] === location.pathname.split("/").pop()) return;
  e.preventDefault();
  const color = getComputedStyle(a).getPropertyValue(document.documentElement.dataset.v === "color" ? "--cd" : "--div").trim() || "#222";
  try { sessionStorage.setItem("pf-wipe", color); } catch {}
  wipeTo("cover", color);
  setTimeout(() => (location.href = href), 520);
});
// 뒤로가기(bfcache)로 돌아오면 덮인 패널 치우기
addEventListener("pageshow", (e) => { if (e.persisted) wipe.className = "wipe instant"; });
