import type { Locale } from "@/i18n/config";

export type DoctorProfile = {
  name: string;
  role: string;
  image: string;
  summary: string;
  education: string[];
  career: string[];
  publications: string[];
  liveSurgery: string[];
};

export type DoctorProfileLabels = {
  openProfile: string;
  close: string;
  education: string;
  career: string;
  publications: string;
  liveSurgery: string;
};

export type DoctorTeamCopy = {
  metadataTitle: string;
  metadataDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  teamEyebrow: string;
  teamTitle: string;
  teamDescription: string;
  representativeBadge: string;
  homeTeamCta: string;
  otherDoctorsTitle: string;
  otherDoctorsDescription: string;
  labels: DoctorProfileLabels;
  representative: DoctorProfile;
  otherDoctors: DoctorProfile[];
};

export const doctorTeams: Record<Locale, DoctorTeamCopy> = {
  ko: {
    metadataTitle: "About Us | BAKSAL BEAUTY",
    metadataDescription:
      "BAKSAL BEAUTY의 의료진, 대표원장 경력, 논문, 라이브 서저리 경험을 소개합니다.",
    heroEyebrow: "BAKSAL BEAUTY 소개",
    heroTitle: "의료진과 철학",
    heroDescription:
      "BAKSAL BEAUTY는 얼굴과 몸의 구조를 먼저 읽고, 개인별 회복 리듬까지 함께 설계하는 성형외과입니다.",
    teamEyebrow: "의료진 소개",
    teamTitle: "의료진 소개",
    teamDescription:
      "대표원장을 중심으로 각 분야 원장들이 진단, 시술 계획, 회복 관리까지 하나의 기준으로 연결합니다.",
    representativeBadge: "대표원장",
    homeTeamCta: "의료진 소개 전체보기",
    otherDoctorsTitle: "분야별 원장진",
    otherDoctorsDescription:
      "각 원장은 상담 기록과 회복 계획을 공유하며, 필요한 경우 협진 방식으로 진료 방향을 조율합니다.",
    labels: {
      education: "학력",
      career: "경력",
      publications: "논문",
      liveSurgery: "라이브 서저리",
      openProfile: "상세 프로필 보기",
      close: "닫기",
    },
    representative: {
      name: "서진 대표원장",
      role: "안면 구조 성형 / 리프팅",
      image: "/images/doctor-director.jpg",
      summary:
        "얼굴의 비율, 표정, 피부 회복력을 함께 평가해 과하지 않은 변화를 설계합니다. 상담 단계에서 가능한 범위와 회복 흐름을 먼저 설명하고, 장기적으로 자연스럽게 남는 결과를 우선합니다.",
      education: [
        "서울대학교 의과대학 졸업",
        "서울대학교병원 성형외과 전공의 수료",
        "성형외과 전문의",
        "대한성형외과학회 정회원",
      ],
      career: [
        "BAKSAL BEAUTY 대표원장",
        "전 서울대학교병원 성형외과 임상강사",
        "전 압구정 소재 성형외과 안면윤곽·리프팅 센터장",
        "안면 구조 분석 및 회복 프로토콜 전담",
      ],
      publications: [
        "개인별 안면 비율 분석을 통한 자연스러운 리프팅 계획",
        "수술 후 회복 리듬을 고려한 상담 프로토콜",
        "비절개·수술적 접근의 통합 안면 개선 전략",
      ],
      liveSurgery: [
        "Deep plane facelift live surgery session",
        "Structural rhinoplasty planning workshop",
        "Facial contour balancing cadaver workshop",
        "Regenerative recovery protocol live demonstration",
      ],
    },
    otherDoctors: [
      {
        name: "민윤 원장",
        role: "바디 컨투어링 / 회복 설계",
        image: "/images/doctor-contour.jpg",
        summary:
          "체형의 흐름과 일상 복귀 계획을 함께 고려해 바디 라인을 설계합니다.",
        education: [
          "연세대학교 의과대학 졸업",
          "세브란스병원 성형외과 전공의 수료",
          "성형외과 전문의",
        ],
        career: [
          "BAKSAL BEAUTY 바디 컨투어링 원장",
          "전 대학병원 성형외과 외래교수",
          "체형 교정 및 회복 관리 프로그램 담당",
        ],
        publications: [
          "Body contouring aftercare and recovery rhythm",
          "High-definition liposuction planning by body proportion",
        ],
        liveSurgery: [
          "HD body contouring planning seminar",
          "Liposuction safety protocol live case review",
        ],
      },
      {
        name: "이하나 원장",
        role: "피부 재생 / 비수술 에스테틱",
        image: "/images/doctor-skin.jpg",
        summary:
          "레이저, 스킨부스터, 재생 케어를 피부 컨디션과 회복 속도에 맞춰 조합합니다.",
        education: [
          "가톨릭대학교 의과대학 졸업",
          "서울성모병원 피부·미용성형 임상 과정 수료",
          "대한레이저피부모발학회 정회원",
        ],
        career: [
          "BAKSAL BEAUTY 피부·비수술 원장",
          "전 프리미엄 피부 클리닉 레이저 센터장",
          "시술 후 피부 회복 케어 프로토콜 담당",
        ],
        publications: [
          "Regenerative skin program after aesthetic procedures",
          "Laser recovery sequence for sensitive skin",
        ],
        liveSurgery: [
          "Skin booster and laser combination live session",
          "Post-treatment barrier care live demonstration",
        ],
      },
      {
        name: "장리안 원장",
        role: "눈·코 상담 / 얼굴 밸런스",
        image: "/images/doctor-balance.jpg",
        summary:
          "눈, 코, 윤곽의 작은 변화가 전체 인상에 미치는 균형을 중심으로 상담합니다.",
        education: [
          "고려대학교 의과대학 졸업",
          "고려대학교의료원 성형외과 전공의 수료",
          "대한미용성형외과학회 정회원",
        ],
        career: [
          "BAKSAL BEAUTY 얼굴 밸런스 원장",
          "전 얼굴윤곽 전문 클리닉 진료원장",
          "눈·코·윤곽 통합 상담 프로그램 담당",
        ],
        publications: [
          "Facial balance planning for eye and nose procedures",
          "Patient-centered consultation for subtle facial refinement",
        ],
        liveSurgery: [
          "Eye and nose balance planning live clinic",
          "Facial proportion analysis workshop",
        ],
      },
    ],
  },
  en: {
    metadataTitle: "About Us | BAKSAL BEAUTY",
    metadataDescription:
      "Meet the BAKSAL BEAUTY medical team, representative director, publications, and live surgery experience.",
    heroEyebrow: "About BAKSAL BEAUTY",
    heroTitle: "Medical Team & Philosophy",
    heroDescription:
      "BAKSAL BEAUTY reads facial and body structure first, then plans every procedure around individual recovery rhythms.",
    teamEyebrow: "Medical Team",
    teamTitle: "Meet the Doctors",
    teamDescription:
      "Led by the representative director, each specialist connects diagnosis, treatment planning, and recovery care under one standard.",
    representativeBadge: "Representative Director",
    homeTeamCta: "View medical team",
    otherDoctorsTitle: "Specialist Directors",
    otherDoctorsDescription:
      "Each director shares consultation and recovery records, coordinating care when a collaborative plan is better for the patient.",
    labels: {
      education: "Education",
      career: "Career",
      publications: "Publications",
      liveSurgery: "Live Surgery",
      openProfile: "Open profile",
      close: "Close",
    },
    representative: {
      name: "Dr. Seo Jin",
      role: "Facial Structure / Lifting",
      image: "/images/doctor-director.jpg",
      summary:
        "Dr. Seo evaluates proportion, expression, and recovery potential together to design refined change without overpowering the face.",
      education: [
        "Seoul National University College of Medicine",
        "Residency, Plastic Surgery, Seoul National University Hospital",
        "Board-certified plastic surgeon",
        "Member, Korean Society of Plastic and Reconstructive Surgeons",
      ],
      career: [
        "Representative Director, BAKSAL BEAUTY",
        "Former Clinical Fellow, Seoul National University Hospital",
        "Former Facial Contour and Lifting Center Director in Apgujeong",
        "Lead for facial structure analysis and recovery protocols",
      ],
      publications: [
        "Natural lifting planning through individualized facial ratio analysis",
        "Consultation protocol based on post-operative recovery rhythm",
        "Integrated strategies for non-surgical and surgical facial refinement",
      ],
      liveSurgery: [
        "Deep plane facelift live surgery session",
        "Structural rhinoplasty planning workshop",
        "Facial contour balancing cadaver workshop",
        "Regenerative recovery protocol live demonstration",
      ],
    },
    otherDoctors: [
      {
        name: "Dr. Min Yoon",
        role: "Body Contouring / Recovery Planning",
        image: "/images/doctor-contour.jpg",
        summary:
          "Plans body lines with both silhouette flow and return-to-daily-life recovery in mind.",
        education: [
          "Yonsei University College of Medicine",
          "Residency, Plastic Surgery, Severance Hospital",
          "Board-certified plastic surgeon",
        ],
        career: [
          "Director of Body Contouring, BAKSAL BEAUTY",
          "Former outpatient professor at a university hospital",
          "Lead for body correction and recovery care programs",
        ],
        publications: [
          "Body contouring aftercare and recovery rhythm",
          "High-definition liposuction planning by body proportion",
        ],
        liveSurgery: [
          "HD body contouring planning seminar",
          "Liposuction safety protocol live case review",
        ],
      },
      {
        name: "Dr. Hana Lee",
        role: "Skin Regeneration / Non-Surgical Aesthetics",
        image: "/images/doctor-skin.jpg",
        summary:
          "Combines laser, skin booster, and regenerative care according to skin condition and recovery speed.",
        education: [
          "Catholic University College of Medicine",
          "Clinical program in dermatologic and aesthetic medicine, Seoul St. Mary's Hospital",
          "Member, Korean Aesthetic Laser Society",
        ],
        career: [
          "Director of Skin and Non-Surgical Care, BAKSAL BEAUTY",
          "Former laser center director at a premium skin clinic",
          "Lead for post-treatment skin recovery protocols",
        ],
        publications: [
          "Regenerative skin program after aesthetic procedures",
          "Laser recovery sequence for sensitive skin",
        ],
        liveSurgery: [
          "Skin booster and laser combination live session",
          "Post-treatment barrier care live demonstration",
        ],
      },
      {
        name: "Dr. Rian Jang",
        role: "Eye and Nose Consultation / Facial Balance",
        image: "/images/doctor-balance.jpg",
        summary:
          "Consults around how subtle eye, nose, and contour changes influence the full facial impression.",
        education: [
          "Korea University College of Medicine",
          "Residency, Plastic Surgery, Korea University Medical Center",
          "Member, Korean Society for Aesthetic Plastic Surgery",
        ],
        career: [
          "Director of Facial Balance, BAKSAL BEAUTY",
          "Former attending director at a facial contour clinic",
          "Lead for integrated eye, nose, and contour consultation",
        ],
        publications: [
          "Facial balance planning for eye and nose procedures",
          "Patient-centered consultation for subtle facial refinement",
        ],
        liveSurgery: [
          "Eye and nose balance planning live clinic",
          "Facial proportion analysis workshop",
        ],
      },
    ],
  },
  zh: {
    metadataTitle: "关于我们 | BAKSAL BEAUTY",
    metadataDescription: "介绍 BAKSAL BEAUTY 医疗团队、代表院长履历、论文与现场手术经验。",
    heroEyebrow: "关于 BAKSAL BEAUTY",
    heroTitle: "医疗团队与理念",
    heroDescription:
      "BAKSAL BEAUTY 先理解面部与身体结构，再根据个人恢复节奏制定诊疗计划。",
    teamEyebrow: "医疗团队",
    teamTitle: "医疗团队介绍",
    teamDescription:
      "以代表院长为中心，各领域院长将诊断、治疗计划和恢复管理连接为统一标准。",
    representativeBadge: "代表院长",
    homeTeamCta: "查看医疗团队",
    otherDoctorsTitle: "各领域院长",
    otherDoctorsDescription: "各院长共享咨询与恢复记录，必要时以协诊方式调整治疗方向。",
    labels: {
      education: "学历",
      career: "经历",
      publications: "论文",
      liveSurgery: "现场手术",
      openProfile: "查看详细资料",
      close: "关闭",
    },
    representative: {
      name: "徐珍 代表院长",
      role: "面部结构整形 / 提拉",
      image: "/images/doctor-director.jpg",
      summary:
        "综合评估面部比例、表情与恢复能力，设计不过度的自然变化，并在咨询阶段说明可行范围与恢复流程。",
      education: [
        "首尔大学医学院毕业",
        "首尔大学医院整形外科住院医师结业",
        "整形外科专科医师",
        "韩国整形外科学会正式会员",
      ],
      career: [
        "BAKSAL BEAUTY 代表院长",
        "前首尔大学医院整形外科临床讲师",
        "前首尔狎鸥亭整形外科面部轮廓·提拉中心主任",
        "负责面部结构分析与恢复方案",
      ],
      publications: [
        "基于个体面部比例分析的自然提拉计划",
        "考虑术后恢复节奏的咨询方案",
        "非手术与手术面部改善的综合策略",
      ],
      liveSurgery: [
        "Deep plane facelift live surgery session",
        "Structural rhinoplasty planning workshop",
        "Facial contour balancing cadaver workshop",
        "Regenerative recovery protocol live demonstration",
      ],
    },
    otherDoctors: [
      {
        name: "闵允 院长",
        role: "身体轮廓 / 恢复计划",
        image: "/images/doctor-contour.jpg",
        summary: "在考虑身体线条流动感与日常恢复计划的基础上设计体型比例。",
        education: [
          "延世大学医学院毕业",
          "Severance 医院整形外科住院医师结业",
          "整形外科专科医师",
        ],
        career: [
          "BAKSAL BEAUTY 身体轮廓院长",
          "前大学医院整形外科门诊教授",
          "负责体型矫正与恢复管理项目",
        ],
        publications: [
          "Body contouring aftercare and recovery rhythm",
          "High-definition liposuction planning by body proportion",
        ],
        liveSurgery: [
          "HD body contouring planning seminar",
          "Liposuction safety protocol live case review",
        ],
      },
      {
        name: "李荷娜 院长",
        role: "皮肤再生 / 非手术美学",
        image: "/images/doctor-skin.jpg",
        summary: "根据皮肤状态与恢复速度，组合激光、皮肤补水及再生护理。",
        education: [
          "天主教大学医学院毕业",
          "首尔圣母医院皮肤·美容临床课程结业",
          "韩国激光皮肤毛发学会正式会员",
        ],
        career: [
          "BAKSAL BEAUTY 皮肤·非手术院长",
          "前高级皮肤诊所激光中心主任",
          "负责术后皮肤恢复护理方案",
        ],
        publications: [
          "Regenerative skin program after aesthetic procedures",
          "Laser recovery sequence for sensitive skin",
        ],
        liveSurgery: [
          "Skin booster and laser combination live session",
          "Post-treatment barrier care live demonstration",
        ],
      },
      {
        name: "张理安 院长",
        role: "眼鼻咨询 / 面部平衡",
        image: "/images/doctor-balance.jpg",
        summary: "从眼、鼻、轮廓的微小变化对整体印象的影响出发进行咨询。",
        education: [
          "高丽大学医学院毕业",
          "高丽大学医疗院整形外科住院医师结业",
          "韩国美容整形外科学会正式会员",
        ],
        career: [
          "BAKSAL BEAUTY 面部平衡院长",
          "前面部轮廓专科诊所诊疗院长",
          "负责眼鼻轮廓综合咨询项目",
        ],
        publications: [
          "Facial balance planning for eye and nose procedures",
          "Patient-centered consultation for subtle facial refinement",
        ],
        liveSurgery: [
          "Eye and nose balance planning live clinic",
          "Facial proportion analysis workshop",
        ],
      },
    ],
  },
  ja: {
    metadataTitle: "About Us | BAKSAL BEAUTY",
    metadataDescription:
      "BAKSAL BEAUTY の医療チーム、代表院長の経歴、論文、ライブサージェリー経験を紹介します。",
    heroEyebrow: "BAKSAL BEAUTY について",
    heroTitle: "医療チームと哲学",
    heroDescription:
      "BAKSAL BEAUTY は顔と体の構造を先に読み取り、個人の回復リズムに合わせて計画します。",
    teamEyebrow: "医療チーム",
    teamTitle: "医療陣紹介",
    teamDescription:
      "代表院長を中心に、各分野の医師が診断、施術計画、回復管理を一つの基準でつなぎます。",
    representativeBadge: "代表院長",
    homeTeamCta: "医療チームを見る",
    otherDoctorsTitle: "分野別医師",
    otherDoctorsDescription:
      "各医師が相談記録と回復計画を共有し、必要に応じて協診で診療方針を調整します。",
    labels: {
      education: "学歴",
      career: "経歴",
      publications: "論文",
      liveSurgery: "ライブサージェリー",
      openProfile: "詳細プロフィール",
      close: "閉じる",
    },
    representative: {
      name: "ソ・ジン 代表院長",
      role: "顔構造整形 / リフティング",
      image: "/images/doctor-director.jpg",
      summary:
        "顔の比率、表情、肌の回復力を総合的に評価し、過度ではない自然な変化を設計します。",
      education: [
        "ソウル大学医学部卒業",
        "ソウル大学病院形成外科レジデント修了",
        "形成外科専門医",
        "韓国形成外科学会 正会員",
      ],
      career: [
        "BAKSAL BEAUTY 代表院長",
        "元ソウル大学病院形成外科 臨床講師",
        "元狎鴎亭美容外科 顔輪郭・リフティングセンター長",
        "顔構造分析および回復プロトコル担当",
      ],
      publications: [
        "個人別顔比率分析による自然なリフティング計画",
        "術後回復リズムを考慮した相談プロトコル",
        "非手術・手術的アプローチの統合的顔改善戦略",
      ],
      liveSurgery: [
        "Deep plane facelift live surgery session",
        "Structural rhinoplasty planning workshop",
        "Facial contour balancing cadaver workshop",
        "Regenerative recovery protocol live demonstration",
      ],
    },
    otherDoctors: [
      {
        name: "ミン・ユン 院長",
        role: "ボディコントゥアリング / 回復設計",
        image: "/images/doctor-contour.jpg",
        summary:
          "体型の流れと日常復帰の計画を合わせて考え、ボディラインを設計します。",
        education: [
          "延世大学医学部卒業",
          "セブランス病院形成外科レジデント修了",
          "形成外科専門医",
        ],
        career: [
          "BAKSAL BEAUTY ボディコントゥアリング院長",
          "元大学病院形成外科 外来教授",
          "体型補正および回復管理プログラム担当",
        ],
        publications: [
          "Body contouring aftercare and recovery rhythm",
          "High-definition liposuction planning by body proportion",
        ],
        liveSurgery: [
          "HD body contouring planning seminar",
          "Liposuction safety protocol live case review",
        ],
      },
      {
        name: "イ・ハナ 院長",
        role: "肌再生 / 非手術エステティック",
        image: "/images/doctor-skin.jpg",
        summary:
          "レーザー、スキンブースター、再生ケアを肌状態と回復速度に合わせて組み合わせます。",
        education: [
          "カトリック大学医学部卒業",
          "ソウル聖母病院 皮膚・美容臨床課程修了",
          "韓国レーザー皮膚毛髪学会 正会員",
        ],
        career: [
          "BAKSAL BEAUTY 皮膚・非手術院長",
          "元プレミアム皮膚クリニック レーザーセンター長",
          "施術後皮膚回復ケアプロトコル担当",
        ],
        publications: [
          "Regenerative skin program after aesthetic procedures",
          "Laser recovery sequence for sensitive skin",
        ],
        liveSurgery: [
          "Skin booster and laser combination live session",
          "Post-treatment barrier care live demonstration",
        ],
      },
      {
        name: "チャン・リアン 院長",
        role: "目・鼻相談 / 顔バランス",
        image: "/images/doctor-balance.jpg",
        summary:
          "目、鼻、輪郭の小さな変化が全体の印象に与えるバランスを中心に相談します。",
        education: [
          "高麗大学医学部卒業",
          "高麗大学医療院形成外科レジデント修了",
          "韓国美容形成外科学会 正会員",
        ],
        career: [
          "BAKSAL BEAUTY 顔バランス院長",
          "元顔輪郭専門クリニック 診療院長",
          "目・鼻・輪郭統合相談プログラム担当",
        ],
        publications: [
          "Facial balance planning for eye and nose procedures",
          "Patient-centered consultation for subtle facial refinement",
        ],
        liveSurgery: [
          "Eye and nose balance planning live clinic",
          "Facial proportion analysis workshop",
        ],
      },
    ],
  },
};

export function getDoctorTeam(locale: Locale) {
  return doctorTeams[locale];
}
