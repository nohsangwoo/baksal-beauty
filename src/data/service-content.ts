import type { Locale } from "@/i18n/config";

export const serviceCategoryIds = ["all", "eye", "nose", "lifting", "petit"] as const;

export type ServiceCategoryId = (typeof serviceCategoryIds)[number];
export type ServiceContentCategory = Exclude<ServiceCategoryId, "all">;
export type ServiceStatus = "draft" | "published" | "archived";

export type ServiceItem = {
  id: string;
  slug: string;
  category: ServiceContentCategory;
  tags: ServiceContentCategory[];
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  sortOrder: number;
  status: ServiceStatus;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  highlights: string[];
  recommendedFor: string[];
  process: string[];
  recovery: string;
  duration: string;
  priceNote: string;
  updatedAt?: string;
};

export type ServicePageCopy = {
  eyebrow: string;
  title: string;
  catalogTitle: string;
  description: string;
  tabs: Record<ServiceCategoryId, string>;
  details: {
    recommended: string;
    process: string;
    recovery: string;
    duration: string;
    price: string;
    inquiry: string;
    empty: string;
  };
};

export type LocalizedServiceSeed = {
  slug: string;
  category: ServiceContentCategory;
  tags: ServiceContentCategory[];
  imageUrl: string;
  imageAlt: Record<Locale, string>;
  featured: boolean;
  sortOrder: number;
  status: ServiceStatus;
  translations: Record<
    Locale,
    Pick<
      ServiceItem,
      | "title"
      | "subtitle"
      | "summary"
      | "description"
      | "highlights"
      | "recommendedFor"
      | "process"
      | "recovery"
      | "duration"
      | "priceNote"
    >
  >;
};

export const servicePageCopy: Record<Locale, ServicePageCopy> = {
  ko: {
    eyebrow: "Service",
    title: "개인별 구조와 회복 흐름을 고려한 시술 안내",
    catalogTitle: "카테고리별 시술",
    description:
      "눈, 코, 리프팅, 쁘띠 시술을 하나의 기준으로 비교하지 않고 얼굴의 균형과 회복 계획을 함께 검토합니다.",
    tabs: {
      all: "전체",
      eye: "눈성형",
      nose: "코성형",
      lifting: "리프팅",
      petit: "쁘띠",
    },
    details: {
      recommended: "이런 분께 권합니다",
      process: "진료 흐름",
      recovery: "회복 안내",
      duration: "예상 소요",
      price: "비용 안내",
      inquiry: "상담 문의",
      empty: "선택한 카테고리에 등록된 시술이 아직 없습니다.",
    },
  },
  en: {
    eyebrow: "Service",
    title: "Treatments planned around structure, balance, and recovery",
    catalogTitle: "Treatment Catalog",
    description:
      "Eye, nose, lifting, and minimally invasive treatments are reviewed through facial harmony and realistic recovery planning.",
    tabs: {
      all: "All",
      eye: "Eyes",
      nose: "Nose",
      lifting: "Lifting",
      petit: "Petit",
    },
    details: {
      recommended: "Recommended for",
      process: "Care flow",
      recovery: "Recovery",
      duration: "Duration",
      price: "Fee guide",
      inquiry: "Inquire",
      empty: "No treatments are registered for this category yet.",
    },
  },
  zh: {
    eyebrow: "Service",
    title: "依据个人结构、比例与恢复计划设计治疗",
    catalogTitle: "项目分类",
    description:
      "眼部、鼻部、提升与轻医美项目会结合面部协调度、恢复周期和个人目标进行说明。",
    tabs: {
      all: "全部",
      eye: "眼部整形",
      nose: "鼻部整形",
      lifting: "提升",
      petit: "轻医美",
    },
    details: {
      recommended: "适合人群",
      process: "诊疗流程",
      recovery: "恢复说明",
      duration: "预计时间",
      price: "费用说明",
      inquiry: "咨询",
      empty: "该分类暂无已登记项目。",
    },
  },
  ja: {
    eyebrow: "Service",
    title: "骨格、バランス、回復計画をもとにした施術案内",
    catalogTitle: "施術カテゴリ",
    description:
      "目元、鼻、リフティング、プチ施術を顔全体の調和と現実的な回復計画に沿ってご案内します。",
    tabs: {
      all: "すべて",
      eye: "目元",
      nose: "鼻",
      lifting: "リフト",
      petit: "プチ",
    },
    details: {
      recommended: "おすすめの方",
      process: "診療の流れ",
      recovery: "回復案内",
      duration: "所要時間",
      price: "費用案内",
      inquiry: "相談する",
      empty: "このカテゴリにはまだ登録された施術がありません。",
    },
  },
};

export const serviceSeeds: LocalizedServiceSeed[] = [
  {
    slug: "natural-eye-design",
    category: "eye",
    tags: ["eye"],
    imageUrl: "/images/service-eye-design.jpg",
    imageAlt: {
      ko: "눈성형 상담을 받는 성인 여성의 클리닉 포트레이트",
      en: "Adult woman during an eye surgery consultation in a clinic",
      zh: "成人女性眼部整形咨询画面",
      ja: "目元施術相談を受ける成人女性",
    },
    featured: true,
    sortOrder: 10,
    status: "published",
    translations: {
      ko: {
        title: "자연유착 눈매 디자인",
        subtitle: "라인보다 먼저 눈의 힘과 비율을 봅니다.",
        summary: "또렷함은 더하고 과한 인상 변화는 줄이는 눈매 교정 중심 상담입니다.",
        description:
          "피부 두께, 눈뜨는 힘, 좌우 비대칭, 눈썹과 눈 사이의 간격을 함께 확인해 개인에게 맞는 라인을 제안합니다.",
        highlights: ["눈뜨는 힘 진단", "자연스러운 라인 계획", "좌우 균형 점검"],
        recommendedFor: ["졸려 보이는 눈매가 고민인 분", "기존 라인이 흐려진 분", "과하지 않은 변화를 원하는 분"],
        process: ["정밀 계측", "라인 시뮬레이션", "수술 또는 비수술 계획 안내"],
        recovery: "붓기와 멍은 개인차가 있으며 회복 일정에 맞춘 사후 관리가 안내됩니다.",
        duration: "상담 후 개인별 안내",
        priceNote: "정확한 비용은 진료 후 범위에 따라 안내됩니다.",
      },
      en: {
        title: "Natural Adhesion Eye Design",
        subtitle: "We assess eyelid strength and proportion before choosing a line.",
        summary: "A restrained eye refinement plan focused on clarity without an exaggerated change.",
        description:
          "Skin thickness, opening strength, asymmetry, and brow-to-eye distance are reviewed together to suggest a personal line.",
        highlights: ["Opening strength review", "Natural line planning", "Asymmetry check"],
        recommendedFor: ["Tired-looking eyes", "Faded eyelid line", "Subtle refined change"],
        process: ["Detailed measurement", "Line simulation", "Procedure plan guidance"],
        recovery: "Swelling and bruising vary by person. Recovery care is guided after consultation.",
        duration: "Guided after consultation",
        priceNote: "Fees are provided after medical consultation based on scope.",
      },
      zh: {
        title: "自然粘连双眼皮设计",
        subtitle: "先判断睁眼力量与比例，再设计线条。",
        summary: "以自然清晰为目标，减少夸张变化的眼部改善方案。",
        description:
          "综合评估皮肤厚度、睁眼力量、左右不对称以及眉眼距离后，提出适合个人的线条设计。",
        highlights: ["睁眼力量评估", "自然线条设计", "左右平衡检查"],
        recommendedFor: ["眼神显疲惫者", "双眼皮线条变淡者", "希望自然改善者"],
        process: ["精密测量", "线条模拟", "说明手术或非手术计划"],
        recovery: "肿胀和淤青因人而异，将根据恢复计划提供护理说明。",
        duration: "咨询后个别说明",
        priceNote: "费用会在医生面诊后根据范围说明。",
      },
      ja: {
        title: "自然癒着アイデザイン",
        subtitle: "ラインの前に目の開きと比率を確認します。",
        summary: "大きく変えすぎず、自然な明るさを目指す目元改善プランです。",
        description:
          "皮膚の厚み、目を開く力、左右差、眉と目の距離を総合的に確認し、個人に合うラインを提案します。",
        highlights: ["開眼力の確認", "自然なライン計画", "左右差の確認"],
        recommendedFor: ["眠たく見える目元が気になる方", "ラインが薄くなった方", "自然な変化を望む方"],
        process: ["精密計測", "ラインシミュレーション", "施術計画の案内"],
        recovery: "腫れや内出血には個人差があり、回復に合わせてケアをご案内します。",
        duration: "相談後に個別案内",
        priceNote: "費用は診察後、範囲に応じてご案内します。",
      },
    },
  },
  {
    slug: "balanced-rhinoplasty",
    category: "nose",
    tags: ["nose"],
    imageUrl: "/images/treatment-rhinoplasty.jpg",
    imageAlt: {
      ko: "코 라인 상담을 위한 얼굴 측면 포트레이트",
      en: "Portrait for rhinoplasty line consultation",
      zh: "鼻部线条咨询肖像",
      ja: "鼻のライン相談用ポートレート",
    },
    featured: true,
    sortOrder: 20,
    status: "published",
    translations: {
      ko: {
        title: "밸런스 코성형",
        subtitle: "높이보다 얼굴 전체의 흐름을 우선합니다.",
        summary: "이마, 코끝, 입술, 턱 라인을 함께 고려해 자연스러운 입체감을 계획합니다.",
        description:
          "콧대와 코끝만 분리해서 보지 않고 정면과 측면의 균형, 피부 두께, 기존 보형물 여부까지 확인합니다.",
        highlights: ["정면과 측면 균형", "코끝 지지 구조 확인", "재수술 가능성 상담"],
        recommendedFor: ["얼굴에 맞는 코 라인을 찾고 싶은 분", "코끝 처짐이 고민인 분", "재수술 전 진단이 필요한 분"],
        process: ["안면 비율 분석", "재료와 범위 설명", "회복 계획 안내"],
        recovery: "초기 부기 이후 잔부기는 단계적으로 변화할 수 있습니다.",
        duration: "상담 후 개인별 안내",
        priceNote: "개인별 범위와 재료에 따라 진료 후 안내됩니다.",
      },
      en: {
        title: "Balanced Rhinoplasty",
        subtitle: "Overall facial flow comes before height.",
        summary: "Forehead, tip, lips, and chin line are reviewed together for a natural profile.",
        description:
          "Bridge and tip are not assessed in isolation. Frontal and side balance, skin thickness, and prior implants are reviewed.",
        highlights: ["Front and side balance", "Tip support review", "Revision consultation"],
        recommendedFor: ["A nose line suited to the whole face", "Drooping tip concern", "Revision diagnosis"],
        process: ["Facial proportion analysis", "Material and scope guide", "Recovery planning"],
        recovery: "Residual swelling may change gradually after the initial swelling period.",
        duration: "Guided after consultation",
        priceNote: "Fees vary by scope and material after consultation.",
      },
      zh: {
        title: "平衡鼻整形",
        subtitle: "比高度更重视面部整体线条。",
        summary: "综合额头、鼻尖、唇部和下巴线条，规划自然立体感。",
        description:
          "不仅单独看鼻梁或鼻尖，还会确认正侧面平衡、皮肤厚度以及既往假体情况。",
        highlights: ["正侧面平衡", "鼻尖支撑结构评估", "修复手术咨询"],
        recommendedFor: ["希望找到适合面部鼻型者", "鼻尖下垂困扰者", "需要修复前诊断者"],
        process: ["面部比例分析", "材料与范围说明", "恢复计划说明"],
        recovery: "初期肿胀后，细微肿胀会阶段性变化。",
        duration: "咨询后个别说明",
        priceNote: "根据个人范围和材料，面诊后说明费用。",
      },
      ja: {
        title: "バランス鼻整形",
        subtitle: "高さより顔全体の流れを優先します。",
        summary: "額、鼻先、唇、顎のラインを一緒に見て自然な立体感を計画します。",
        description:
          "鼻筋と鼻先だけでなく、正面と側面のバランス、皮膚の厚み、既存プロテーゼの有無も確認します。",
        highlights: ["正面と側面のバランス", "鼻先支持構造の確認", "再手術相談"],
        recommendedFor: ["顔に合う鼻ラインを探す方", "鼻先の下がりが気になる方", "再手術前の診断が必要な方"],
        process: ["顔比率の分析", "材料と範囲の説明", "回復計画の案内"],
        recovery: "初期の腫れの後、残った腫れは段階的に変化します。",
        duration: "相談後に個別案内",
        priceNote: "範囲と材料により診察後にご案内します。",
      },
    },
  },
  {
    slug: "deep-structure-lifting",
    category: "lifting",
    tags: ["lifting"],
    imageUrl: "/images/service-lifting.jpg",
    imageAlt: {
      ko: "리프팅 상담을 위한 성인 여성 얼굴 포트레이트",
      en: "Adult woman portrait for lifting consultation",
      zh: "面部提升咨询肖像",
      ja: "リフティング相談用ポートレート",
    },
    featured: true,
    sortOrder: 30,
    status: "published",
    translations: {
      ko: {
        title: "딥 구조 리프팅",
        subtitle: "피부만 당기지 않고 처짐의 방향을 봅니다.",
        summary: "얼굴선, 팔자, 턱선의 변화 원인을 분석해 수술과 비수술 옵션을 구분합니다.",
        description:
          "피부 탄력, 지방 위치, 근막층의 지지력을 함께 확인하고 과도한 당김 없이 자연스러운 회복을 목표로 합니다.",
        highlights: ["처짐 방향 분석", "수술/비수술 구분", "회복 일정 설계"],
        recommendedFor: ["얼굴선이 무너져 보이는 분", "팔자와 턱선 처짐이 고민인 분", "자연스러운 개선을 원하는 분"],
        process: ["피부와 구조 진단", "리프팅 방식 비교", "사후 관리 안내"],
        recovery: "방식에 따라 회복 기간이 달라지며 일상 일정에 맞춰 안내됩니다.",
        duration: "상담 후 개인별 안내",
        priceNote: "정확한 비용은 진료 후 시술 방식에 따라 안내됩니다.",
      },
      en: {
        title: "Deep Structure Lifting",
        subtitle: "We look at the direction of sagging, not only the skin.",
        summary: "Facial line, nasolabial folds, and jawline changes are reviewed to separate surgical and non-surgical options.",
        description:
          "Skin elasticity, fat position, and fascial support are assessed together with a goal of natural recovery.",
        highlights: ["Sagging vector review", "Surgical/non-surgical planning", "Recovery schedule"],
        recommendedFor: ["Softened facial line", "Nasolabial and jawline sagging", "Natural-looking refinement"],
        process: ["Skin and structure diagnosis", "Method comparison", "Aftercare guide"],
        recovery: "Recovery varies by method and is guided around your daily schedule.",
        duration: "Guided after consultation",
        priceNote: "Fees are provided after consultation according to method.",
      },
      zh: {
        title: "深层结构提升",
        subtitle: "不只拉紧皮肤，更重视下垂方向。",
        summary: "分析面部线条、法令纹和下颌线变化原因，区分手术与非手术方案。",
        description:
          "同时确认皮肤弹性、脂肪位置与筋膜支撑力，目标是避免过度牵拉并实现自然恢复。",
        highlights: ["下垂方向分析", "手术/非手术区分", "恢复日程设计"],
        recommendedFor: ["面部轮廓松垮者", "法令纹和下颌线下垂者", "希望自然改善者"],
        process: ["皮肤与结构诊断", "提升方式比较", "术后管理说明"],
        recovery: "恢复期会因方式不同而变化，并根据日常安排说明。",
        duration: "咨询后个别说明",
        priceNote: "费用根据诊疗后确定的方式说明。",
      },
      ja: {
        title: "ディープ構造リフティング",
        subtitle: "皮膚だけでなく、たるみの方向を見ます。",
        summary: "フェイスライン、ほうれい線、顎ラインの変化原因を分析し、手術と非手術を分けて提案します。",
        description:
          "皮膚弾力、脂肪の位置、筋膜層の支持力を確認し、過度な引き上げを避けた自然な回復を目指します。",
        highlights: ["たるみ方向の分析", "手術/非手術の分類", "回復日程の設計"],
        recommendedFor: ["輪郭がぼやけて見える方", "ほうれい線や顎ラインが気になる方", "自然な改善を望む方"],
        process: ["皮膚と構造の診断", "方式の比較", "アフターケア案内"],
        recovery: "方式により回復期間が異なり、日常予定に合わせて案内します。",
        duration: "相談後に個別案内",
        priceNote: "費用は診察後、施術方式によりご案内します。",
      },
    },
  },
  {
    slug: "petit-facial-balancing",
    category: "petit",
    tags: ["petit", "lifting"],
    imageUrl: "/images/service-petit.jpg",
    imageAlt: {
      ko: "쁘띠 시술 상담 중인 성인 여성",
      en: "Adult woman during a petit aesthetic treatment consultation",
      zh: "轻医美咨询中的成人女性",
      ja: "プチ施術相談中の成人女性",
    },
    featured: false,
    sortOrder: 40,
    status: "published",
    translations: {
      ko: {
        title: "쁘띠 페이스 밸런싱",
        subtitle: "작은 용량으로 얼굴의 흐름을 정리합니다.",
        summary: "필러, 보톡스, 스킨부스터를 얼굴 전체의 균형 안에서 보수적으로 계획합니다.",
        description:
          "단일 부위의 변화보다 표정, 피부결, 볼륨의 연결성을 함께 확인해 자연스러운 인상을 목표로 합니다.",
        highlights: ["보수적 용량 설계", "표정 변화 확인", "피부결과 볼륨 균형"],
        recommendedFor: ["수술보다 가벼운 변화를 원하는 분", "얼굴 피로감이 고민인 분", "주기적 관리가 필요한 분"],
        process: ["표정과 볼륨 진단", "시술 범위 확정", "주의사항 안내"],
        recovery: "시술 종류에 따라 일상 복귀 가능 시점이 달라집니다.",
        duration: "상담 후 개인별 안내",
        priceNote: "사용 제품과 범위에 따라 진료 후 안내됩니다.",
      },
      en: {
        title: "Petit Facial Balancing",
        subtitle: "Small-volume planning for a cleaner facial flow.",
        summary: "Filler, botulinum toxin, and skin booster options are planned conservatively within the whole face.",
        description:
          "Expression, skin texture, and volume connection are reviewed for a natural impression rather than a single-point change.",
        highlights: ["Conservative dosage", "Expression review", "Texture and volume balance"],
        recommendedFor: ["Light changes before surgery", "Tired facial impression", "Regular maintenance"],
        process: ["Expression and volume review", "Scope confirmation", "Aftercare guidance"],
        recovery: "Return-to-daily timing varies by treatment type.",
        duration: "Guided after consultation",
        priceNote: "Fees are guided after consultation by product and scope.",
      },
      zh: {
        title: "轻医美面部平衡",
        subtitle: "以小剂量整理面部线条。",
        summary: "将填充、肉毒和皮肤营养项目放在整体面部比例中保守规划。",
        description:
          "不只看单一区域变化，还会确认表情、肤质和容量连接感，追求自然印象。",
        highlights: ["保守剂量设计", "表情变化确认", "肤质与容量平衡"],
        recommendedFor: ["希望轻度改善者", "面部疲惫感明显者", "需要周期管理者"],
        process: ["表情与容量诊断", "确定施术范围", "注意事项说明"],
        recovery: "根据项目不同，恢复与日常回归时间会有所不同。",
        duration: "咨询后个别说明",
        priceNote: "根据使用产品和范围，面诊后说明。",
      },
      ja: {
        title: "プチ・フェイスバランシング",
        subtitle: "少量設計で顔全体の流れを整えます。",
        summary: "フィラー、ボトックス、スキンブースターを顔全体のバランスの中で控えめに計画します。",
        description:
          "単一部位の変化だけでなく、表情、肌質、ボリュームのつながりを確認し、自然な印象を目指します。",
        highlights: ["控えめな容量設計", "表情変化の確認", "肌質とボリュームの調和"],
        recommendedFor: ["手術より軽い変化を望む方", "疲れた印象が気になる方", "定期管理が必要な方"],
        process: ["表情とボリューム診断", "範囲の確定", "注意事項の案内"],
        recovery: "施術種類により日常復帰の目安が異なります。",
        duration: "相談後に個別案内",
        priceNote: "使用製品と範囲により診察後に案内します。",
      },
    },
  },
];

export function getFallbackServices(locale: Locale, category: ServiceCategoryId = "all"): ServiceItem[] {
  return serviceSeeds
    .filter((item) => category === "all" || item.tags.includes(category))
    .map((item) => {
      const translation = item.translations[locale] ?? item.translations.ko;

      return {
        id: item.slug,
        slug: item.slug,
        category: item.category,
        tags: item.tags,
        imageUrl: item.imageUrl,
        imageAlt: item.imageAlt[locale] ?? item.imageAlt.ko,
        featured: item.featured,
        sortOrder: item.sortOrder,
        status: item.status,
        ...translation,
      };
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
}
