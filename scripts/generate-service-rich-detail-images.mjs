import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outDir = path.join(root, "public", "images", "service-rich-details");
const tmpDir = path.join(root, ".tmp", "service-rich-details");

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

const services = [
  {
    slug: "natural-eye-design",
    category: "EYE DESIGN",
    title: "자연유착 눈매 디자인",
    subtitle: "라인보다 먼저 눈의 힘과 비율을 봅니다",
    image: "/images/service-eye-design.jpg",
    palette: ["#1f1715", "#dec47b", "#f7efe9"],
    panels: [
      {
        number: "01",
        hook: "또렷함은 더하고 과한 인상 변화는 줄이는 설계",
        body: "눈뜨는 힘, 피부 두께, 좌우 비대칭을 함께 확인해 오래 봐도 자연스러운 눈매 라인을 계획합니다.",
        points: ["눈뜨는 힘 진단", "자연스러운 라인", "좌우 균형 점검"],
      },
      {
        number: "02",
        hook: "정면과 측면에서 모두 어색하지 않은 눈매",
        body: "쌍꺼풀 라인 하나보다 눈썹, 눈동자 노출, 얼굴 전체 인상 흐름을 기준으로 디자인합니다.",
        points: ["라인 시뮬레이션", "과교정 방지", "회복 리듬 안내"],
      },
      {
        number: "03",
        hook: "상담부터 회복까지 차분하게 예측 가능한 플랜",
        body: "붓기와 멍의 개인차를 고려해 내원 일정과 애프터케어 시점을 미리 안내합니다.",
        points: ["개인별 계획", "사후관리", "자연스러운 변화"],
      },
    ],
  },
  {
    slug: "balanced-rhinoplasty",
    category: "NOSE BALANCE",
    title: "밸런스 코성형",
    subtitle: "높이보다 얼굴 전체의 흐름을 우선합니다",
    image: "/images/treatment-rhinoplasty.jpg",
    palette: ["#120d0e", "#d9c1ad", "#fff8ef"],
    panels: [
      {
        number: "01",
        hook: "콧대와 코끝만이 아니라 이마, 입술, 턱선까지",
        body: "정면과 측면 비율을 함께 분석해 얼굴 안에서 자연스럽게 이어지는 코 라인을 계획합니다.",
        points: ["정면 균형", "측면 라인", "코끝 지지"],
      },
      {
        number: "02",
        hook: "재수술 가능성까지 고려하는 보수적 설계",
        body: "피부 두께, 기존 보형물, 연골 지지 구조를 확인해 무리한 높이보다 안정적인 비율을 우선합니다.",
        points: ["재료 상담", "구조 확인", "회복 계획"],
      },
      {
        number: "03",
        hook: "어느 각도에서도 세련된 인상을 목표로",
        body: "코 라인은 단독으로 존재하지 않습니다. 광대, 입술, 턱으로 이어지는 전체 비율을 계산합니다.",
        points: ["얼굴형 분석", "자연스러운 입체감", "장기 밸런스"],
      },
    ],
  },
  {
    slug: "deep-structure-lifting",
    category: "LIFTING",
    title: "딥 구조 리프팅",
    subtitle: "피부만 당기지 않고 처짐의 방향을 봅니다",
    image: "/images/service-lifting.jpg",
    palette: ["#241b18", "#e38aa0", "#fff8ef"],
    panels: [
      {
        number: "01",
        hook: "얼굴선이 무너져 보이는 원인을 먼저 확인",
        body: "피부 탄력, 지방 위치, 근막 지지력을 함께 보며 수술과 비수술 선택지를 구분합니다.",
        points: ["처짐 방향", "피부 탄력", "근막 지지"],
      },
      {
        number: "02",
        hook: "당김보다 자연스러운 복귀가 중요합니다",
        body: "일상 일정과 회복 가능 기간을 기준으로 무리하지 않는 리프팅 방법을 안내합니다.",
        points: ["회복 일정", "비수술 옵션", "사후관리"],
      },
      {
        number: "03",
        hook: "팔자와 턱선까지 이어지는 구조적 개선",
        body: "한 지점만 올리는 방식이 아니라 얼굴 전체의 처짐 벡터를 기준으로 계획합니다.",
        points: ["팔자 라인", "턱선 정리", "자연스러운 윤곽"],
      },
    ],
  },
  {
    slug: "petit-facial-balancing",
    category: "PETIT BALANCE",
    title: "쁘띠 페이스 밸런싱",
    subtitle: "작은 용량으로 얼굴의 흐름을 정리합니다",
    image: "/images/service-petit.jpg",
    palette: ["#1f1715", "#dec47b", "#f7efe9"],
    panels: [
      {
        number: "01",
        hook: "수술보다 가벼운 변화가 필요한 순간",
        body: "필러, 보톡스, 스킨부스터를 얼굴 전체 균형 안에서 보수적으로 계획합니다.",
        points: ["표정 확인", "볼륨 연결", "피부결 체크"],
      },
      {
        number: "02",
        hook: "한 부위가 아니라 인상 전체를 부드럽게",
        body: "과한 볼륨보다 표정과 피부결에 어울리는 작은 변화를 목표로 합니다.",
        points: ["보수적 용량", "자연스러운 인상", "정기 관리"],
      },
      {
        number: "03",
        hook: "짧은 시술, 섬세한 상담, 빠른 일상 복귀",
        body: "시술 종류에 따라 회복 시점이 달라지므로 상담에서 일정과 주의사항을 함께 안내합니다.",
        points: ["당일 안내", "빠른 복귀", "주의사항"],
      },
    ],
  },
];

await mkdir(outDir, { recursive: true });
await mkdir(tmpDir, { recursive: true });

const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));
if (!chromePath) {
  throw new Error("Chrome was not found. Install Chrome or update chromeCandidates in this script.");
}

for (const service of services) {
  for (const panel of service.panels) {
    const fileName = `${service.slug}-${panel.number}.png`;
    const htmlPath = path.join(tmpDir, `${service.slug}-${panel.number}.html`);
    const outputPath = path.join(outDir, fileName);

    await writeFile(htmlPath, renderHtml(service, panel), "utf8");
    await execFileAsync(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1080,1640",
      `--screenshot=${outputPath}`,
      pathToFileURL(htmlPath).href,
    ]);
    console.log(`generated ${fileName}`);
  }
}

await rm(tmpDir, { recursive: true, force: true });

function renderHtml(service, panel) {
  const imageUrl = pathToFileURL(path.join(root, "public", service.image)).href;
  const [background, accent, paper] = service.palette;

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 1080px;
      height: 1640px;
      overflow: hidden;
      background: ${paper};
      color: #111;
      font-family: "Noto Sans KR", "Malgun Gothic", Arial, sans-serif;
    }
    .page {
      position: relative;
      width: 1080px;
      height: 1640px;
      overflow: hidden;
      background:
        radial-gradient(circle at 18% 12%, rgba(255,255,255,.9), transparent 27%),
        linear-gradient(180deg, ${paper} 0%, #ffffff 40%, ${paper} 100%);
    }
    .kicker {
      position: absolute;
      top: 54px;
      left: 64px;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: .14em;
      color: ${background};
    }
    .number {
      position: absolute;
      top: 88px;
      left: 64px;
      color: ${accent};
      font-size: 116px;
      font-weight: 900;
      line-height: 1;
    }
    .title {
      position: absolute;
      top: 218px;
      left: 64px;
      right: 64px;
      font-size: 66px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }
    .highlight {
      display: inline;
      box-shadow: inset 0 -24px 0 rgba(222, 196, 123, .42);
    }
    .subtitle {
      position: absolute;
      top: 424px;
      left: 64px;
      right: 64px;
      color: #4b4240;
      font-size: 34px;
      font-weight: 700;
      line-height: 1.55;
    }
    .photo {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 910px;
      background-image:
        linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.35)),
        url("${imageUrl}");
      background-size: cover;
      background-position: center;
    }
    .photo::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, transparent 36%, rgba(0,0,0,.78) 100%),
        radial-gradient(circle at 80% 36%, rgba(222,196,123,.2), transparent 26%);
    }
    .stamp {
      position: absolute;
      top: 646px;
      left: 64px;
      transform: rotate(-2deg);
      background: ${accent};
      color: ${background};
      padding: 16px 30px;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: .02em;
      z-index: 2;
    }
    .points {
      position: absolute;
      left: 54px;
      right: 54px;
      bottom: 54px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      border: 6px solid ${accent};
      z-index: 3;
    }
    .point {
      min-height: 204px;
      padding: 28px 24px;
      background: rgba(9, 7, 7, .82);
      color: white;
      border-right: 1px solid rgba(255,255,255,.25);
    }
    .point:last-child { border-right: 0; }
    .point strong {
      display: block;
      margin-bottom: 16px;
      color: ${accent};
      font-size: 44px;
      line-height: 1;
    }
    .point span {
      display: block;
      font-size: 25px;
      font-weight: 800;
      line-height: 1.46;
      word-break: keep-all;
    }
    .brand {
      position: absolute;
      right: 64px;
      top: 70px;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: .22em;
      color: rgba(20, 16, 16, .5);
    }
    .line {
      position: absolute;
      left: 64px;
      top: 610px;
      width: 420px;
      height: 2px;
      background: ${background};
      opacity: .45;
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="brand">BAKSAL BEAUTY</div>
    <div class="kicker">${escapeHtml(service.category)}</div>
    <div class="number">${escapeHtml(panel.number)}</div>
    <h1 class="title"><span class="highlight">${escapeHtml(panel.hook)}</span></h1>
    <p class="subtitle">${escapeHtml(panel.body)}</p>
    <div class="line"></div>
    <div class="stamp">${escapeHtml(service.subtitle)}</div>
    <div class="photo"></div>
    <div class="points">
      ${panel.points
        .map(
          (point, index) => `<div class="point"><strong>${String(index + 1).padStart(2, "0")}</strong><span>${escapeHtml(point)}</span></div>`,
        )
        .join("")}
    </div>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
