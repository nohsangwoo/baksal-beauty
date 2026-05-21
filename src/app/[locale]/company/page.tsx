import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  Hospital,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  absoluteUrl,
  companySeoKeywords,
  keywordsFor,
  localeHreflangs,
  localizedAbsoluteUrl,
  pageAlternates,
  pageOpenGraph,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type CompanyCopy = {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  proofEyebrow: string;
  proofTitle: string;
  proofBody: string;
  medicalEyebrow: string;
  medicalTitle: string;
  medicalBody: string;
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  processEyebrow: string;
  processTitle: string;
  seoEyebrow: string;
  seoTitle: string;
  seoBody: string;
  factsEyebrow: string;
  factsTitle: string;
  faqEyebrow: string;
  faqTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  extraKeywords: string[];
};

const companyCopies: Record<Locale, CompanyCopy> = {
  ko: {
    metaTitle: "주식회사 럿지 | 병원 홈페이지 제작 · 성형외과 홈페이지 제작",
    metaDescription:
      "주식회사 럿지(LUDGI Inc.)는 병원 홈페이지, 성형외과 홈페이지, 의료기관 SEO, 상담 전환형 웹사이트 제작을 수행하는 소프트웨어 개발 파트너입니다.",
    heroEyebrow: "LUDGI Inc. — Medical Website Production Partner",
    heroTitle: "병원 홈페이지 제작을 설계부터 운영까지 맡기는 개발 파트너",
    heroDescription:
      "주식회사 럿지는 성형외과 홈페이지 제작, 병원 홈페이지 제작, 문의 전환형 UX, 다국어 SEO, 관리자 CMS, 예약·상담 플로우를 한 번에 설계하는 소프트웨어 개발 전문 기업입니다.",
    primaryCta: "제작 문의하기",
    secondaryCta: "공식 회사 정보",
    proofEyebrow: "Why LUDGI",
    proofTitle: "검색 노출과 상담 전환을 함께 설계합니다.",
    proofBody:
      "병원 홈페이지는 예쁜 화면만으로 끝나지 않습니다. 시술 콘텐츠 구조, 의료법을 고려한 문장, 빠른 페이지 경험, 문의 동선, 관리자 운영성이 함께 맞물려야 실제 의뢰로 이어집니다.",
    medicalEyebrow: "Hospital Web Strategy",
    medicalTitle: "성형외과 홈페이지에 필요한 구조를 제품처럼 만듭니다.",
    medicalBody:
      "눈성형, 코성형, 리프팅, 쁘띠, 피부관리처럼 서비스별 검색 의도를 분리하고, 상세페이지·블로그·문의폼·관리자 기능을 하나의 성장 구조로 연결합니다.",
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "의료 홈페이지 제작에 바로 필요한 역량",
    processEyebrow: "Build Process",
    processTitle: "기획, 제작, SEO, 운영까지 한 흐름으로",
    seoEyebrow: "Search Exposure",
    seoTitle: "럿지, 병원 홈페이지 제작, 성형외과 홈페이지 제작 키워드까지 정교하게 반영",
    seoBody:
      "이 페이지는 주식회사 럿지의 신뢰 정보와 병원 홈페이지 제작 의뢰 검색 의도를 함께 담습니다. sitemap, robots, 구조화 데이터, 내부 링크, 다국어 canonical을 함께 구성해 검색엔진이 페이지의 목적을 명확히 이해하도록 했습니다.",
    factsEyebrow: "Company Facts",
    factsTitle: "주식회사 럿지 기본 정보",
    faqEyebrow: "FAQ",
    faqTitle: "홈페이지 제작 의뢰 전 자주 묻는 질문",
    ctaEyebrow: "Project Inquiry",
    ctaTitle: "병원 홈페이지 제작, 성형외과 홈페이지 제작을 상담해보세요.",
    ctaBody:
      "새로운 병원 사이트, 기존 사이트 리뉴얼, 관리자 CMS, 블로그 SEO, 상담 신청 플로우까지 범위를 나눠 현실적인 제작 계획을 안내합니다.",
    extraKeywords: ["의료 홈페이지 제작", "병원 SEO", "성형외과 SEO", "병원 홈페이지 외주"],
  },
  en: {
    metaTitle: "LUDGI Inc. | Hospital and Plastic Surgery Website Production",
    metaDescription:
      "LUDGI Inc. builds hospital websites, plastic surgery clinic websites, multilingual SEO content systems, inquiry flows, and custom admin CMS platforms.",
    heroEyebrow: "LUDGI Inc. — Medical Website Production Partner",
    heroTitle: "A software partner for hospital websites built to convert.",
    heroDescription:
      "LUDGI Inc. designs and develops hospital and plastic surgery clinic websites with SEO architecture, service detail pages, multilingual content, inquiry forms, and admin workflows.",
    primaryCta: "Start a project inquiry",
    secondaryCta: "Official company profile",
    proofEyebrow: "Why LUDGI",
    proofTitle: "We design search exposure and consultation conversion together.",
    proofBody:
      "A medical website needs more than visual polish. It needs content structure, compliant wording, fast pages, inquiry paths, and admin operations working as one system.",
    medicalEyebrow: "Hospital Web Strategy",
    medicalTitle: "We turn clinic content into a scalable website product.",
    medicalBody:
      "Each treatment category can own its search intent, detail pages, blog entries, inquiry flow, and admin editing experience.",
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "What a medical website team needs on day one",
    processEyebrow: "Build Process",
    processTitle: "Strategy, build, SEO, and operations in one flow",
    seoEyebrow: "Search Exposure",
    seoTitle: "Optimized for LUDGI, hospital website production, and clinic website outsourcing.",
    seoBody:
      "This page combines LUDGI company trust signals with the commercial intent behind hospital and plastic surgery website production. Sitemap, robots, structured data, internal links, and multilingual canonicals are aligned.",
    factsEyebrow: "Company Facts",
    factsTitle: "LUDGI Inc. company information",
    faqEyebrow: "FAQ",
    faqTitle: "Questions before starting a website project",
    ctaEyebrow: "Project Inquiry",
    ctaTitle: "Discuss a hospital or plastic surgery clinic website.",
    ctaBody:
      "We can scope a new site, renewal, admin CMS, SEO blog system, service detail pages, and inquiry conversion flow.",
    extraKeywords: ["medical website development", "clinic website production", "website outsourcing"],
  },
  zh: {
    metaTitle: "LUDGI Inc. | 医院网站与整形外科网站制作",
    metaDescription:
      "LUDGI Inc. 为医院和整形外科诊所制作网站，提供多语言 SEO、咨询表单、服务详情页和后台管理系统。",
    heroEyebrow: "LUDGI Inc. — Medical Website Production Partner",
    heroTitle: "为医院网站制作提供从策划到运营的开发伙伴",
    heroDescription:
      "LUDGI Inc. 构建医院网站、整形外科网站、SEO 内容结构、多语言页面、咨询流程和后台 CMS。",
    primaryCta: "咨询制作项目",
    secondaryCta: "官方公司资料",
    proofEyebrow: "Why LUDGI",
    proofTitle: "同时设计搜索曝光与咨询转化。",
    proofBody:
      "医疗网站不只是视觉设计，还需要内容结构、合规文案、快速页面、咨询动线和后台运营能力。",
    medicalEyebrow: "Hospital Web Strategy",
    medicalTitle: "把诊所内容做成可持续运营的网站产品。",
    medicalBody:
      "按治疗项目拆分搜索意图，连接详情页、博客、咨询表单和后台编辑功能。",
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "医疗网站制作所需的核心能力",
    processEyebrow: "Build Process",
    processTitle: "策划、制作、SEO、运营一体化",
    seoEyebrow: "Search Exposure",
    seoTitle: "面向 LUDGI、医院网站制作、整形外科网站制作进行优化",
    seoBody:
      "本页面同时呈现 LUDGI 公司信任信息与医院网站制作需求，并配置 sitemap、robots、结构化数据、内部链接和多语言 canonical。",
    factsEyebrow: "Company Facts",
    factsTitle: "LUDGI Inc. 公司信息",
    faqEyebrow: "FAQ",
    faqTitle: "制作网站前的常见问题",
    ctaEyebrow: "Project Inquiry",
    ctaTitle: "咨询医院或整形外科网站制作。",
    ctaBody: "可规划新网站、改版、后台 CMS、SEO 博客、服务详情页和咨询转化流程。",
    extraKeywords: ["医院网站制作", "整形外科网站制作", "网站外包"],
  },
  ja: {
    metaTitle: "LUDGI Inc. | 病院ホームページ制作・美容外科ホームページ制作",
    metaDescription:
      "LUDGI Inc. は病院ホームページ、美容外科サイト、多言語 SEO、問い合わせ導線、サービス詳細ページ、管理 CMS を制作します。",
    heroEyebrow: "LUDGI Inc. — Medical Website Production Partner",
    heroTitle: "病院ホームページ制作を設計から運用まで支える開発パートナー",
    heroDescription:
      "LUDGI Inc. は病院・美容外科サイトの SEO 構造、多言語コンテンツ、問い合わせフォーム、管理 CMS を一体で設計します。",
    primaryCta: "制作を相談する",
    secondaryCta: "公式会社情報",
    proofEyebrow: "Why LUDGI",
    proofTitle: "検索露出と問い合わせ転換を同時に設計します。",
    proofBody:
      "医療サイトには見た目だけでなく、コンテンツ構造、適切な表現、速度、問い合わせ導線、管理運用性が必要です。",
    medicalEyebrow: "Hospital Web Strategy",
    medicalTitle: "クリニックの情報を運用できる Web プロダクトへ。",
    medicalBody:
      "施術カテゴリごとの検索意図、詳細ページ、ブログ、問い合わせ、管理画面をつなげます。",
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "医療ホームページ制作に必要な力",
    processEyebrow: "Build Process",
    processTitle: "企画、制作、SEO、運用まで一つの流れで",
    seoEyebrow: "Search Exposure",
    seoTitle: "LUDGI、病院ホームページ制作、美容外科サイト制作に最適化",
    seoBody:
      "このページでは LUDGI の会社情報と医療サイト制作の検索意図を結び、sitemap、robots、構造化データ、内部リンク、多言語 canonical を整えています。",
    factsEyebrow: "Company Facts",
    factsTitle: "LUDGI Inc. 会社情報",
    faqEyebrow: "FAQ",
    faqTitle: "制作依頼前によくある質問",
    ctaEyebrow: "Project Inquiry",
    ctaTitle: "病院・美容外科ホームページ制作をご相談ください。",
    ctaBody: "新規制作、リニューアル、管理 CMS、SEO ブログ、施術詳細ページ、問い合わせ導線を設計します。",
    extraKeywords: ["病院ホームページ制作", "美容外科ホームページ制作", "Web制作外注"],
  },
};

const stats = [
  { value: "30+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "100%", label: "On-time" },
  { value: "3+", label: "Public Sector" },
];

const capabilities = [
  {
    title: "Full-stack Engineering",
    body: "React, Next.js, Flutter, Node.js, Python 기반 웹/앱 전 영역 개발",
    icon: Code2,
  },
  {
    title: "AI · ML Solutions",
    body: "LLM, RAG, Vector Search, Computer Vision 기반 비즈니스 자동화",
    icon: Sparkles,
  },
  {
    title: "Cloud & DevOps",
    body: "AWS, GCP, Firebase, Docker, Kubernetes, Vercel 기반 인프라 설계",
    icon: Database,
  },
  {
    title: "Public Sector SI",
    body: "나라장터 조달, 공공기관 SI, 보안 요구사항, 법규 준수 대응",
    icon: ShieldCheck,
  },
  {
    title: "Medical Web Strategy",
    body: "병원 홈페이지 제작, 성형외과 홈페이지 제작, 문의 전환 UX와 SEO 설계",
    icon: Hospital,
  },
  {
    title: "Technical Consulting",
    body: "아키텍처 설계, 기술 스택 선정, 코드 리뷰, 운영 진단",
    icon: Workflow,
  },
];

const medicalWebsitePillars = [
  "병원 홈페이지 제작을 위한 서비스별 검색 의도 분리",
  "성형외과 홈페이지 제작에 맞춘 시술 상세페이지 구조",
  "한국어·영어·중국어·일본어 다국어 SEO 기반",
  "문의 신청, 답변 관리, 관리자 CMS, 이미지 업로드 운영 플로우",
  "Next.js, Neon DB, Vercel Blob, Firebase Auth 기반 확장 구조",
  "의료 광고 문구 리스크를 고려한 보수적이고 신뢰감 있는 카피",
];

const processSteps = [
  {
    step: "01",
    title: "검색 의도와 고객 여정 진단",
    body: "병원명, 시술명, 지역명, 제작 의뢰 키워드를 분리해 페이지 구조와 URL 전략을 먼저 설계합니다.",
  },
  {
    step: "02",
    title: "디자인 시스템과 콘텐츠 구조 제작",
    body: "브랜드 무드, 시술 카드, 상세페이지, 블로그, 문의 CTA를 재사용 가능한 컴포넌트로 구축합니다.",
  },
  {
    step: "03",
    title: "관리자 CMS와 운영 기능 연결",
    body: "서비스, 블로그, 문의, 이미지 업로드, RBAC 권한 관리를 실제 운영 흐름에 맞춰 연결합니다.",
  },
  {
    step: "04",
    title: "SEO, 배포, 성능 검수",
    body: "metadata, sitemap, rss, robots, 구조화 데이터, 이미지 메타, 빌드 검수를 함께 마무리합니다.",
  },
];

const trackRecords = [
  "나라장터 조달 수주",
  "한국전력공사(KEPCO)",
  "한전KDN",
  "이커머스 · 쇼핑몰",
  "SaaS · B2B 대시보드",
  "헬스케어 · 의료 AI",
  "교육 · 에듀테크",
  "물류 · TMS",
  "부동산 · 핀테크",
];

const companyFacts = [
  ["법인명", "주식회사 럿지 (LUDGI Inc.)"],
  ["대표이사", "노상우"],
  ["설립", "2024년"],
  ["사업자등록번호", "307-88-03283"],
  ["DUNS Number", "963415644"],
  ["주소", "인천광역시 연수구 인천타워대로 323, 에이동 20층"],
  ["대표전화", "010-3006-9310"],
  ["이메일", "milli@molluhub.com"],
];

const faqs = [
  {
    question: "주식회사 럿지는 병원 홈페이지 제작도 가능한가요?",
    answer:
      "가능합니다. Next.js 기반 홈페이지, 서비스 상세페이지, 블로그 SEO, 문의 관리, 관리자 CMS, 이미지 업로드까지 병원 운영에 필요한 웹 기능을 함께 설계합니다.",
  },
  {
    question: "성형외과 홈페이지 제작에서 가장 중요한 부분은 무엇인가요?",
    answer:
      "시술별 검색 의도, 신뢰감 있는 비주얼, 과장되지 않은 의료 문구, 상담 전환 CTA, 사후 관리형 콘텐츠 운영 구조가 함께 맞아야 합니다.",
  },
  {
    question: "홈페이지 제작 후 SEO까지 관리할 수 있나요?",
    answer:
      "초기 구축 단계에서 metadata, sitemap, rss, robots, 구조화 데이터, 블로그 구조, 다국어 canonical을 함께 반영해 검색엔진이 페이지 목적을 이해하기 쉽게 만듭니다.",
  },
  {
    question: "아웃소싱 개발 범위는 어디까지 가능한가요?",
    answer:
      "기획, UI/UX, 프론트엔드, 백엔드, DB, 관리자, 배포, 운영 진단까지 프로젝트 상황에 맞춰 단위 외주 또는 전체 구축이 가능합니다.",
  },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const copy = companyCopies[locale];
  const title = copy.metaTitle;
  const description = copy.metaDescription;

  return {
    title,
    description,
    keywords: keywordsFor(locale, [...companySeoKeywords, ...copy.extraKeywords]),
    alternates: pageAlternates(locale, "company"),
    openGraph: pageOpenGraph({
      locale,
      path: "company",
      title,
      description,
      image: `/${locale}/company/opengraph-image`,
    }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/${locale}/company/opengraph-image`],
    },
    authors: [{ name: "주식회사 럿지" }, { name: "LUDGI Inc." }],
    publisher: "LUDGI Inc.",
    category: "Hospital Website Production",
    other: {
      "business:contact_data:email": "milli@molluhub.com",
      "business:contact_data:phone_number": "+82-10-3006-9310",
      "business:contact_data:locality": "Incheon",
      "article:tag": companySeoKeywords.join(", "),
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const copy = companyCopies[locale];
  const structuredData = buildStructuredData(locale, copy);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={copy.heroEyebrow}
      title={copy.heroTitle}
      description={copy.heroDescription}
      image="/images/clinic-interior.jpg"
      imageAlt="LUDGI hospital website production strategy"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section data-reveal-section="" className="border-b border-white/10 bg-[#120d0e] py-16">
        <div className="section-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-panel p-6">
              <p className="font-display text-5xl text-white">{stat.value}</p>
              <p className="eyebrow mt-3 text-[#dec47b]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal-section="" className="bg-[#1f1715] py-24 md:py-32">
        <div className="section-shell grid gap-14 lg:grid-cols-[0.92fr_1fr]">
          <div>
            <p className="eyebrow text-[#dec47b]">{copy.proofEyebrow}</p>
            <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.proofTitle}</h2>
            <p className="mt-7 text-lg leading-9 text-[#d9d0c9]">{copy.proofBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href={`/${locale}/inquire`}>
                {copy.primaryCta}
                <ArrowRight size={16} />
              </Link>
              <a
                className="button-outline"
                href="https://info.ludgi.ai/company"
                rel="noopener noreferrer"
                target="_blank"
              >
                {copy.secondaryCta}
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["병원 홈페이지", "상담 전환 동선과 의료 콘텐츠를 중심으로 설계"],
              ["성형외과 홈페이지", "시술별 상세페이지와 신뢰형 비주얼 시스템 구축"],
              ["홈페이지 제작", "기획, 디자인, 개발, 배포, 운영까지 통합"],
              ["아웃소싱", "공공·민간 프로젝트 경험 기반의 개발 파트너십"],
            ].map(([title, body]) => (
              <article
                key={title}
                data-magnetic=""
                data-magnetic-strength="4"
                className="glass-panel min-h-48 p-6"
              >
                <CheckCircle2 className="text-[#dec47b]" size={22} />
                <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
                <p className="mt-4 leading-7 text-[#b6aaa6]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="border-y border-white/10 bg-[#241b18] py-24 md:py-32">
        <div className="section-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow text-[#dec47b]">{copy.medicalEyebrow}</p>
            <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.medicalTitle}</h2>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#d9d0c9]">{copy.medicalBody}</p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {medicalWebsitePillars.map((item) => (
              <div key={item} className="flex gap-4 rounded-lg border border-white/10 bg-black/18 p-5">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec47b]/45 text-[#dec47b]">
                  <CheckCircle2 size={15} />
                </span>
                <p className="leading-8 text-[#fff8ef]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="bg-[#120d0e] py-24 md:py-32">
        <div className="section-shell">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow text-[#dec47b]">{copy.capabilitiesEyebrow}</p>
            <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.capabilitiesTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map(({ title, body, icon: Icon }) => (
              <article key={title} className="glass-panel p-6">
                <Icon className="text-[#dec47b]" size={24} />
                <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
                <p className="mt-4 leading-8 text-[#b6aaa6]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="border-y border-white/10 bg-[#1f1715] py-24 md:py-32">
        <div className="section-shell grid gap-14 lg:grid-cols-[0.8fr_1.1fr]">
          <div>
            <p className="eyebrow text-[#dec47b]">{copy.processEyebrow}</p>
            <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.processTitle}</h2>
          </div>
          <div className="grid gap-4">
            {processSteps.map((step) => (
              <article key={step.step} className="grid gap-5 rounded-lg border border-white/10 bg-black/18 p-6 md:grid-cols-[5rem_1fr]">
                <p className="font-display text-4xl text-[#dec47b]">{step.step}</p>
                <div>
                  <h3 className="text-xl font-black text-white">{step.title}</h3>
                  <p className="mt-3 leading-8 text-[#b6aaa6]">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="bg-[#241b18] py-24 md:py-32">
        <div className="section-shell grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="eyebrow text-[#dec47b]">{copy.seoEyebrow}</p>
            <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.seoTitle}</h2>
            <p className="mt-7 text-lg leading-9 text-[#d9d0c9]">{copy.seoBody}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {companySeoKeywords.slice(0, 10).map((keyword) => (
                <span key={keyword} className="rounded-full border border-[#dec47b]/25 bg-[#dec47b]/8 px-4 py-2 text-sm font-bold text-[#dec47b]">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel p-6 md:p-8">
            <p className="eyebrow text-[#dec47b]">Track Record</p>
            <div className="mt-6 grid gap-3">
              {trackRecords.map((record) => (
                <div key={record} className="flex items-center gap-3 border-b border-white/10 pb-3 text-[#fff8ef] last:border-b-0 last:pb-0">
                  <ShieldCheck className="text-[#dec47b]" size={17} />
                  <span>{record}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="bg-[#120d0e] py-24 md:py-32">
        <div className="section-shell">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-[#dec47b]">{copy.factsEyebrow}</p>
              <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.factsTitle}</h2>
            </div>
            <a
              className="button-outline w-fit"
              href="https://info.ludgi.ai/company"
              rel="noopener noreferrer"
              target="_blank"
            >
              info.ludgi.ai/company
              <ExternalLink size={15} />
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {companyFacts.map(([label, value]) => (
              <div key={label} className="glass-panel grid gap-2 p-5">
                <p className="eyebrow text-[#d9c1ad]">{label}</p>
                <p className="leading-8 text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="border-y border-white/10 bg-[#1f1715] py-24 md:py-32">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1fr]">
          <div>
            <p className="eyebrow text-[#dec47b]">{copy.faqEyebrow}</p>
            <h2 className="font-display mt-5 text-5xl leading-tight md:text-7xl">{copy.faqTitle}</h2>
          </div>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-white/10 bg-black/18 p-6">
                <h3 className="text-xl font-black text-white">{faq.question}</h3>
                <p className="mt-4 leading-8 text-[#b6aaa6]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-section="" className="bg-[#120d0e] py-24 md:py-32">
        <div className="section-shell">
          <div className="glass-panel grid gap-10 p-7 md:p-10 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <p className="eyebrow text-[#dec47b]">{copy.ctaEyebrow}</p>
              <h2 className="font-display mt-5 max-w-4xl text-5xl leading-tight md:text-7xl">{copy.ctaTitle}</h2>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-[#d9d0c9]">{copy.ctaBody}</p>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <Link className="button-primary" href={`/${locale}/inquire`}>
                {copy.primaryCta}
                <ArrowRight size={16} />
              </Link>
              <a className="button-outline" href="mailto:milli@molluhub.com">
                milli@molluhub.com
                <Mail size={16} />
              </a>
              <a className="button-outline" href="tel:01030069310">
                010 - 3006 - 9310
                <Phone size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function buildStructuredData(locale: Locale, copy: CompanyCopy) {
  const companyPageUrl = localizedAbsoluteUrl(locale, "company");
  const organizationId = absoluteUrl("/#ludgi-organization");
  const serviceId = `${companyPageUrl}#hospital-website-production`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "주식회사 럿지",
      alternateName: ["LUDGI Inc.", "럿지", "LUDGI"],
      url: "https://info.ludgi.ai/company",
      email: "milli@molluhub.com",
      telephone: "+82-10-3006-9310",
      taxID: "307-88-03283",
      duns: "963415644",
      foundingDate: "2024",
      founder: {
        "@type": "Person",
        name: "노상우",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "KR",
        addressRegion: "인천광역시",
        addressLocality: "연수구",
        streetAddress: "인천타워대로 323, 에이동 20층",
      },
      knowsAbout: companySeoKeywords,
      sameAs: ["https://info.ludgi.ai/company"],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": serviceId,
      name: "주식회사 럿지 병원 홈페이지 제작",
      url: companyPageUrl,
      inLanguage: localeHreflangs[locale],
      serviceType: [
        "병원 홈페이지 제작",
        "성형외과 홈페이지 제작",
        "홈페이지 제작",
        "의료 홈페이지 아웃소싱",
      ],
      provider: {
        "@id": organizationId,
      },
      areaServed: {
        "@type": "Country",
        name: "South Korea",
      },
      description: copy.metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${companyPageUrl}#webpage`,
      url: companyPageUrl,
      name: copy.metaTitle,
      description: copy.metaDescription,
      inLanguage: localeHreflangs[locale],
      about: {
        "@id": organizationId,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl(`/${locale}/company/opengraph-image`),
        width: 1200,
        height: 630,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: localizedAbsoluteUrl(locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Company",
          item: companyPageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}
