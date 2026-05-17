"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const ANNOUNCEMENT_VISIBILITY_EVENT = "baksal:announcement-visibility";

const ANNOUNCEMENT_STORAGE_KEY = "baksal:home-announcement-dismissed";

type HomeAnnouncementProps = {
  message: string;
};

export function HomeAnnouncement({ message }: HomeAnnouncementProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = window.sessionStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) === "true";
    let hideFrame = 0;

    if (dismissed) {
      hideFrame = window.requestAnimationFrame(() => {
        setVisible(false);
      });
    }

    dispatchAnnouncementVisibility(!dismissed);

    return () => {
      if (hideFrame) {
        window.cancelAnimationFrame(hideFrame);
      }
    };
  }, []);

  const closeAnnouncement = () => {
    window.sessionStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, "true");
    setVisible(false);
    dispatchAnnouncementVisibility(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="relative z-10 border-b border-white/10 bg-[#e7d1c7]/90 text-[#211515]">
      <div className="section-shell relative flex min-h-9 items-center justify-center px-10 py-2 text-center text-[0.72rem] font-bold">
        <p>{message}</p>
        <button
          aria-label="Close announcement"
          className="absolute right-0 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#211515]/72 transition hover:bg-black/10 hover:text-[#211515]"
          onClick={closeAnnouncement}
          type="button"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function dispatchAnnouncementVisibility(visible: boolean) {
  window.dispatchEvent(
    new CustomEvent(ANNOUNCEMENT_VISIBILITY_EVENT, {
      detail: {
        visible,
      },
    }),
  );
}
