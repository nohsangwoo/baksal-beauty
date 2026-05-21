import type { Locale } from "@/i18n/config";

export type BlogStatus = "draft" | "published" | "archived";

export type BlogContentBlockType = "heading" | "paragraph" | "image" | "quote" | "callout" | "divider";

export type BlogContentBlock = {
  id: string;
  type: BlogContentBlockType;
  content?: string;
  level?: 2 | 3;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  status: BlogStatus;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  authorName: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  locale: Locale;
  title: string;
  excerpt: string;
  contentBlocks: BlogContentBlock[];
  seoTitle: string;
  seoDescription: string;
};

export type BlogPostInput = Omit<BlogPost, "createdAt" | "updatedAt">;

export const emptyBlogPost: BlogPost = {
  id: "",
  slug: "",
  category: "Aesthetic Medicine",
  status: "draft",
  imageUrl: "",
  imageAlt: "",
  tags: [],
  featured: false,
  sortOrder: 100,
  authorName: "BAKSAL BEAUTY",
  publishedAt: null,
  locale: "ko",
  title: "",
  excerpt: "",
  contentBlocks: [],
  seoTitle: "",
  seoDescription: "",
};

export const blogFallbackPosts: BlogPost[] = [
  {
    id: "eye-surgery-consultation-structure-guide",
    slug: "eye-surgery-consultation-structure-guide",
    category: "Aesthetic Medicine",
    status: "published",
    imageUrl: "/images/blog-consultation.jpg",
    imageAlt: "눈성형 상담 중 얼굴 구조를 설명하는 의료진",
    tags: ["eye", "consultation", "guide"],
    featured: true,
    sortOrder: 10,
    authorName: "BAKSAL BEAUTY",
    publishedAt: "2026-05-20T00:00:00.000Z",
    locale: "ko",
    title: "눈성형 상담에서 먼저 확인해야 할 구조적 기준",
    excerpt: "라인보다 먼저 눈의 힘, 피부 두께, 좌우 균형을 확인해야 자연스러운 계획이 가능합니다.",
    seoTitle: "눈성형 상담 구조 가이드 | BAKSAL BEAUTY",
    seoDescription: "눈성형 상담에서 라인보다 먼저 확인해야 하는 눈매 힘, 피부 두께, 좌우 균형 기준을 정리했습니다.",
    contentBlocks: [
      {
        id: "intro-heading",
        type: "heading",
        level: 2,
        content: "라인보다 먼저 보는 것",
      },
      {
        id: "intro-body",
        type: "paragraph",
        content:
          "자연스러운 눈매 디자인은 단순히 원하는 라인을 고르는 과정이 아닙니다. 눈을 뜨는 힘, 피부 두께, 눈썹과 눈 사이의 거리, 좌우 균형을 함께 확인해야 오래 보아도 어색하지 않은 계획이 만들어집니다.",
      },
      {
        id: "consultation-image",
        type: "image",
        imageUrl: "/images/blog-consultation.jpg",
        imageAlt: "상담실에서 눈매 구조를 설명하는 장면",
        caption: "상담 단계에서 구조를 먼저 확인하면 과한 변화를 줄일 수 있습니다.",
      },
      {
        id: "care-callout",
        type: "callout",
        content:
          "BAKSAL BEAUTY는 개인별 진단 후 수술 여부와 범위를 안내하며, 회복 계획까지 함께 설명합니다.",
      },
    ],
  },
  {
    id: "laser-skin-texture-recovery",
    slug: "laser-skin-texture-recovery",
    category: "Skin Recovery",
    status: "published",
    imageUrl: "/images/blog-laser.jpg",
    imageAlt: "레이저 피부 시술 장비와 편안한 치료 공간",
    tags: ["skin", "laser", "recovery"],
    featured: false,
    sortOrder: 20,
    authorName: "BAKSAL BEAUTY",
    publishedAt: "2026-05-20T00:00:00.000Z",
    locale: "ko",
    title: "레이저 시술 후 피부 결이 달라지는 과정",
    excerpt: "피부 결 개선은 시술 직후보다 회복 기간의 관리와 보습 루틴에서 차이가 커집니다.",
    seoTitle: "레이저 피부 시술 회복 가이드 | BAKSAL BEAUTY",
    seoDescription: "레이저 시술 후 피부 결과 톤이 변화하는 과정, 회복 관리 포인트를 정리했습니다.",
    contentBlocks: [
      {
        id: "texture-heading",
        type: "heading",
        level: 2,
        content: "회복 기간의 루틴이 결과의 질감을 만듭니다",
      },
      {
        id: "texture-body",
        type: "paragraph",
        content:
          "레이저 시술은 피부 표면에 에너지를 전달하는 만큼, 이후 진정과 보습 관리가 중요합니다. 개인별 피부 상태와 시술 강도에 따라 회복 속도는 달라질 수 있습니다.",
      },
      {
        id: "texture-quote",
        type: "quote",
        content: "좋은 시술은 끝나는 순간이 아니라 회복 계획까지 이어질 때 완성됩니다.",
      },
    ],
  },
  {
    id: "post-treatment-skincare-guide",
    slug: "post-treatment-skincare-guide",
    category: "Care Guide",
    status: "published",
    imageUrl: "/images/blog-recovery.jpg",
    imageAlt: "시술 후 회복 관리를 위한 스킨케어 제품과 타월",
    tags: ["care", "skincare", "recovery"],
    featured: false,
    sortOrder: 30,
    authorName: "BAKSAL BEAUTY",
    publishedAt: "2026-05-20T00:00:00.000Z",
    locale: "ko",
    title: "시술 후 회복 화장품을 고를 때 보는 기준",
    excerpt: "자극을 줄이고 장벽 회복을 돕는 제품 선택 기준을 차분하게 정리했습니다.",
    seoTitle: "시술 후 회복 화장품 선택 기준 | BAKSAL BEAUTY",
    seoDescription: "피부 시술 후 사용할 회복 화장품을 고를 때 확인할 성분과 사용 루틴을 안내합니다.",
    contentBlocks: [
      {
        id: "care-heading",
        type: "heading",
        level: 2,
        content: "가장 먼저 줄여야 할 것은 자극입니다",
      },
      {
        id: "care-body",
        type: "paragraph",
        content:
          "시술 후 피부는 평소보다 예민하게 반응할 수 있습니다. 향, 강한 산 성분, 과도한 기능성 제품은 잠시 줄이고, 보습과 장벽 회복 중심으로 관리하는 것이 좋습니다.",
      },
      {
        id: "care-image",
        type: "image",
        imageUrl: "/images/blog-recovery.jpg",
        imageAlt: "회복 관리를 위한 스킨케어 제품",
        caption: "제품 선택은 피부 상태와 시술 범위에 따라 달라질 수 있습니다.",
      },
    ],
  },
];

export function getEmptyBlogBlock(type: BlogContentBlockType): BlogContentBlock {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (type === "heading") {
    return { id, type, level: 2, content: "새 섹션 제목" };
  }

  if (type === "image") {
    return { id, type, imageUrl: "", imageAlt: "", caption: "" };
  }

  if (type === "divider") {
    return { id, type };
  }

  return { id, type, content: type === "quote" ? "인용 문구를 입력하세요." : "본문을 입력하세요." };
}
