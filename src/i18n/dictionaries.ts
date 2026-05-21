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
      email: string;
      interest: string;
      channel: string;
      message: string;
    };
    placeholders: {
      name: string;
      phone: string;
      email: string;
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
      title: "BAKSAL BEAUTY 성형외과",
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
      switchLabel: "언어 변경",
    },
    common: {
      brandHome: "BAKSAL BEAUTY 홈",
      phoneCta: "상담 신청",
      consultCta: "상담 신청하기",
      servicesCta: "시술 보기",
      viewDetails: "자세히 보기",
      readMore: "더 읽기",
      profileCta: "프로필 보기",
      guidedAfterConsultation: "상담 후 안내",
      inquire: "문의하기",
    },
    hero: {
      announcement: "5월 신규 상담 오픈 - 개인별 진단 후 시술 계획을 안내합니다.",
      eyebrow: "Advanced Aesthetic Medicine",
      titleTop: "BAKSAL",
      titleBottom: "BEAUTY",
      line: "Refined beauty, thoughtfully designed.",
      body: "얼굴과 몸의 구조를 먼저 이해하고, 상담부터 회복 관리까지 자연스러운 자신감을 기준으로 설계합니다.",
      imageAlt: "분홍 꽃 사이의 여성 얼굴 클로즈업",
    },
    trustSignals: ["구조 중심 진단", "프라이빗 상담", "회복 케어", "과하지 않은 결과"],
    philosophy: {
      eyebrow: "Our Philosophy",
      titleA: "Aesthetic",
      titleB: "intelligence.",
      titleC: "Surgical precision.",
      body: "유행보다 먼저 보아야 할 것은 구조입니다. BAKSAL BEAUTY는 얼굴의 비율, 표정의 움직임, 회복 가능한 생활 리듬을 함께 검토해 개인에게 맞는 변화의 범위를 제안합니다.",
      imageAlt: "성형외과 상담 철학을 표현한 여성 포트레이트",
      interiorAlt: "프리미엄 클리닉 상담 라운지",
      metrics: [
        { value: "Structure", label: "진단에서 사후관리까지" },
        { value: "Balance", label: "비율과 표정의 조화" },
        { value: "Recovery", label: "일상 복귀를 고려한 계획" },
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
          items: ["눈·코 상담", "윤곽 밸런스", "리프팅", "피부결 개선"],
        },
        {
          id: "body",
          label: "Sculpted Silhouette",
          eyebrow: "Body",
          title: "라인의 시작과 끝을 함께 설계",
          description:
            "체형은 숫자보다 흐름이 중요합니다. 지방흡입, 복부·팔 라인, 회복 계획을 개인별 생활 패턴에 맞춰 조정합니다.",
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
        { category: "Regenerative Aesthetics", title: "페이셜 밸런싱", image: "/images/treatment-facial-balancing.jpg" },
        { category: "Sculpted Silhouette", title: "바디 컨투어링", image: "/images/treatment-body-contouring.jpg" },
        { category: "Facial Refinement", title: "코 라인 상담", image: "/images/treatment-rhinoplasty.jpg" },
        { category: "Skin Recovery", title: "스킨부스터", image: "/images/treatment-skin-recovery.jpg" },
        { category: "Medical Skin Care", title: "회복 프로그램", image: "/images/blog-recovery.jpg" },
      ],
    },
    comparison: {
      eyebrow: "Comparison",
      titleA: "Natural change,",
      titleB: "shown honestly.",
      body: "전후 이미지는 결과 보장을 위한 약속이 아니라 상담에서 확인하는 참고 자료입니다. 한 얼굴 안에서 어느 지점이 달라질 수 있는지 직관적으로 비교할 수 있도록 구성했습니다.",
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
      body: "간단한 정보만 남기면 담당자가 고민의 우선순위를 정리해 상담 가능 범위와 다음 절차를 안내합니다.",
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
          summary: "피부 장벽, 레이저, 재생 케어를 통합 관리하는 스킨 팀 리드",
        },
      ],
    },
    reviews: {
      eyebrow: "Testimonials",
      titleA: "The BAKSAL",
      titleB: "experience",
      intro: "상담 과정에서 고객이 중요하게 보는 경험 포인트를 정리했습니다.",
      list: [
        { quote: "상담에서 제 얼굴이 왜 그렇게 보이는지부터 설명해줘서 결정이 쉬웠어요.", name: "20대 후반 · 코 상담" },
        { quote: "과하게 권하지 않고 회복 일정까지 현실적으로 잡아준 점이 가장 좋았습니다.", name: "30대 초반 · 리프팅 상담" },
        { quote: "시술 후 관리 루틴까지 이어져서 불안한 부분을 계속 확인할 수 있었어요.", name: "30대 중반 · 피부 회복 케어" },
      ],
    },
    guide: {
      eyebrow: "Care Guide",
      titleA: "Transparent",
      titleB: "consultation",
      titleC: "guide",
      body: "가격표를 전면에 내세우는 대신, 개인별 시술 범위와 비급여 항목을 투명하게 상담 후 안내하는 방식으로 구성했습니다.",
      notice:
        "개인별 상태, 검사, 마취, 회복 관리 범위에 따라 비용과 계획이 달라질 수 있으며 최종 안내는 의료진 상담 후 제공합니다.",
      cards: [
        { title: "Facial Procedures", image: "/images/treatment-rhinoplasty.jpg", items: ["눈·코·윤곽 상담", "리프팅 계획", "비수술 밸런싱"] },
        { title: "Body Procedures", image: "/images/treatment-body-contouring.jpg", items: ["바디 컨투어링", "복부·팔 라인", "회복 관리"] },
        { title: "Skin Programs", image: "/images/treatment-skin-recovery.jpg", items: ["스킨부스터", "레이저", "재생 케어"] },
      ],
    },
    consultation: {
      eyebrow: "Direct Consultation",
      title: "비회원도 바로 상담 신청",
      body: "로그인 없이 이름, 연락처, 관심 시술만 남기면 담당자가 확인 후 상담 절차를 안내합니다.",
      imageAlt: "비회원 상담 신청 섹션 이미지",
      fields: {
        name: "이름 *",
        phone: "연락처 *",
        email: "이메일 *",
        interest: "관심 시술",
        channel: "희망 연락 방식",
        message: "상담 내용",
      },
      placeholders: {
        name: "성함",
        phone: "010-0000-0000",
        email: "reply@example.com",
        service: "관심 시술 선택",
        channel: "연락 방식",
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
      intro: "시술 결과를 지키기 위한 전문가 큐레이션 홈케어 라인",
      products: [
        { name: "Recovery Barrier Cream", description: "시술 후 건조감과 민감도를 고려한 보습 장벽 케어" },
        { name: "Retinol Night Balm", description: "피부결 관리를 위한 저자극 나이트 루틴" },
        { name: "Calming Serum Ampoule", description: "붉은기와 열감을 느끼는 피부를 위한 진정 앰플" },
        { name: "Daily Gentle Cleanser", description: "회복기 피부에 부담 없이 맞는 약산성 클렌저" },
      ],
    },
    blog: {
      eyebrow: "Our Blog",
      titleA: "Insights",
      titleB: "in aesthetic medicine",
      posts: [
        { category: "Aesthetic Medicine", title: "비수술 얼굴 밸런싱은 어떤 경우에 적합할까", image: "/images/blog-consultation.jpg" },
        { category: "Skin Recovery", title: "레이저 시술 후 피부 결이 달라지는 과정", image: "/images/blog-laser.jpg" },
        { category: "Care Guide", title: "시술 후 회복 화장품을 고를 때 보는 기준", image: "/images/blog-recovery.jpg" },
      ],
    },
    newsletter: {
      title: "Sign up for refined beauty notes",
      body: "최신 시술 정보, 회복 관리 팁, 이벤트 소식을 필요한 시점에 받아보세요.",
      placeholder: "Email*",
      submit: "구독하기",
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
      switchLabel: "Switch language",
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
      announcement: "New consultations open this month - personalized plans after diagnosis.",
      eyebrow: "Advanced Aesthetic Medicine",
      titleTop: "BAKSAL",
      titleBottom: "BEAUTY",
      line: "Refined beauty, thoughtfully designed.",
      body: "We understand the structure of the face and body before pursuing change. Consultation, treatment, and recovery care are designed around natural confidence.",
      imageAlt: "Close-up portrait surrounded by soft pink flowers",
    },
    trustSignals: ["ANATOMY-FIRST PLANNING", "PRIVATE CONSULTATION", "RECOVERY CARE", "NON-OVERPOWERING RESULTS"],
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
        { value: "Balance", label: "proportion and expression" },
        { value: "Recovery", label: "planned around daily life" },
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
          items: ["Eye and nose consult", "Contour balance", "Lifting", "Skin texture"],
        },
        {
          id: "body",
          label: "Sculpted Silhouette",
          eyebrow: "Body",
          title: "Planning the silhouette from start to finish",
          description:
            "Body design is less about numbers and more about flow. Contouring, abdomen and arm lines, and recovery planning are adjusted to each lifestyle.",
          image: "/images/pillar-body.jpg",
          items: ["Body contouring", "Liposuction consult", "Abdomen and arm line", "Recovery care"],
        },
        {
          id: "skin",
          label: "Regenerative Aesthetics",
          eyebrow: "Skin",
          title: "Recovery-centered skin conditioning",
          description:
            "Laser, skin booster, and regenerative care are matched to skin barrier condition and recovery pace, with care plans before and after procedures.",
          image: "/images/pillar-regenerative.jpg",
          items: ["Skin booster", "Laser", "Pigment and scar", "Regenerative care"],
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
        { category: "Regenerative Aesthetics", title: "Facial Balancing", image: "/images/treatment-facial-balancing.jpg" },
        { category: "Sculpted Silhouette", title: "Body Contouring", image: "/images/treatment-body-contouring.jpg" },
        { category: "Facial Refinement", title: "Rhinoplasty", image: "/images/treatment-rhinoplasty.jpg" },
        { category: "Skin Recovery", title: "Skin Booster", image: "/images/treatment-skin-recovery.jpg" },
        { category: "Medical Skin Care", title: "Recovery Program", image: "/images/blog-recovery.jpg" },
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
        { name: "Dr. Seo Jin", role: "Director · Facial Plastic Surgery", image: "/images/doctor-director.jpg", summary: "Lead surgeon planning facial structure and recovery as one journey." },
        { name: "Dr. Min Yoon", role: "Body Contouring Specialist", image: "/images/doctor-contour.jpg", summary: "Body line specialist focused on silhouette balance and return-to-life planning." },
        { name: "Dr. Hana Lee", role: "Skin & Non-Surgical Aesthetics", image: "/images/doctor-skin.jpg", summary: "Skin team lead integrating barrier care, laser, and regenerative programs." },
      ],
    },
    reviews: {
      eyebrow: "Testimonials",
      titleA: "The BAKSAL",
      titleB: "experience",
      intro: "Key experience points patients often value throughout consultation and care.",
      list: [
        { quote: "They explained why my face looked the way it did, which made the decision easier.", name: "Late 20s · nose consultation" },
        { quote: "I liked that the team did not over-recommend and gave me a realistic recovery plan.", name: "Early 30s · lifting consultation" },
        { quote: "The aftercare routine helped me keep checking the parts I felt anxious about.", name: "Mid 30s · skin recovery care" },
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
        { title: "Facial Procedures", image: "/images/treatment-rhinoplasty.jpg", items: ["Eye, nose and contour consult", "Lifting plan", "Non-surgical balancing"] },
        { title: "Body Procedures", image: "/images/treatment-body-contouring.jpg", items: ["Body contouring", "Abdomen and arm line", "Recovery care"] },
        { title: "Skin Programs", image: "/images/treatment-skin-recovery.jpg", items: ["Skin booster", "Laser", "Regenerative care"] },
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
        email: "Email *",
        interest: "Interest",
        channel: "Preferred channel",
        message: "Message",
      },
      placeholders: {
        name: "Name",
        phone: "010-0000-0000",
        email: "reply@example.com",
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
        { name: "Recovery Barrier Cream", description: "Moisture barrier care for post-treatment dryness and sensitivity." },
        { name: "Retinol Night Balm", description: "A gentle night routine for refining skin texture." },
        { name: "Calming Serum Ampoule", description: "A calming ampoule for visible redness and heat." },
        { name: "Daily Gentle Cleanser", description: "A mild cleanser for skin in recovery routines." },
      ],
    },
    blog: {
      eyebrow: "Our Blog",
      titleA: "Insights",
      titleB: "in aesthetic medicine",
      posts: [
        { category: "Aesthetic Medicine", title: "When non-surgical facial balancing may be appropriate", image: "/images/blog-consultation.jpg" },
        { category: "Skin Recovery", title: "How skin texture changes after laser treatment", image: "/images/blog-laser.jpg" },
        { category: "Care Guide", title: "How to choose recovery skincare after treatment", image: "/images/blog-recovery.jpg" },
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
  zh: {
    metadata: {
      title: "BAKSAL BEAUTY 整形外科",
      description: "以结构化咨询、自然精致变化和恢复管理为核心的高端整形外科网站。",
    },
    nav: [
      { label: "关于我们", href: "#about" },
      { label: "服务项目", href: "#services" },
      { label: "博客", href: "#blog" },
      { label: "咨询", href: "#consult" },
    ],
    language: {
      switchLabel: "切换语言",
    },
    common: {
      brandHome: "BAKSAL BEAUTY 首页",
      phoneCta: "预约咨询",
      consultCta: "预约咨询",
      servicesCta: "查看项目",
      viewDetails: "查看详情",
      readMore: "阅读更多",
      profileCta: "查看简介",
      guidedAfterConsultation: "咨询后说明",
      inquire: "咨询",
    },
    hero: {
      announcement: "本月开放新咨询 - 医师诊断后提供个人化方案。",
      eyebrow: "Advanced Aesthetic Medicine",
      titleTop: "BAKSAL",
      titleBottom: "BEAUTY",
      line: "Refined beauty, thoughtfully designed.",
      body: "我们先理解面部与身体结构，再设计改变。从咨询、治疗到恢复管理，都以自然自信为核心。",
      imageAlt: "粉色花朵环绕的女性面部特写",
    },
    trustSignals: ["结构优先规划", "私密咨询", "恢复管理", "避免过度改变"],
    philosophy: {
      eyebrow: "Our Philosophy",
      titleA: "Aesthetic",
      titleB: "intelligence.",
      titleC: "Surgical precision.",
      body: "在追随流行之前，更重要的是理解结构。BAKSAL BEAUTY会综合面部比例、表情动态和现实恢复节奏，为每位顾客建议合适的变化范围。",
      imageAlt: "呈现整形咨询理念的女性肖像",
      interiorAlt: "高端诊所咨询休息区",
      metrics: [
        { value: "Structure", label: "从诊断到术后管理" },
        { value: "Balance", label: "比例与表情的协调" },
        { value: "Recovery", label: "考虑日常恢复节奏" },
      ],
      cta: "查看医师团队",
    },
    services: {
      eyebrow: "Core Treatment Pillars",
      titleA: "Core",
      titleB: "treatment",
      titleC: "pillars",
      pillarCta: "继续咨询",
      pillars: [
        {
          id: "facial",
          label: "Facial Refinement",
          eyebrow: "Face",
          title: "先读懂面部结构的设计",
          description: "从眼、鼻到轮廓与提升，咨询以整体面部平衡为基准。目标不是夸张改变，而是更持久自然的印象。",
          image: "/images/pillar-facial.jpg",
          items: ["眼鼻咨询", "轮廓平衡", "提升", "肤质改善"],
        },
        {
          id: "body",
          label: "Sculpted Silhouette",
          eyebrow: "Body",
          title: "从起点到恢复一起规划线条",
          description: "身体设计不只看数字，更看整体流动感。身体塑形、腹部与手臂线条以及恢复计划都会结合个人生活节奏调整。",
          image: "/images/pillar-body.jpg",
          items: ["身体塑形", "吸脂咨询", "腹部与手臂线条", "恢复管理"],
        },
        {
          id: "skin",
          label: "Regenerative Aesthetics",
          eyebrow: "Skin",
          title: "以恢复为核心管理皮肤状态",
          description: "激光、皮肤水光和再生护理会根据皮肤屏障与恢复速度匹配，并连接治疗前后的护理计划。",
          image: "/images/pillar-regenerative.jpg",
          items: ["皮肤水光", "激光", "色素与疤痕", "再生护理"],
        },
      ],
    },
    popular: {
      eyebrow: "Explore",
      titleA: "Our",
      titleB: "popular",
      titleC: "treatments",
      allCta: "申请完整咨询",
      treatments: [
        { category: "Regenerative Aesthetics", title: "面部平衡", image: "/images/treatment-facial-balancing.jpg" },
        { category: "Sculpted Silhouette", title: "身体塑形", image: "/images/treatment-body-contouring.jpg" },
        { category: "Facial Refinement", title: "鼻部线条咨询", image: "/images/treatment-rhinoplasty.jpg" },
        { category: "Skin Recovery", title: "皮肤水光", image: "/images/treatment-skin-recovery.jpg" },
        { category: "Medical Skin Care", title: "恢复护理项目", image: "/images/blog-recovery.jpg" },
      ],
    },
    comparison: {
      eyebrow: "Comparison",
      titleA: "Natural change,",
      titleB: "shown honestly.",
      body: "前后对比图仅作为咨询参考，并非结果保证。互动视图帮助直观了解同一张脸上可能发生变化的部位。",
      stats: [
        { value: "1:1", label: "咨询" },
        { value: "3-Step", label: "诊断" },
        { value: "Care", label: "恢复" },
        { value: "Plan", label: "个人化" },
      ],
      beforeLabel: "Before",
      afterLabel: "After",
      rangeLabel: "治疗前后图片对比",
      beforeAlt: "咨询参考用治疗前面部示例",
      afterAlt: "自然精致变化后的面部示例",
    },
    inquiry: {
      eyebrow: "Private Inquiry",
      titleA: "先倾听你的顾虑，",
      titleB: "再说明可行范围。",
      body: "留下简单信息后，团队会整理你的主要关注点，并说明可咨询范围和下一步流程。",
      primaryCta: "开始咨询",
      secondaryCta: "查看说明",
      imageAlt: "咨询申请横幅图片",
    },
    doctors: {
      eyebrow: "Meet Our Team",
      titleA: "Medical",
      titleB: "board",
      titleC: "& specialists",
      intro: "围绕精密诊断与恢复管理协作的医疗团队",
      cta: "预约医师咨询",
      list: [
        { name: "Dr. Seo Jin", role: "院长 · 面部整形", image: "/images/doctor-director.jpg", summary: "将面部结构与恢复过程作为整体旅程规划的主刀医师。" },
        { name: "Dr. Min Yoon", role: "身体塑形专家", image: "/images/doctor-contour.jpg", summary: "关注身体线条平衡与日常恢复计划的塑形专科医师。" },
        { name: "Dr. Hana Lee", role: "皮肤与非手术美学", image: "/images/doctor-skin.jpg", summary: "整合皮肤屏障、激光与再生项目的皮肤团队负责人。" },
      ],
    },
    reviews: {
      eyebrow: "Testimonials",
      titleA: "The BAKSAL",
      titleB: "experience",
      intro: "整理顾客在咨询与护理过程中重视的体验要点。",
      list: [
        { quote: "咨询时先说明我的脸为什么会呈现这样的印象，决定起来更安心。", name: "20多岁后半 · 鼻部咨询" },
        { quote: "没有过度推荐，也把恢复时间安排得很现实，这点让我最满意。", name: "30多岁初 · 提升咨询" },
        { quote: "术后护理流程很清楚，让我能持续确认自己担心的部分。", name: "30多岁中 · 皮肤恢复护理" },
      ],
    },
    guide: {
      eyebrow: "Care Guide",
      titleA: "Transparent",
      titleB: "consultation",
      titleC: "guide",
      body: "这里不以固定价格做宣传，而是说明个人治疗范围与非保险项目会在咨询后透明说明。",
      notice: "费用与计划可能根据个人状态、检查、麻醉和恢复管理范围不同而变化，最终说明会在医师咨询后提供。",
      cards: [
        { title: "Facial Procedures", image: "/images/treatment-rhinoplasty.jpg", items: ["眼鼻轮廓咨询", "提升计划", "非手术平衡"] },
        { title: "Body Procedures", image: "/images/treatment-body-contouring.jpg", items: ["身体塑形", "腹部与手臂线条", "恢复管理"] },
        { title: "Skin Programs", image: "/images/treatment-skin-recovery.jpg", items: ["皮肤水光", "激光", "再生护理"] },
      ],
    },
    consultation: {
      eyebrow: "Direct Consultation",
      title: "无需会员也可直接申请咨询",
      body: "无需登录，只需留下姓名、联系方式和关注项目，团队确认后会说明咨询流程。",
      imageAlt: "直接咨询申请区块图片",
      fields: {
        name: "姓名 *",
        phone: "联系电话 *",
        email: "电子邮箱 *",
        interest: "关注项目",
        channel: "希望联系渠道",
        message: "咨询内容",
      },
      placeholders: {
        name: "姓名",
        phone: "010-0000-0000",
        email: "reply@example.com",
        service: "选择关注项目",
        channel: "联系方式",
        message: "请留下想咨询的问题。",
      },
      services: ["面部平衡", "鼻部咨询", "身体塑形", "皮肤恢复护理"],
      channels: ["电话", "短信", "KakaoTalk"],
      submit: "发送咨询申请",
    },
    shop: {
      eyebrow: "Our Shop",
      titleA: "Professional",
      titleB: "skin",
      titleC: "& recovery care",
      intro: "由专业团队精选的居家护理，帮助维持治疗后的皮肤状态。",
      products: [
        { name: "Recovery Barrier Cream", description: "针对治疗后干燥与敏感的保湿屏障护理。" },
        { name: "Retinol Night Balm", description: "用于改善肤质的温和夜间护理。" },
        { name: "Calming Serum Ampoule", description: "适合泛红和热感皮肤的舒缓精华。" },
        { name: "Daily Gentle Cleanser", description: "适合恢复期皮肤的温和洁面产品。" },
      ],
    },
    blog: {
      eyebrow: "Our Blog",
      titleA: "Insights",
      titleB: "in aesthetic medicine",
      posts: [
        { category: "Aesthetic Medicine", title: "什么情况下适合非手术面部平衡", image: "/images/blog-consultation.jpg" },
        { category: "Skin Recovery", title: "激光治疗后肤质变化的过程", image: "/images/blog-laser.jpg" },
        { category: "Care Guide", title: "治疗后恢复护肤品该如何选择", image: "/images/blog-recovery.jpg" },
      ],
    },
    newsletter: {
      title: "订阅精致美学资讯",
      body: "在合适的时机接收治疗知识、恢复护理提示和诊所消息。",
      placeholder: "Email*",
      submit: "订阅",
      imageAlt: "订阅资讯横幅",
    },
    footer: {
      officeTitle: "LUDGI Office",
      officeBody: "韩国仁川广域市延寿区仁川塔大路323号 A栋20层",
      officeNote: "项目咨询与运营支持",
      centerLabel: "Plastic Surgery Center",
      companyName: "LUDGI Inc.",
      partnerLabel: "Software Development Partner",
      registration: "CEO Sangwoo Noh · Business Registration 307-88-03283 · DUNS 963415644",
      address: "韩国仁川广域市延寿区仁川塔大路323号 A栋20层",
      contactsTitle: "Contacts",
      copyright: "© 2026 LUDGI Inc. All rights reserved.",
    },
  },
  ja: {
    metadata: {
      title: "BAKSAL BEAUTY 美容外科",
      description: "構造的なカウンセリング、自然な変化、回復中心のケアを軸にしたプレミアム美容外科サイトです。",
    },
    nav: [
      { label: "About Us", href: "#about" },
      { label: "Service", href: "#services" },
      { label: "Blog", href: "#blog" },
      { label: "Inquire", href: "#consult" },
    ],
    language: {
      switchLabel: "言語を切り替える",
    },
    common: {
      brandHome: "BAKSAL BEAUTY ホーム",
      phoneCta: "相談予約",
      consultCta: "相談を予約する",
      servicesCta: "施術を見る",
      viewDetails: "詳細を見る",
      readMore: "続きを読む",
      profileCta: "プロフィールを見る",
      guidedAfterConsultation: "相談後に案内",
      inquire: "問い合わせ",
    },
    hero: {
      announcement: "今月の新規相談受付中 - 診断後に個別プランをご案内します。",
      eyebrow: "Advanced Aesthetic Medicine",
      titleTop: "BAKSAL",
      titleBottom: "BEAUTY",
      line: "Refined beauty, thoughtfully designed.",
      body: "顔と身体の構造を先に理解し、相談から回復ケアまで自然な自信を基準に設計します。",
      imageAlt: "淡いピンクの花に囲まれた女性の顔のクローズアップ",
    },
    trustSignals: ["構造から考える診断", "プライベート相談", "回復ケア", "やりすぎない変化"],
    philosophy: {
      eyebrow: "Our Philosophy",
      titleA: "Aesthetic",
      titleB: "intelligence.",
      titleC: "Surgical precision.",
      body: "流行より先に見るべきものは構造です。BAKSAL BEAUTYは顔の比率、表情の動き、現実的な回復リズムを総合的に確認し、一人ひとりに合う変化の範囲を提案します。",
      imageAlt: "美容外科の相談理念を表す女性ポートレート",
      interiorAlt: "プレミアムクリニックの相談ラウンジ",
      metrics: [
        { value: "Structure", label: "診断からアフターケアまで" },
        { value: "Balance", label: "比率と表情の調和" },
        { value: "Recovery", label: "日常復帰を考えた計画" },
      ],
      cta: "医師を見る",
    },
    services: {
      eyebrow: "Core Treatment Pillars",
      titleA: "Core",
      titleB: "treatment",
      titleC: "pillars",
      pillarCta: "相談へ進む",
      pillars: [
        {
          id: "facial",
          label: "Facial Refinement",
          eyebrow: "Face",
          title: "顔の構造を先に読むデザイン",
          description: "目、鼻、輪郭、リフトまで、一部位だけでなく顔全体のバランスを基準に相談します。大きな変化より、長くなじむ自然な印象を目指します。",
          image: "/images/pillar-facial.jpg",
          items: ["目・鼻の相談", "輪郭バランス", "リフト", "肌質改善"],
        },
        {
          id: "body",
          label: "Sculpted Silhouette",
          eyebrow: "Body",
          title: "ラインの始まりと終わりを一緒に設計",
          description: "ボディデザインは数字より流れが大切です。ボディ輪郭、腹部と腕のライン、回復計画を生活リズムに合わせて調整します。",
          image: "/images/pillar-body.jpg",
          items: ["ボディ輪郭", "脂肪吸引相談", "腹部・腕ライン", "回復管理"],
        },
        {
          id: "skin",
          label: "Regenerative Aesthetics",
          eyebrow: "Skin",
          title: "回復中心に肌コンディションを整える",
          description: "レーザー、スキンブースター、再生ケアを肌バリアと回復スピードに合わせ、施術前後のケアまでつなげます。",
          image: "/images/pillar-regenerative.jpg",
          items: ["スキンブースター", "レーザー", "色素・瘢痕", "再生ケア"],
        },
      ],
    },
    popular: {
      eyebrow: "Explore",
      titleA: "Our",
      titleB: "popular",
      titleC: "treatments",
      allCta: "相談を申し込む",
      treatments: [
        { category: "Regenerative Aesthetics", title: "フェイシャルバランス", image: "/images/treatment-facial-balancing.jpg" },
        { category: "Sculpted Silhouette", title: "ボディ輪郭", image: "/images/treatment-body-contouring.jpg" },
        { category: "Facial Refinement", title: "鼻ライン相談", image: "/images/treatment-rhinoplasty.jpg" },
        { category: "Skin Recovery", title: "スキンブースター", image: "/images/treatment-skin-recovery.jpg" },
        { category: "Medical Skin Care", title: "回復プログラム", image: "/images/blog-recovery.jpg" },
      ],
    },
    comparison: {
      eyebrow: "Comparison",
      titleA: "Natural change,",
      titleB: "shown honestly.",
      body: "ビフォーアフター画像は結果を保証するものではなく、相談時の参考資料です。同じ顔の中でどの部分が変化し得るかを直感的に比較できます。",
      stats: [
        { value: "1:1", label: "相談" },
        { value: "3-Step", label: "診断" },
        { value: "Care", label: "回復" },
        { value: "Plan", label: "個別化" },
      ],
      beforeLabel: "Before",
      afterLabel: "After",
      rangeLabel: "施術前後画像の比較",
      beforeAlt: "施術前相談用の顔イメージ",
      afterAlt: "自然に整った施術後の顔イメージ",
    },
    inquiry: {
      eyebrow: "Private Inquiry",
      titleA: "悩みを先に聞き、",
      titleB: "可能な範囲を説明します。",
      body: "簡単な情報を残していただくと、担当者が悩みの優先順位を整理し、相談可能な範囲と次の手順をご案内します。",
      primaryCta: "相談を始める",
      secondaryCta: "案内を見る",
      imageAlt: "相談問い合わせバナー画像",
    },
    doctors: {
      eyebrow: "Meet Our Team",
      titleA: "Medical",
      titleB: "board",
      titleC: "& specialists",
      intro: "精密な診断と患者中心の回復ケアを共に考える医療チーム",
      cta: "医師相談を予約",
      list: [
        { name: "Dr. Seo Jin", role: "院長 · 顔面美容外科", image: "/images/doctor-director.jpg", summary: "顔の構造と回復過程をひとつの流れとして設計する執刀医。" },
        { name: "Dr. Min Yoon", role: "ボディ輪郭専門医", image: "/images/doctor-contour.jpg", summary: "シルエットのバランスと日常復帰計画を重視するボディライン担当。" },
        { name: "Dr. Hana Lee", role: "皮膚・非手術美容", image: "/images/doctor-skin.jpg", summary: "肌バリア、レーザー、再生プログラムを統合管理するスキンチームリード。" },
      ],
    },
    reviews: {
      eyebrow: "Testimonials",
      titleA: "The BAKSAL",
      titleB: "experience",
      intro: "相談とケアの中で重視される体験ポイントをまとめました。",
      list: [
        { quote: "自分の顔がなぜそう見えるのかから説明してくれて、決めやすかったです。", name: "20代後半 · 鼻相談" },
        { quote: "無理に勧めず、回復スケジュールまで現実的に見てくれた点が良かったです。", name: "30代前半 · リフト相談" },
        { quote: "施術後のケアルーティンまで続いたので、不安な部分を確認しながら過ごせました。", name: "30代半ば · 肌回復ケア" },
      ],
    },
    guide: {
      eyebrow: "Care Guide",
      titleA: "Transparent",
      titleB: "consultation",
      titleC: "guide",
      body: "固定価格を前面に出すのではなく、個別の施術範囲と自費診療項目を相談後に透明に案内する構成です。",
      notice: "費用と計画は個人の状態、検査、麻酔、回復管理の範囲によって変わる場合があり、最終案内は医師相談後に提供されます。",
      cards: [
        { title: "Facial Procedures", image: "/images/treatment-rhinoplasty.jpg", items: ["目・鼻・輪郭相談", "リフト計画", "非手術バランス"] },
        { title: "Body Procedures", image: "/images/treatment-body-contouring.jpg", items: ["ボディ輪郭", "腹部・腕ライン", "回復管理"] },
        { title: "Skin Programs", image: "/images/treatment-skin-recovery.jpg", items: ["スキンブースター", "レーザー", "再生ケア"] },
      ],
    },
    consultation: {
      eyebrow: "Direct Consultation",
      title: "会員登録なしですぐ相談申請",
      body: "ログインなしで名前、連絡先、関心のある施術を残すだけで、担当者が確認後に相談手順をご案内します。",
      imageAlt: "直接相談申請セクション画像",
      fields: {
        name: "お名前 *",
        phone: "連絡先 *",
        email: "メール *",
        interest: "関心のある施術",
        channel: "希望連絡方法",
        message: "相談内容",
      },
      placeholders: {
        name: "お名前",
        phone: "010-0000-0000",
        email: "reply@example.com",
        service: "施術を選択",
        channel: "連絡方法",
        message: "相談したい内容を入力してください。",
      },
      services: ["顔のバランス", "鼻相談", "ボディ輪郭", "肌回復ケア"],
      channels: ["電話", "SMS", "KakaoTalk"],
      submit: "相談申請を送信",
    },
    shop: {
      eyebrow: "Our Shop",
      titleA: "Professional",
      titleB: "skin",
      titleC: "& recovery care",
      intro: "施術後の状態を守るための専門家キュレーションホームケア",
      products: [
        { name: "Recovery Barrier Cream", description: "施術後の乾燥感と敏感さを考慮した保湿バリアケア。" },
        { name: "Retinol Night Balm", description: "肌質を整えるための低刺激ナイトルーティン。" },
        { name: "Calming Serum Ampoule", description: "赤みや熱感が気になる肌のための鎮静アンプル。" },
        { name: "Daily Gentle Cleanser", description: "回復期の肌に負担をかけにくいマイルドクレンザー。" },
      ],
    },
    blog: {
      eyebrow: "Our Blog",
      titleA: "Insights",
      titleB: "in aesthetic medicine",
      posts: [
        { category: "Aesthetic Medicine", title: "非手術の顔バランスはどんな場合に向いているか", image: "/images/blog-consultation.jpg" },
        { category: "Skin Recovery", title: "レーザー施術後に肌質が変わるプロセス", image: "/images/blog-laser.jpg" },
        { category: "Care Guide", title: "施術後の回復コスメを選ぶ基準", image: "/images/blog-recovery.jpg" },
      ],
    },
    newsletter: {
      title: "洗練された美容ノートを購読",
      body: "最新の施術情報、回復ケアのヒント、クリニックのお知らせを必要なタイミングで受け取れます。",
      placeholder: "Email*",
      submit: "購読する",
      imageAlt: "ニュースレター購読バナー",
    },
    footer: {
      officeTitle: "LUDGI Office",
      officeBody: "韓国 仁川広域市 延寿区 仁川タワー大路323 A棟20階",
      officeNote: "プロジェクト問い合わせと運営サポート",
      centerLabel: "Plastic Surgery Center",
      companyName: "LUDGI Inc.",
      partnerLabel: "Software Development Partner",
      registration: "CEO Sangwoo Noh · Business Registration 307-88-03283 · DUNS 963415644",
      address: "韓国 仁川広域市 延寿区 仁川タワー大路323 A棟20階",
      contactsTitle: "Contacts",
      copyright: "© 2026 LUDGI Inc. All rights reserved.",
    },
  },
};

export function getDictionary(locale: Locale): HomeDictionary {
  return dictionaries[locale];
}
