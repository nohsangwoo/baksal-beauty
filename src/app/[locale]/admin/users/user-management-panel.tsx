"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { USER_ROLES, USER_STATUSES } from "@/lib/rbac";
import { CrudShell, Field, ForbiddenPanel, Select, Textarea } from "../_components/admin-shared";
import { fetchJson, getEmptyRecord, type AdminRecord, type ListResponse } from "../_components/admin-types";

export function UserManagementAdminPanel({ canManageUsers }: { canManageUsers: boolean }) {
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["admin-resource", "users"],
    queryFn: () => fetchJson<ListResponse<AdminRecord>>("/api/admin/users"),
    enabled: canManageUsers,
  });

  if (!canManageUsers) {
    return <ForbiddenPanel title="User Management" />;
  }

  return (
    <UserManagementPanel
      items={userQuery.data?.items ?? []}
      source={userQuery.data?.source}
      loading={userQuery.isLoading}
      onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin-resource", "users"] })}
    />
  );
}

export function UserManagementPanel({
  items,
  source,
  loading,
  onChanged,
}: {
  items: AdminRecord[];
  source?: "database" | "fallback";
  loading: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<AdminRecord>(() => getEmptyRecord("users"));
  const [notice, setNotice] = useState("");
  const saveMutation = useMutation({
    mutationFn: async (payload: AdminRecord) => {
      const method = payload.id ? "PATCH" : "POST";
      const url = payload.id ? `/api/admin/users/${payload.id}` : "/api/admin/users";
      return fetchJson(url, { method, body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      setNotice("사용자 권한이 저장되었습니다.");
      setEditing(getEmptyRecord("users"));
      onChanged();
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "사용자 저장에 실패했습니다."),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/admin/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setNotice("사용자를 삭제했습니다.");
      onChanged();
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : "사용자 삭제에 실패했습니다."),
  });

  return (
    <CrudShell
      title="User Management"
      source={source}
      loading={loading}
      notice={notice}
      action={
        <button className="button-outline" onClick={() => setEditing(getEmptyRecord("users"))} type="button">
          New User
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-3">
          {items.map((item) => (
            <article key={item.id} className="glass-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#dec47b]/14 px-3 py-1 text-[0.68rem] font-black uppercase text-[#dec47b]">
                    {item.meta}
                  </span>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-[0.68rem] font-black uppercase text-white/64">
                    {item.status}
                  </span>
                </div>
                <h4 className="mt-3 truncate text-xl font-black">{item.title || item.subtitle}</h4>
                <p className="mt-2 truncate text-sm leading-6 text-[#d9d0c9]">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="button-outline h-10 px-3 text-[0.68rem]"
                  onClick={() => saveMutation.mutate({ ...item, meta: "Patient" })}
                  type="button"
                >
                  Revoke
                </button>
                <button className="social-action-button" onClick={() => setEditing(item)} title="Edit" type="button">
                  <Pencil size={16} />
                </button>
                <button className="social-action-button" onClick={() => deleteMutation.mutate(item.id)} title="Delete" type="button">
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <form
          className="glass-panel h-fit p-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(editing);
          }}
        >
          <p className="eyebrow text-[#dec47b]">RBAC Editor</p>
          <p className="mt-3 text-sm leading-6 text-[#b6aaa6]">
            Firebase 계정은 신원만 확인하고, Neon users 테이블에서 권한만 부여하거나 철회합니다.
          </p>
          <div className="mt-5 grid gap-3">
            <Field label="Name" value={editing.title} onChange={(value) => setEditing({ ...editing, title: value })} />
            <Textarea label="Email" value={editing.subtitle} onChange={(value) => setEditing({ ...editing, subtitle: value })} />
            <Select
              label="Role"
              value={editing.meta || "Patient"}
              options={[...USER_ROLES]}
              onChange={(value) => setEditing({ ...editing, meta: value })}
            />
            <Select
              label="Status"
              value={editing.status || "active"}
              options={[...USER_STATUSES]}
              onChange={(value) => setEditing({ ...editing, status: value })}
            />
            <Field
              label="Auth Provider"
              value={(editing.tags ?? ["manual"])[0] ?? "manual"}
              onChange={(value) => setEditing({ ...editing, tags: [value] })}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="button-outline h-10 px-3 text-[0.68rem]" onClick={() => setEditing({ ...editing, meta: "Admin" })} type="button">
              Grant Admin
            </button>
            <button className="button-outline h-10 px-3 text-[0.68rem]" onClick={() => setEditing({ ...editing, meta: "Owner" })} type="button">
              Grant Owner
            </button>
            <button className="button-outline h-10 px-3 text-[0.68rem]" onClick={() => setEditing({ ...editing, meta: "Patient" })} type="button">
              Revoke Role
            </button>
            <button className="button-outline h-10 px-3 text-[0.68rem]" onClick={() => setEditing({ ...editing, status: "suspended" })} type="button">
              Suspend
            </button>
          </div>
          <button className="button-primary mt-5 w-full" disabled={saveMutation.isPending} type="submit">
            {saveMutation.isPending ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
            Save Permission
          </button>
        </form>
      </div>
    </CrudShell>
  );
}
