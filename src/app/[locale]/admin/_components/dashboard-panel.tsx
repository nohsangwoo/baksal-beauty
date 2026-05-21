"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, ShieldCheck } from "lucide-react";
import type { BlogPost } from "@/data/blog-content";
import type { ServiceItem } from "@/data/service-content";
import { fetchJson, type AdminRecord, type ListResponse } from "./admin-types";

export function DashboardPanel({ canManageUsers = false }: { canManageUsers?: boolean }) {
  const serviceQuery = useQuery({
    queryKey: ["admin-services", "dashboard"],
    queryFn: () => fetchJson<ListResponse<ServiceItem>>("/api/admin/services?locale=ko"),
  });
  const userQuery = useQuery({
    queryKey: ["admin-resource", "users"],
    queryFn: () => fetchJson<ListResponse<AdminRecord>>("/api/admin/users"),
    enabled: canManageUsers,
  });
  const blogQuery = useQuery({
    queryKey: ["admin-blog", "dashboard"],
    queryFn: () => fetchJson<ListResponse<BlogPost>>("/api/admin/blog-posts?locale=ko"),
  });
  const inquireQuery = useQuery({
    queryKey: ["admin-resource", "inquire"],
    queryFn: () => fetchJson<ListResponse<AdminRecord>>("/api/admin/inquire"),
  });

  return (
    <DashboardOverview
      counts={{
        services: serviceQuery.data?.items.length ?? 0,
        users: userQuery.data?.items.length ?? 0,
        blog: blogQuery.data?.items.length ?? 0,
        inquire: inquireQuery.data?.items.length ?? 0,
      }}
    />
  );
}

function DashboardOverview({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid gap-6">
      <div className="glass-panel p-7 md:p-9">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[#dec47b]">Overview</p>
            <h3 className="font-display mt-3 text-5xl">Operations Dashboard</h3>
            <p className="mt-4 max-w-2xl leading-8 text-[#d9d0c9]">
              서비스, 블로그, 문의, 유저/RBAC 관리를 한 화면에서 진행하는 기본 구조입니다.
            </p>
          </div>
          <ShieldCheck className="text-[#dec47b]" size={42} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Services", counts.services],
          ["Users", counts.users],
          ["Blog", counts.blog],
          ["Inquire", counts.inquire],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-6">
            <BarChart3 className="text-[#dec47b]" size={20} />
            <p className="mt-5 text-sm font-black uppercase text-white/54">{label}</p>
            <p className="font-display mt-2 text-5xl">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
