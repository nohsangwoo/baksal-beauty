import type {
  ServiceBeforeAfter,
  ServiceContentCategory,
  ServiceDetailCta,
  ServiceDetailPanel,
  ServiceItem,
  ServiceRichDetailImage,
  ServiceSurgeryInfo,
  ServiceVideoPreview,
} from "@/data/service-content";
import type { Locale } from "@/i18n/config";

export type ServiceDetailLabels = {
  back: string;
  surgeryInfo: string;
  surgeryInfoBody: string;
  surgeryTime: string;
  anesthesia: string;
  visits: string;
  aftercareStart: string;
  recoveryPeriod: string;
  recommended: string;
  recommendedBody: string;
  detailPanels: string;
  detailPanelsBody: string;
  beforeAfter: string;
  before: string;
  after: string;
  richImages: string;
  richImagesTitle: (serviceTitle: string) => string;
  richImagesBody: string;
  videos: string;
  videosBody: string;
  related: string;
  relatedBody: string;
  detailCta: string;
  inquire: string;
  catalog: string;
};

export type NormalizedServiceDetail = {
  surgeryInfo: ServiceSurgeryInfo;
  detailPanels: ServiceDetailPanel[];
  beforeAfter: ServiceBeforeAfter;
  richDetailImages: ServiceRichDetailImage[];
  youtubeVideos: ServiceVideoPreview[];
  detailCta: ServiceDetailCta;
};

export const serviceDetailLabels: Record<Locale, ServiceDetailLabels> = {
  ko: {
    back: "시술 목록",
    surgeryInfo: "수술 정보 요약",
    surgeryInfoBody: "상담 전 빠르게 확인할 수 있는 기본 기준입니다. 실제 계획은 진단 후 개인별로 조정됩니다.",
    surgeryTime: "수술시간",
    anesthesia: "마취방법",
    visits: "내원",
    aftercareStart: "애프터케어",
    recoveryPeriod: "회복기간",
    recommended: "이 시술이 어울리는 분",
    recommendedBody: "단순히 유행하는 라인을 따라가기보다 현재 얼굴 구조와 회복 리듬에 맞는지를 먼저 봅니다.",
    detailPanels: "디테일 디자인 노트",
    detailPanelsBody: "긴 상세페이지처럼 핵심 판단 기준을 순서대로 확인할 수 있도록 구성했습니다.",
    beforeAfter: "Before & After Reference",
    before: "Before",
    after: "After",
    richImages: "상세 이미지",
    richImagesTitle: (serviceTitle) => `${serviceTitle} 상세 이미지 가이드`,
    richImagesBody: "구매 상세페이지처럼 한 줄 전체를 사용하는 긴 이미지입니다. 핵심 후킹, 진단 기준, 관리 포인트를 이미지 한 장씩 순서대로 보여줍니다.",
    videos: "YouTube Preview",
    videosBody: "관리자에서 등록한 영상 수만큼 노출됩니다. 아직 영상이 없으면 이미지 프리뷰로 대체됩니다.",
    related: "함께 보면 좋은 추천 시술",
    relatedBody: "카테고리, 태그, 임베딩 벡터 유사도를 기준으로 최대 2개만 추천합니다.",
    detailCta: "상담 전 체크포인트",
    inquire: "상담 문의",
    catalog: "전체 시술 보기",
  },
  en: {
    back: "Treatment Catalog",
    surgeryInfo: "Treatment Summary",
    surgeryInfoBody: "A quick reference before consultation. The final plan is adjusted after diagnosis.",
    surgeryTime: "Time",
    anesthesia: "Anesthesia",
    visits: "Visits",
    aftercareStart: "Aftercare",
    recoveryPeriod: "Recovery",
    recommended: "Who this suits",
    recommendedBody: "We review whether the plan fits your structure and recovery rhythm before following trends.",
    detailPanels: "Design Notes",
    detailPanelsBody: "A vertical detail-page style flow showing the key decision points in order.",
    beforeAfter: "Before & After Reference",
    before: "Before",
    after: "After",
    richImages: "Detail Images",
    richImagesTitle: (serviceTitle) => `${serviceTitle} Detail Guide`,
    richImagesBody: "Full-width vertical images designed like commerce detail pages, showing hooks, diagnosis criteria, and care points in sequence.",
    videos: "YouTube Preview",
    videosBody: "The admin controls how many videos appear. Image previews are used when no video is attached.",
    related: "Recommended Services",
    relatedBody: "Up to two services are suggested by category, tags, and vector similarity.",
    detailCta: "Before consultation",
    inquire: "Inquire",
    catalog: "View all services",
  },
  zh: {
    back: "项目列表",
    surgeryInfo: "项目信息摘要",
    surgeryInfoBody: "咨询前可快速确认的基础信息。实际计划会在诊断后按个人情况调整。",
    surgeryTime: "时间",
    anesthesia: "麻醉",
    visits: "来院",
    aftercareStart: "护理",
    recoveryPeriod: "恢复",
    recommended: "适合人群",
    recommendedBody: "我们先确认方案是否适合面部结构与恢复节奏，而不是只追随流行。",
    detailPanels: "设计细节说明",
    detailPanelsBody: "以长详情页的方式，按顺序展示核心判断标准。",
    beforeAfter: "Before & After Reference",
    before: "Before",
    after: "After",
    richImages: "详情图片",
    richImagesTitle: (serviceTitle) => `${serviceTitle} 详情图片指南`,
    richImagesBody: "像商品详情页一样占据整行的长图，按顺序展示核心卖点、诊断标准与护理重点。",
    videos: "YouTube Preview",
    videosBody: "后台可控制显示视频数量。没有视频时会显示图片预览。",
    related: "推荐相关项目",
    relatedBody: "根据分类、标签和向量相似度最多推荐两个项目。",
    detailCta: "咨询前确认",
    inquire: "咨询",
    catalog: "查看全部项目",
  },
  ja: {
    back: "施術一覧",
    surgeryInfo: "施術情報まとめ",
    surgeryInfoBody: "相談前に確認できる基本情報です。実際の計画は診断後に個別調整します。",
    surgeryTime: "時間",
    anesthesia: "麻酔",
    visits: "通院",
    aftercareStart: "アフターケア",
    recoveryPeriod: "回復期間",
    recommended: "おすすめ対象",
    recommendedBody: "流行だけでなく、構造と回復リズムに合うかを先に確認します。",
    detailPanels: "デザインノート",
    detailPanelsBody: "縦長の詳細ページのように、重要な判断基準を順番に見せます。",
    beforeAfter: "Before & After Reference",
    before: "Before",
    after: "After",
    richImages: "詳細画像",
    richImagesTitle: (serviceTitle) => `${serviceTitle} 詳細画像ガイド`,
    richImagesBody: "商品詳細ページのように横幅いっぱいで表示する縦長画像です。訴求、診断基準、ケアポイントを順番に見せます。",
    videos: "YouTube Preview",
    videosBody: "管理画面で表示する動画数を調整できます。動画がない場合は画像プレビューを表示します。",
    related: "関連おすすめ施術",
    relatedBody: "カテゴリ、タグ、ベクトル類似度をもとに最大2件だけ表示します。",
    detailCta: "相談前チェック",
    inquire: "相談する",
    catalog: "すべての施術",
  },
};

const surgeryInfoByCategory: Record<ServiceContentCategory, Record<Locale, ServiceSurgeryInfo>> = {
  eye: {
    ko: { surgeryTime: "30-60분", anesthesia: "국소 또는 수면마취", visits: "2-3회", aftercareStart: "다음 날부터", recoveryPeriod: "1-2주" },
    en: { surgeryTime: "30-60 min", anesthesia: "Local or sedation", visits: "2-3 visits", aftercareStart: "From next day", recoveryPeriod: "1-2 weeks" },
    zh: { surgeryTime: "30-60分钟", anesthesia: "局部或睡眠麻醉", visits: "2-3次", aftercareStart: "次日起", recoveryPeriod: "1-2周" },
    ja: { surgeryTime: "30-60分", anesthesia: "局所または睡眠麻酔", visits: "2-3回", aftercareStart: "翌日から", recoveryPeriod: "1-2週間" },
  },
  nose: {
    ko: { surgeryTime: "90-180분", anesthesia: "수면 또는 전신마취", visits: "3-5회", aftercareStart: "3-5일 후", recoveryPeriod: "2-4주" },
    en: { surgeryTime: "90-180 min", anesthesia: "Sedation or general", visits: "3-5 visits", aftercareStart: "After 3-5 days", recoveryPeriod: "2-4 weeks" },
    zh: { surgeryTime: "90-180分钟", anesthesia: "睡眠或全身麻醉", visits: "3-5次", aftercareStart: "3-5天后", recoveryPeriod: "2-4周" },
    ja: { surgeryTime: "90-180分", anesthesia: "睡眠または全身麻酔", visits: "3-5回", aftercareStart: "3-5日後", recoveryPeriod: "2-4週間" },
  },
  lifting: {
    ko: { surgeryTime: "30-120분", anesthesia: "부위별 국소/수면마취", visits: "2-4회", aftercareStart: "1주 이내", recoveryPeriod: "1-4주" },
    en: { surgeryTime: "30-120 min", anesthesia: "Local or sedation", visits: "2-4 visits", aftercareStart: "Within 1 week", recoveryPeriod: "1-4 weeks" },
    zh: { surgeryTime: "30-120分钟", anesthesia: "局部或睡眠麻醉", visits: "2-4次", aftercareStart: "1周内", recoveryPeriod: "1-4周" },
    ja: { surgeryTime: "30-120分", anesthesia: "局所または睡眠麻酔", visits: "2-4回", aftercareStart: "1週間以内", recoveryPeriod: "1-4週間" },
  },
  petit: {
    ko: { surgeryTime: "10-30분", anesthesia: "연고 또는 국소마취", visits: "1-2회", aftercareStart: "당일 안내", recoveryPeriod: "당일-1주" },
    en: { surgeryTime: "10-30 min", anesthesia: "Topical or local", visits: "1-2 visits", aftercareStart: "Same-day guide", recoveryPeriod: "Same day-1 week" },
    zh: { surgeryTime: "10-30分钟", anesthesia: "表面或局部麻醉", visits: "1-2次", aftercareStart: "当天指导", recoveryPeriod: "当天-1周" },
    ja: { surgeryTime: "10-30分", anesthesia: "表面または局所麻酔", visits: "1-2回", aftercareStart: "当日案内", recoveryPeriod: "当日-1週間" },
  },
};

const categoryImages: Record<ServiceContentCategory, string[]> = {
  eye: ["/images/service-eye-design.jpg", "/images/before-face.jpg", "/images/clinic-interior.jpg"],
  nose: ["/images/treatment-rhinoplasty.jpg", "/images/after-face.jpg", "/images/clinic-interior.jpg"],
  lifting: ["/images/service-lifting.jpg", "/images/philosophy-portrait.jpg", "/images/clinic-interior.jpg"],
  petit: ["/images/service-petit.jpg", "/images/treatment-facial-balancing.jpg", "/images/clinic-interior.jpg"],
};

const categoryVectors: Record<ServiceContentCategory, number[]> = {
  eye: [0.94, 0.18, 0.08, 0.13, 0.2],
  nose: [0.22, 0.95, 0.12, 0.2, 0.18],
  lifting: [0.18, 0.18, 0.94, 0.38, 0.3],
  petit: [0.26, 0.22, 0.42, 0.92, 0.36],
};

export function getServiceDetailContent(service: ServiceItem, locale: Locale): NormalizedServiceDetail {
  return {
    surgeryInfo: isSurgeryInfoComplete(service.surgeryInfo)
      ? service.surgeryInfo
      : surgeryInfoByCategory[service.category][locale],
    detailPanels: service.detailPanels?.length ? service.detailPanels : createDetailPanels(service, locale),
    beforeAfter: isBeforeAfterComplete(service.beforeAfter)
      ? service.beforeAfter
      : createBeforeAfter(service, locale),
    richDetailImages: service.richDetailImages?.length
      ? service.richDetailImages
      : createRichDetailImages(service, locale),
    youtubeVideos: service.youtubeVideos?.length ? service.youtubeVideos : createVideoPreviews(service, locale),
    detailCta: service.detailCta?.title ? service.detailCta : createDetailCta(service, locale),
  };
}

export function createRichDetailImages(service: ServiceItem, locale: Locale): ServiceRichDetailImage[] {
  const copy = richImageCopy[locale];

  return [1, 2, 3].map((number) => ({
    title: copy.title(service.title, number),
    imageUrl: `/images/service-rich-details/${service.slug}-${String(number).padStart(2, "0")}.png`,
    imageAlt: copy.alt(service.title, number),
  }));
}

export function createServiceEmbedding(
  category: ServiceContentCategory,
  tags: ServiceContentCategory[] = [],
  text = "",
) {
  const vector = [...categoryVectors[category]];

  for (const tag of tags) {
    const tagVector = categoryVectors[tag];
    tagVector.forEach((value, index) => {
      vector[index] += value * 0.26;
    });
  }

  const textSeed = Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  vector[4] += (textSeed % 97) / 240;

  return normalizeVector(vector);
}

function createDetailPanels(service: ServiceItem, locale: Locale): ServiceDetailPanel[] {
  const images = categoryImages[service.category];
  const copy = panelCopy[locale];

  return [
    {
      eyebrow: "01",
      title: copy.analysisTitle,
      body: copy.analysisBody(service.title),
      imageUrl: service.imageUrl || images[0],
      imageAlt: service.imageAlt || service.title,
      points: service.highlights.slice(0, 3),
    },
    {
      eyebrow: "02",
      title: copy.designTitle,
      body: copy.designBody,
      imageUrl: images[1],
      imageAlt: service.title,
      points: service.recommendedFor.slice(0, 3),
    },
    {
      eyebrow: "03",
      title: copy.careTitle,
      body: copy.careBody,
      imageUrl: images[2],
      imageAlt: service.title,
      points: service.process.slice(0, 3),
    },
  ];
}

function createBeforeAfter(service: ServiceItem, locale: Locale): ServiceBeforeAfter {
  const copy = beforeAfterCopy[locale];

  return {
    title: copy.title(service.title),
    body: copy.body,
    beforeImageUrl: "/images/before-face.jpg",
    beforeAlt: copy.beforeAlt,
    afterImageUrl: "/images/after-face.jpg",
    afterAlt: copy.afterAlt,
  };
}

function createVideoPreviews(service: ServiceItem, locale: Locale): ServiceVideoPreview[] {
  const copy = videoCopy[locale];

  return [
    {
      title: copy.plan(service.title),
      description: copy.planBody,
      videoId: "",
      thumbnailUrl: service.imageUrl || categoryImages[service.category][0],
    },
    {
      title: copy.care(service.title),
      description: copy.careBody,
      videoId: "",
      thumbnailUrl: "/images/clinic-interior.jpg",
    },
  ];
}

function createDetailCta(service: ServiceItem, locale: Locale): ServiceDetailCta {
  const copy = ctaCopy[locale];

  return {
    title: copy.title(service.title),
    body: copy.body,
  };
}

function isSurgeryInfoComplete(value?: ServiceSurgeryInfo): value is ServiceSurgeryInfo {
  return Boolean(
    value?.surgeryTime &&
      value.anesthesia &&
      value.visits &&
      value.aftercareStart &&
      value.recoveryPeriod,
  );
}

function isBeforeAfterComplete(value?: ServiceBeforeAfter): value is ServiceBeforeAfter {
  return Boolean(value?.title && value.beforeImageUrl && value.afterImageUrl);
}

function normalizeVector(vector: number[]) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;

  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

const panelCopy = {
  ko: {
    analysisTitle: "비율을 먼저 읽는 진단",
    analysisBody: (title: string) => `${title}은 한 부위만 보지 않고 시선이 모이는 방향과 전체 균형을 함께 확인합니다.`,
    designTitle: "과하지 않은 라인 설계",
    designBody: "정면, 측면, 표정 변화까지 고려해 오래 봐도 자연스러운 변화를 목표로 합니다.",
    careTitle: "회복까지 포함한 계획",
    careBody: "시술 후 붓기, 멍, 내원 리듬을 미리 안내해 일상 복귀까지 예측 가능하게 만듭니다.",
  },
  en: {
    analysisTitle: "Diagnosis before design",
    analysisBody: (title: string) => `${title} begins with visual flow and whole-face balance, not a single point.`,
    designTitle: "Restrained line planning",
    designBody: "Front, side, and expression changes are reviewed for a result that stays natural over time.",
    careTitle: "Recovery-aware planning",
    careBody: "Swelling, bruising, visits, and aftercare rhythm are planned before treatment begins.",
  },
  zh: {
    analysisTitle: "先判断比例",
    analysisBody: (title: string) => `${title}会先确认视线方向与整体平衡，而不是只看单一部位。`,
    designTitle: "不过度的线条设计",
    designBody: "结合正面、侧面与表情变化，追求长期自然的变化。",
    careTitle: "包含恢复的计划",
    careBody: "提前说明肿胀、淤青、来院节奏与护理方式，帮助安排日常恢复。",
  },
  ja: {
    analysisTitle: "比率を先に読む診断",
    analysisBody: (title: string) => `${title}は一部位だけでなく、視線の流れと全体バランスから確認します。`,
    designTitle: "やり過ぎないライン設計",
    designBody: "正面、側面、表情変化まで見ながら、長く自然に見える変化を目指します。",
    careTitle: "回復まで含めた計画",
    careBody: "腫れ、内出血、通院、アフターケアの流れを事前に案内します。",
  },
} satisfies Record<Locale, {
  analysisTitle: string;
  analysisBody: (title: string) => string;
  designTitle: string;
  designBody: string;
  careTitle: string;
  careBody: string;
}>;

const beforeAfterCopy = {
  ko: {
    title: (title: string) => `${title} 변화 참고`,
    body: "아래 이미지는 상담 이해를 돕기 위한 예시입니다. 결과를 보장하는 자료가 아니며 개인 상태에 따라 계획과 회복은 달라집니다.",
    beforeAlt: "시술 전 상담 참고 이미지",
    afterAlt: "시술 후 자연스러운 변화 참고 이미지",
  },
  en: {
    title: (title: string) => `${title} change reference`,
    body: "Images are consultation references only. Results are not guaranteed and vary by individual condition.",
    beforeAlt: "Before consultation reference",
    afterAlt: "After natural change reference",
  },
  zh: {
    title: (title: string) => `${title} 变化参考`,
    body: "图片仅用于咨询说明，并不保证结果。计划与恢复会因个人状态而不同。",
    beforeAlt: "术前咨询参考图",
    afterAlt: "术后自然变化参考图",
  },
  ja: {
    title: (title: string) => `${title} 変化参考`,
    body: "画像は相談用の参考であり、結果を保証するものではありません。計画と回復は個人差があります。",
    beforeAlt: "施術前相談参考画像",
    afterAlt: "施術後自然な変化参考画像",
  },
} satisfies Record<Locale, {
  title: (title: string) => string;
  body: string;
  beforeAlt: string;
  afterAlt: string;
}>;

const videoCopy = {
  ko: {
    plan: (title: string) => `${title} 상담 포인트`,
    planBody: "진단 기준과 디자인 방향을 짧게 소개합니다.",
    care: (title: string) => `${title} 회복 케어`,
    careBody: "시술 후 관리와 내원 리듬을 안내합니다.",
  },
  en: {
    plan: (title: string) => `${title} consultation points`,
    planBody: "A short preview of diagnosis and design direction.",
    care: (title: string) => `${title} recovery care`,
    careBody: "Aftercare and visit rhythm explained.",
  },
  zh: {
    plan: (title: string) => `${title} 咨询要点`,
    planBody: "简要说明诊断标准与设计方向。",
    care: (title: string) => `${title} 恢复护理`,
    careBody: "介绍术后护理与来院节奏。",
  },
  ja: {
    plan: (title: string) => `${title} 相談ポイント`,
    planBody: "診断基準とデザイン方向を短く紹介します。",
    care: (title: string) => `${title} 回復ケア`,
    careBody: "施術後のケアと通院リズムを案内します。",
  },
} satisfies Record<Locale, {
  plan: (title: string) => string;
  planBody: string;
  care: (title: string) => string;
  careBody: string;
}>;

const richImageCopy = {
  ko: {
    title: (title: string, index: number) => `${title} 상세 이미지 ${index}`,
    alt: (title: string, index: number) => `${title} 상세페이지용 긴 이미지 ${index}`,
  },
  en: {
    title: (title: string, index: number) => `${title} detail image ${index}`,
    alt: (title: string, index: number) => `${title} long-form detail page image ${index}`,
  },
  zh: {
    title: (title: string, index: number) => `${title} 详情图片 ${index}`,
    alt: (title: string, index: number) => `${title} 长详情页图片 ${index}`,
  },
  ja: {
    title: (title: string, index: number) => `${title} 詳細画像 ${index}`,
    alt: (title: string, index: number) => `${title} 縦長詳細ページ画像 ${index}`,
  },
} satisfies Record<Locale, {
  title: (title: string, index: number) => string;
  alt: (title: string, index: number) => string;
}>;

const ctaCopy = {
  ko: {
    title: (title: string) => `${title}, 상담에서 먼저 확인해야 할 것`,
    body: "원하는 이미지보다 현재 구조, 회복 가능 기간, 이전 시술 이력을 먼저 알려주시면 더 정확한 계획을 세울 수 있습니다.",
  },
  en: {
    title: (title: string) => `Before choosing ${title}`,
    body: "Share your structure concerns, recovery window, and previous treatments so the plan can be more precise.",
  },
  zh: {
    title: (title: string) => `选择 ${title} 前`,
    body: "请先告知结构困扰、可恢复时间和既往项目经历，以便制定更准确的计划。",
  },
  ja: {
    title: (title: string) => `${title}を選ぶ前に`,
    body: "希望イメージだけでなく、構造の悩み、回復可能な期間、過去の施術歴を共有してください。",
  },
} satisfies Record<Locale, {
  title: (title: string) => string;
  body: string;
}>;
