"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  tone: "success" | "warning" | "neutral";
}

function getToneClass(tone: NotificationItem["tone"]) {
  if (tone === "success") return "bg-[#4F7A57]";
  if (tone === "warning") return "bg-[#C4A574]";
  return "bg-[#6B6B6B]";
}

export function TopNavNotifications() {
  const [notifications, setNotifications] = useState([] as NotificationItem[]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const streamUrl = new URL("/api/notifications/stream/", new URL(apiUrl).origin);
    const stream = new EventSource(streamUrl.toString(), { withCredentials: true });

    stream.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as NotificationItem;
        setNotifications((current) => {
          const updated = [parsed, ...current].slice(0, 5);
          if (!isOpen) {
            setHasUnread(true);
          }
          return updated;
        });
      } catch {}
    };

    stream.onerror = () => {
      stream.close();
    };

    return () => {
      stream.close();
    };
  }, [isOpen]);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open) {
      setHasUnread(false);
    }
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button className="p-2 text-brand-primary-light hover:text-brand-accent transition-colors relative outline-none">
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-sm bg-[#4F7A57] ring-2 ring-white" />
          )}
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="z-50 w-80 rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          align="end"
          sideOffset={8}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1E1E1E]">Notifications</h3>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {notifications.map((notification) => (
                <article
                  className="flex gap-3 rounded-md border border-[#D8D3CC]/50 p-2.5 transition-colors hover:bg-gray-50"
                  key={notification.id}
                >
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${getToneClass(notification.tone)}`} />
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E] leading-tight">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-[#6B6B6B] line-clamp-2">
                      {notification.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-[#D8D3CC] py-6 text-center">
              <p className="font-medium text-[#1E1E1E] text-sm">No notifications yet</p>
              <p className="mt-1 text-xs text-[#6B6B6B]">You're all caught up!</p>
            </div>
          )}
          
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
