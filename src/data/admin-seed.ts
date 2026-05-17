export type AdminUserSeed = {
  name: string;
  email: string;
  role: string;
  status: string;
};

export type BlogPostSeed = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: string;
  imageUrl: string;
  tags: string[];
};

export type InquirySeed = {
  seedKey: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  preferredChannel: string;
  message: string;
  status: string;
};

export const adminUserSeeds: AdminUserSeed[] = [
  {
    name: "노상우",
    email: "milli@molluhub.com",
    role: "Owner",
    status: "active",
  },
  {
    name: "Clinic Manager",
    email: "manager@bsclinic.local",
    role: "Manager",
    status: "pending",
  },
];

export const blogPostSeeds: BlogPostSeed[] = [
  {
    title: "눈성형 상담 전 확인할 구조적 포인트",
    slug: "eye-surgery-consultation-structure-guide",
    excerpt: "라인보다 먼저 봐야 할 눈뜨는 힘과 좌우 균형",
    category: "Aesthetic Medicine",
    status: "draft",
    imageUrl: "/images/blog-consultation.jpg",
    tags: ["eye", "guide"],
  },
];

export const inquirySeeds: InquirySeed[] = [
  {
    seedKey: "guest-eye-consultation",
    name: "비회원 상담 신청",
    phone: "010-0000-0000",
    email: "guest@example.com",
    interest: "눈성형",
    preferredChannel: "KakaoTalk",
    message: "눈성형 상담 가능 일정 문의",
    status: "new",
  },
];
