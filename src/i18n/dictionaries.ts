import type { Locale } from "./config";

type NavItem = {
  label: string;
  href: string;
};

export type TreatmentPillar = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  items: string[];
};

type ImageCard = {
  category?: string;
  title: string;
  image: string;
};

type Doctor = {
  name: string;
  role: string;
  image: string;
  summary: string;
};

type Review = {
  quote: string;
  name: string;
};

type GuideCard = {
  title: string;
  image: string;
  items: string[];
};

type Product = {
  name: string;
  description: string;
};

export type HomeDictionary = {
  metadata: {
    title: string;
    description: string;
  };
  nav: NavItem[];
  language: {
    switchLabel: string;
  };
  common: {
    brandHome: string;
    phoneCta: string;
    consultCta: string;
    servicesCta: string;
    viewDetails: string;
    readMore: string;
    profileCta: string;
    guidedAfterConsultation: string;
    inquire: string;
  };
  hero: {
    announcement: string;
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    line: string;
    body: string;
    imageAlt: string;
  };
  trustSignals: string[];
  philosophy: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    body: string;
    imageAlt: string;
    interiorAlt: string;
    metrics: { value: string; label: string }[];
    cta: string;
  };
  services: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    pillarCta: string;
    pillars: TreatmentPillar[];
  };
  popular: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    allCta: string;
    treatments: ImageCard[];
  };
  comparison: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    body: string;
    stats: { value: string; label: string }[];
    beforeLabel: string;
    afterLabel: string;
    rangeLabel: string;
    beforeAlt: string;
    afterAlt: string;
  };
  inquiry: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    imageAlt: string;
  };
  doctors: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    intro: string;
    cta: string;
    list: Doctor[];
  };
  reviews: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    intro: string;
    list: Review[];
  };
  guide: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    body: string;
    notice: string;
    cards: GuideCard[];
  };
  consultation: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
    fields: {
      name: string;
      phone: string;
      interest: string;
      channel: string;
      message: string;
    };
    placeholders: {
      name: string;
      phone: string;
      service: string;
      channel: string;
      message: string;
    };
    services: string[];
    channels: string[];
    submit: string;
  };
  shop: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    intro: string;
    products: Product[];
  };
  blog: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    posts: ImageCard[];
  };
  newsletter: {
    title: string;
    body: string;
    placeholder: string;
    submit: string;
    imageAlt: string;
  };
  footer: {
    officeTitle: string;
    officeBody: string;
    officeNote: string;
    centerLabel: string;
    companyName: string;
    partnerLabel: string;
    registration: string;
    address: string;
    contactsTitle: string;
    copyright: string;
  };
};

export const dictionaries: Record<Locale, HomeDictionary> = {
  ko: {
    metadata: {
      title: "BAKSAL BEAUTY Plastic Surgery",
      description:
        "구조적 상담, 자연스러운 변화, 회복 중심 케어를 제안하는 프리미엄 성형외과 홈페이지입니다.",
    },
    nav: [
      { label: "About Us", href: "#about" },
      { label: "Service", href: "#services" },
      { label: "Blog", href: "#blog" },
      { label: "Inquire", href: "#consult" },
    ],
    language: {
      switchLabel: "English",
    },
    common: {
      brandHome: "BAKSAL BEAUTY home",
      phoneCta: "상담 신청",
      consultCta: "상담 신청하기",
      servicesCta: "서비스 보기",
      viewDetails: "View details",
      readMore: "Read more",
      profileCta: "Open profile",
      guidedAfterConsultation: "상담 후 안내",
      inquire: "문의하기",
    },
    hero: {
      announcement: "5월 신규 상담 오픈 · 개인별 진단 후 시술 계획을 안내합니다.",
      eyebrow: "Advanced Aesthetic Medicine",
      titleTop: "BAKSAL",
      titleBottom: "BEAUTY",
      line: "Refined beauty, thoughtfully designed.",
      body: "과장된 변화보다 얼굴과 몸의 구조를 존중합니다. 상담, 시술, 회복 관리까지 자연스러운 자신감을 향해 설계합니다.",
      imageAlt: "분홍 꽃 사이의 여성 얼굴 클로즈업",
    },
    trustSignals: [
      "ANATOMY-FIRST PLANNING",
      "PRIVATE CONSULTATION",
      "RECOVERY CARE",
      "NON-OVERPOWERING RESULTS",
    ],
    philosophy: {
      eyebrow: "Our Philosophy",
      titleA: "Aesthetic",
      titleB: "intelligence.",
      titleC: "Surgical precision.",
      body: "유행보다 먼저 봐야 할 것은 구조입니다. BAKSAL BEAUTY는 얼굴의 비율, 표정의 움직임, 회복 가능한 생활 리듬을 함께 검토해 개인에게 맞는 변화의 범위를 제안합니다.",
      imageAlt: "성형외과 상담 철학을 표현한 여성 포트레이트",
      interiorAlt: "프리미엄 클리닉 상담 라운지",
      metrics: [
        { value: "Structure", label: "진단에서 사후관리까지" },
        { value: "Balance", label: "진단에서 사후관리까지" },
        { value: "Recovery", label: "진단에서 사후관리까지" },
      ],
      cta: "의료진 보기",
    },
    services: {
      eyebrow: "Core Treatment Pillars",
      titleA: "Core",
      titleB: "treatment",
      titleC: "pillars",
      pillarCta: "상담으로 이어보기",
      pillars: [
        {
          id: "facial",
          label: "Facial Refinement",
          eyebrow: "Face",
          title: "얼굴의 구조를 먼저 읽는 디자인",
          description:
            "눈, 코, 윤곽, 리프팅까지 한 부위가 아닌 전체 균형을 기준으로 상담합니다. 과한 변화보다 오래 남는 자연스러운 인상을 목표로 합니다.",
          image: "/images/pillar-facial.jpg",
          items: ["눈·코 상담", "윤곽 밸런스", "리프팅", "피부 결 개선"],
        },
        {
          id: "body",
          label: "Sculpted Silhouette",
          eyebrow: "Body",
          title: "라인의 시작과 끝을 함께 설계",
          description:
            "체형은 숫자보다 실루엣의 흐름이 중요합니다. 지방흡입, 복부·팔 라인, 회복 계획을 개인별 생활 패턴에 맞춰 조정합니다.",
          image: "/images/pillar-body.jpg",
          items: ["바디 컨투어링", "지방흡입 상담", "복부·팔 라인", "회복 관리"],
        },
        {
          id: "skin",
          label: "Regenerative Aesthetics",
          eyebrow: "Skin",
          title: "피부 컨디션을 회복 중심으로 관리",
          description:
            "레이저, 스킨부스터, 재생 케어를 피부 장벽과 회복 속도에 맞춥니다. 시술 전후 케어까지 연결되는 계획을 제안합니다.",
          image: "/images/pillar-regenerative.jpg",
          items: ["스킨부스터", "레이저", "색소·흉터", "재생 케어"],
        },
      ],
    },
    popular: {
      eyebrow: "Explore",
      titleA: "Our",
      titleB: "popular",
      titleC: "treatments",
      allCta: "전체 상담 신청",
      treatments: [
        {
          category: "Regenerative Aesthetics",
          title: "Facial Balancing",
          image: "/images/treatment-facial-balancing.jpg",
        },
        {
          category: "Sculpted Silhouette",
          title: "Body Contouring",
          image: "/images/treatment-body-contouring.jpg",
        },
        {
          category: "Facial Refinement",
          title: "Rhinoplasty",
          image: "/images/treatment-rhinoplasty.jpg",
        },
        {
          category: "Skin Recovery",
          title: "Skin Booster",
          image: "/images/treatment-skin-recovery.jpg",
        },
        {
          category: "Medical Skin Care",
          title: "Recovery Program",
          image: "/images/blog-recovery.jpg",
        },
      ],
    },
    comparison: {
      eyebrow: "Comparison",
      titleA: "Natural change,",
      titleB: "shown honestly.",
      body: "시술 전후 이미지는 결과를 보장하는 장치가 아니라 상담을 돕는 참고 자료입니다. 같은 얼굴에서 어떤 지점이 달라질 수 있는지 직관적으로 비교할 수 있도록 구성했습니다.",
      stats: [
        { value: "1:1", label: "상담" },
        { value: "3-Step", label: "진단" },
        { value: "Care", label: "회복" },
        { value: "Plan", label: "개인화" },
      ],
      beforeLabel: "Before",
      afterLabel: "After",
      rangeLabel: "시술 전후 이미지 비교",
      beforeAlt: "시술 전 상담용 얼굴 예시",
      afterAlt: "시술 후 자연스럽게 정돈된 얼굴 예시",
    },
    inquiry: {
      eyebrow: "Private Inquiry",
      titleA: "고민을 먼저 듣고,",
      titleB: "가능한 범위를 설명합니다.",
      body: "간단한 정보만 남겨도 담당자가 고민의 우선순위를 정리해 상담 가능 범위와 다음 절차를 안내합니다.",
      primaryCta: "바로 상담 신청",
      secondaryCta: "안내 방식 보기",
      imageAlt: "상담 문의 배너 이미지",
    },
    doctors: {
      eyebrow: "Meet Our Team",
      titleA: "Medical",
      titleB: "board",
      titleC: "& specialists",
      intro: "정밀한 진단과 환자 중심 회복 관리를 함께 보는 의료진 구성",
      cta: "의료진 상담 신청",
      list: [
        {
          name: "Dr. Seo Jin",
          role: "대표원장 · Facial Plastic Surgery",
          image: "/images/doctor-director.jpg",
          summary: "얼굴 구조와 회복 과정을 함께 설계하는 대표 집도의",
        },
        {
          name: "Dr. Min Yoon",
          role: "Body Contouring Specialist",
          image: "/images/doctor-contour.jpg",
          summary: "체형 밸런스와 일상 복귀 계획을 함께 보는 바디 라인 전담",
        },
        {
          name: "Dr. Hana Lee",
          role: "Skin & Non-Surgical Aesthetics",
          image: "/images/doctor-skin.jpg",
          summary: "피부 장벽, 레이저, 재생 케어를 통합 관리하는 스킨 팀",
        },
      ],
    },
    reviews: {
      eyebrow: "Testimonials",
      titleA: "The BAKSAL",
      titleB: "experience",
      intro: "상담 과정에서 환자가 중요하게 보는 경험 포인트를 정리했습니다.",
      list: [
        {
          quote: "상담에서 제 얼굴이 왜 그렇게 보이는지부터 설명해줘서 결정이 쉬웠어요.",
          name: "20대 후반 · 코 상담",
        },
        {
          quote: "과하게 권하지 않고 회복 일정까지 현실적으로 잡아준 점이 가장 좋았습니다.",
          name: "30대 초반 · 리프팅 상담",
        },
        {
          quote: "시술 후 관리 루틴까지 이어져서 불안한 부분을 계속 확인할 수 있었어요.",
          name: "30대 중반 · 피부 회복 케어",
        },
      ],
    },
    guide: {
      eyebrow: "Care Guide",
      titleA: "Transparent",
      titleB: "consultation",
      titleC: "guide",
      body: "가격표형 광고 대신, 진료 후 개인별 시술 범위와 비급여 항목을 투명하게 안내하는 방식으로 구성했습니다.",
      notice:
        "개인별 상태, 검사, 마취, 회복 관리 범위에 따라 비용과 계획이 달라질 수 있으며, 최종 안내는 의료진 상담 후 제공됩니다.",
      cards: [
        {
          title: "Facial Procedures",
          image: "/images/treatment-rhinoplasty.jpg",
          items: ["눈·코·윤곽 상담", "리프팅 계획", "비수술 밸런싱"],
        },
        {
          title: "Body Procedures",
          image: "/images/treatment-body-contouring.jpg",
          items: ["바디 컨투어링", "복부·팔 라인", "회복 관리"],
        },
        {
          title: "Skin Programs",
          image: "/images/treatment-skin-recovery.jpg",
          items: ["스킨부스터", "레이저", "재생 케어"],
        },
      ],
    },
    consultation: {
      eyebrow: "Direct Consultation",
      title: "비회원도 바로 상담 신청",
      body: "로그인 없이 이름, 연락처, 관심 시술만 남기면 담당자가 확인 후 상담 절차를 안내합니다.",
      imageAlt: "비회원 상담 신청 섹션 이미지",
      fields: {
        name: "Your name *",
        phone: "Your phone *",
        interest: "Interest",
        channel: "Preferred channel",
        message: "Message",
      },
      placeholders: {
        name: "성함",
        phone: "010-0000-0000",
        service: "관심 시술 선택",
        channel: "연락 방법",
        message: "궁금한 점을 남겨주세요.",
      },
      services: ["얼굴 밸런싱", "코 상담", "바디 컨투어링", "피부 회복 케어"],
      channels: ["전화", "문자", "카카오톡"],
      submit: "상담 신청 보내기",
    },
    shop: {
      eyebrow: "Our Shop",
      titleA: "Professional",
      titleB: "skin",
      titleC: "& recovery care",
      intro: "시술 결과를 지키기 위한 전문의 큐레이션 홈케어 라인",
      products: [
        {
          name: "Recovery Barrier Cream",
          description: "시술 후 건조감과 민감도를 고려한 보습 장벽 케어",
        },
        {
          name: "Retinol Night Balm",
          description: "피부 결 관리를 위한 저자극 나이트 루틴",
        },
        {
          name: "Calming Serum Ampoule",
          description: "붉은기와 열감이 있는 피부를 위한 진정 앰플",
        },
        {
          name: "Daily Gentle Cleanser",
          description: "회복기 피부도 부담 없이 쓰는 약산성 클렌저",
        },
      ],
    },
    blog: {
      eyebrow: "Our Blog",
      titleA: "Insights",
      titleB: "in aesthetic medicine",
      posts: [
        {
          category: "Aesthetic Medicine",
          title: "비수술 얼굴 밸런싱은 어떤 경우에 적합할까",
          image: "/images/blog-consultation.jpg",
        },
        {
          category: "Skin Recovery",
          title: "레이저 시술 후 피부 결이 달라지는 과정",
          image: "/images/blog-laser.jpg",
        },
        {
          category: "Care Guide",
          title: "시술 후 회복 화장품을 고를 때 보는 기준",
          image: "/images/blog-recovery.jpg",
        },
      ],
    },
    newsletter: {
      title: "Sign up for refined beauty notes",
      body: "최신 시술 정보, 회복 관리 팁, 이벤트 소식을 필요한 순간에 받아보세요.",
      placeholder: "Email*",
      submit: "Subscribe",
      imageAlt: "뉴스레터 구독 배너",
    },
    footer: {
      officeTitle: "LUDGI Office",
      officeBody: "인천광역시 연수구 인천타워대로 323, 에이동 20층",
      officeNote: "프로젝트 문의 및 운영 지원",
      centerLabel: "Plastic Surgery Center",
      companyName: "주식회사 럿지 · LUDGI Inc.",
      partnerLabel: "Software Development Partner",
      registration: "대표이사 노상우 · 사업자등록번호 307-88-03283 · DUNS 963415644",
      address: "인천광역시 연수구 인천타워대로 323, 에이동 20층",
      contactsTitle: "Contacts",
      copyright: "© 2026 주식회사 럿지 · LUDGI Inc. All rights reserved.",
    },
  },
  en: {
    metadata: {
      title: "BAKSAL BEAUTY Plastic Surgery",
      description:
        "A premium plastic surgery website built around structural consultation, natural refinement, and recovery-centered care.",
    },
    nav: [
      { label: "About Us", href: "#about" },
      { label: "Service", href: "#services" },
      { label: "Blog", href: "#blog" },
      { label: "Inquire", href: "#consult" },
    ],
    language: {
      switchLabel: "한국어",
    },
    common: {
      brandHome: "BAKSAL BEAUTY home",
      phoneCta: "Book a consultation",
      consultCta: "Book a consultation",
      servicesCta: "View services",
      viewDetails: "View details",
      readMore: "Read more",
      profileCta: "Open profile",
      guidedAfterConsultation: "After consultation",
      inquire: "Inquire",
    },
    hero: {
      announcement: "New consultations open this month · personalized plans after diagnosis.",
      eyebrow: "Advanced Aesthetic Medicine",
      titleTop: "BAKSAL",
      titleBottom: "BEAUTY",
      line: "Refined beauty, thoughtfully designed.",
      body: "We respect the structure of the face and body before pursuing change. Consultation, treatment, and recovery care are designed around natural confidence.",
      imageAlt: "Close-up portrait surrounded by soft pink flowers",
    },
    trustSignals: [
      "ANATOMY-FIRST PLANNING",
      "PRIVATE CONSULTATION",
      "RECOVERY CARE",
      "NON-OVERPOWERING RESULTS",
    ],
    philosophy: {
      eyebrow: "Our Philosophy",
      titleA: "Aesthetic",
      titleB: "intelligence.",
      titleC: "Surgical precision.",
      body: "Before trends, we study structure. BAKSAL BEAUTY reviews facial proportion, expression, and realistic recovery rhythm to recommend the right range of change for each person.",
      imageAlt: "Editorial portrait representing consultation philosophy",
      interiorAlt: "Premium clinic consultation lounge",
      metrics: [
        { value: "Structure", label: "from diagnosis to aftercare" },
        { value: "Balance", label: "from diagnosis to aftercare" },
        { value: "Recovery", label: "from diagnosis to aftercare" },
      ],
      cta: "Meet the doctors",
    },
    services: {
      eyebrow: "Core Treatment Pillars",
      titleA: "Core",
      titleB: "treatment",
      titleC: "pillars",
      pillarCta: "Continue to consultation",
      pillars: [
        {
          id: "facial",
          label: "Facial Refinement",
          eyebrow: "Face",
          title: "Design that reads facial structure first",
          description:
            "From eyes and nose to contour and lifting, consultation starts with full-face balance. The goal is a natural impression that lasts beyond trends.",
          image: "/images/pillar-facial.jpg",
          items: ["Eye · nose consultation", "Contour balance", "Lifting", "Skin texture"],
        },
        {
          id: "body",
          label: "Sculpted Silhouette",
          eyebrow: "Body",
          title: "Planning the silhouette from start to finish",
          description:
            "Body design is less about numbers and more about flow. Contouring, abdomen and arm lines, and recovery planning are adjusted to each lifestyle.",
          image: "/images/pillar-body.jpg",
          items: ["Body contouring", "Liposuction consult", "Abdomen · arm line", "Recovery care"],
        },
        {
          id: "skin",
          label: "Regenerative Aesthetics",
          eyebrow: "Skin",
          title: "Recovery-centered skin conditioning",
          description:
            "Laser, skin booster, and regenerative care are matched to skin barrier condition and recovery pace, with care plans before and after procedures.",
          image: "/images/pillar-regenerative.jpg",
          items: ["Skin booster", "Laser", "Pigment · scar", "Regenerative care"],
        },
      ],
    },
    popular: {
      eyebrow: "Explore",
      titleA: "Our",
      titleB: "popular",
      titleC: "treatments",
      allCta: "Request consultation",
      treatments: [
        {
          category: "Regenerative Aesthetics",
          title: "Facial Balancing",
          image: "/images/treatment-facial-balancing.jpg",
        },
        {
          category: "Sculpted Silhouette",
          title: "Body Contouring",
          image: "/images/treatment-body-contouring.jpg",
        },
        {
          category: "Facial Refinement",
          title: "Rhinoplasty",
          image: "/images/treatment-rhinoplasty.jpg",
        },
        {
          category: "Skin Recovery",
          title: "Skin Booster",
          image: "/images/treatment-skin-recovery.jpg",
        },
        {
          category: "Medical Skin Care",
          title: "Recovery Program",
          image: "/images/blog-recovery.jpg",
        },
      ],
    },
    comparison: {
      eyebrow: "Comparison",
      titleA: "Natural change,",
      titleB: "shown honestly.",
      body: "Before and after imagery is shown as consultation reference, not as a guarantee. The interactive view helps clarify which areas may change within one face.",
      stats: [
        { value: "1:1", label: "consultation" },
        { value: "3-Step", label: "diagnosis" },
        { value: "Care", label: "recovery" },
        { value: "Plan", label: "personalized" },
      ],
      beforeLabel: "Before",
      afterLabel: "After",
      rangeLabel: "Before and after image comparison",
      beforeAlt: "Before consultation facial reference",
      afterAlt: "After natural facial refinement reference",
    },
    inquiry: {
      eyebrow: "Private Inquiry",
      titleA: "We listen first,",
      titleB: "then explain the possible range.",
      body: "Leave a few details and our team will organize the priority of your concern, consultation scope, and next steps.",
      primaryCta: "Start consultation",
      secondaryCta: "View guide",
      imageAlt: "Consultation inquiry banner image",
    },
    doctors: {
      eyebrow: "Meet Our Team",
      titleA: "Medical",
      titleB: "board",
      titleC: "& specialists",
      intro: "A medical team aligned around precise diagnosis and recovery-centered care.",
      cta: "Request doctor consultation",
      list: [
        {
          name: "Dr. Seo Jin",
          role: "Director · Facial Plastic Surgery",
          image: "/images/doctor-director.jpg",
          summary: "Lead surgeon planning facial structure and recovery as one journey.",
        },
        {
          name: "Dr. Min Yoon",
          role: "Body Contouring Specialist",
          image: "/images/doctor-contour.jpg",
          summary: "Body line specialist focused on silhouette balance and return-to-life planning.",
        },
        {
          name: "Dr. Hana Lee",
          role: "Skin & Non-Surgical Aesthetics",
          image: "/images/doctor-skin.jpg",
          summary: "Skin team lead integrating barrier care, laser, and regenerative programs.",
        },
      ],
    },
    reviews: {
      eyebrow: "Testimonials",
      titleA: "The BAKSAL",
      titleB: "experience",
      intro: "Key experience points patients often value throughout consultation and care.",
      list: [
        {
          quote: "They explained why my face looked the way it did, which made the decision easier.",
          name: "Late 20s · nose consultation",
        },
        {
          quote: "I liked that the team did not over-recommend and gave me a realistic recovery plan.",
          name: "Early 30s · lifting consultation",
        },
        {
          quote: "The aftercare routine helped me keep checking the parts I felt anxious about.",
          name: "Mid 30s · skin recovery care",
        },
      ],
    },
    guide: {
      eyebrow: "Care Guide",
      titleA: "Transparent",
      titleB: "consultation",
      titleC: "guide",
      body: "Instead of advertising fixed prices, this section explains that individual scope and non-covered medical items are guided after consultation.",
      notice:
        "Cost and planning may vary by individual condition, exams, anesthesia, and recovery care scope. Final guidance is provided after medical consultation.",
      cards: [
        {
          title: "Facial Procedures",
          image: "/images/treatment-rhinoplasty.jpg",
          items: ["Eye · nose · contour consult", "Lifting plan", "Non-surgical balancing"],
        },
        {
          title: "Body Procedures",
          image: "/images/treatment-body-contouring.jpg",
          items: ["Body contouring", "Abdomen · arm line", "Recovery care"],
        },
        {
          title: "Skin Programs",
          image: "/images/treatment-skin-recovery.jpg",
          items: ["Skin booster", "Laser", "Regenerative care"],
        },
      ],
    },
    consultation: {
      eyebrow: "Direct Consultation",
      title: "Book without membership",
      body: "Leave your name, contact, and treatment interest. Our team will review and guide the consultation process.",
      imageAlt: "Direct consultation section image",
      fields: {
        name: "Your name *",
        phone: "Your phone *",
        interest: "Interest",
        channel: "Preferred channel",
        message: "Message",
      },
      placeholders: {
        name: "Name",
        phone: "010-0000-0000",
        service: "Select interest",
        channel: "Contact method",
        message: "Tell us what you would like to discuss.",
      },
      services: ["Facial balancing", "Nose consultation", "Body contouring", "Skin recovery care"],
      channels: ["Phone", "Text", "KakaoTalk"],
      submit: "Send consultation request",
    },
    shop: {
      eyebrow: "Our Shop",
      titleA: "Professional",
      titleB: "skin",
      titleC: "& recovery care",
      intro: "Physician-curated home care for maintaining post-treatment results.",
      products: [
        {
          name: "Recovery Barrier Cream",
          description: "Moisture barrier care for post-treatment dryness and sensitivity.",
        },
        {
          name: "Retinol Night Balm",
          description: "A gentle night routine for refining skin texture.",
        },
        {
          name: "Calming Serum Ampoule",
          description: "A calming ampoule for visible redness and heat.",
        },
        {
          name: "Daily Gentle Cleanser",
          description: "A mild cleanser for skin in recovery routines.",
        },
      ],
    },
    blog: {
      eyebrow: "Our Blog",
      titleA: "Insights",
      titleB: "in aesthetic medicine",
      posts: [
        {
          category: "Aesthetic Medicine",
          title: "When non-surgical facial balancing may be appropriate",
          image: "/images/blog-consultation.jpg",
        },
        {
          category: "Skin Recovery",
          title: "How skin texture changes after laser treatment",
          image: "/images/blog-laser.jpg",
        },
        {
          category: "Care Guide",
          title: "How to choose recovery skincare after treatment",
          image: "/images/blog-recovery.jpg",
        },
      ],
    },
    newsletter: {
      title: "Sign up for refined beauty notes",
      body: "Receive procedure insights, recovery care tips, and clinic updates when they matter.",
      placeholder: "Email*",
      submit: "Subscribe",
      imageAlt: "Newsletter subscription banner",
    },
    footer: {
      officeTitle: "LUDGI Office",
      officeBody: "20F, A-dong, 323 Incheon tower-daero, Yeonsu-gu, Incheon",
      officeNote: "Project inquiry and operations support",
      centerLabel: "Plastic Surgery Center",
      companyName: "LUDGI Inc.",
      partnerLabel: "Software Development Partner",
      registration: "CEO Sangwoo Noh · Business Registration 307-88-03283 · DUNS 963415644",
      address: "20F, A-dong, 323 Incheon tower-daero, Yeonsu-gu, Incheon",
      contactsTitle: "Contacts",
      copyright: "© 2026 LUDGI Inc. All rights reserved.",
    },
  },
};

export function getDictionary(locale: Locale): HomeDictionary {
  return dictionaries[locale];
}
