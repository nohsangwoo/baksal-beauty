export type InquiryStatus = "new" | "in_progress" | "replied" | "closed" | "spam";

export type InquiryReplyStatus = "sent" | "failed";

export type InquiryReply = {
  id: string;
  inquiryId: string;
  adminName: string;
  adminEmail: string;
  sentTo: string;
  subject: string;
  body: string;
  status: InquiryReplyStatus;
  errorMessage: string;
  createdAt: string;
};

export type InquiryHistoryItem = {
  id: string;
  subject: string;
  interest: string;
  status: InquiryStatus;
  createdAt: string;
};

export type InquiryRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  preferredChannel: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  assignedTo: string;
  locale: string;
  privacyAccepted: boolean;
  sourcePath: string;
  createdAt: string;
  updatedAt: string;
  repliedAt: string | null;
  closedAt: string | null;
  replyCount: number;
  latestReplyAt: string | null;
  replies: InquiryReply[];
  customerHistory: InquiryHistoryItem[];
};

export type InquiryListResult = {
  source: "database" | "fallback";
  items: InquiryRecord[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<InquiryStatus | "all" | "unanswered", number>;
};

export const inquiryStatuses: InquiryStatus[] = [
  "new",
  "in_progress",
  "replied",
  "closed",
  "spam",
];

export const unansweredInquiryStatuses: InquiryStatus[] = ["new", "in_progress"];

export const inquiryFallbackRecords: InquiryRecord[] = [
  {
    id: "fallback-inquiry",
    name: "비회원 상담 신청",
    phone: "010-0000-0000",
    email: "guest@example.com",
    interest: "눈성형",
    preferredChannel: "KakaoTalk",
    subject: "눈매 상담 가능 일정 문의",
    message: "눈매 교정 상담 가능 일정과 회복 안내를 받고 싶습니다.",
    status: "new",
    assignedTo: "",
    locale: "ko",
    privacyAccepted: true,
    sourcePath: "/ko/inquire",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    repliedAt: null,
    closedAt: null,
    replyCount: 0,
    latestReplyAt: null,
    replies: [],
    customerHistory: [],
  },
];
