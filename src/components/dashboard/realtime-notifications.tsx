"use client";

import {
  useEffect,
  useState,
} from "react";
import { Bell } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  tone: "success" | "warning" | "neutral";
}

function getToneClass(
  tone: NotificationItem["tone"]
) {
  if (tone === "success") {
    return "bg-[#4F7A57]";
  }

  if (tone === "warning") {
    return "bg-[#C4A574]";
  }

  return "bg-[#6B6B6B]";
}

export function RealtimeNotifications() {
  const [
    notifications,
    setNotifications,
  ] = useState(
    [] as NotificationItem[]
  );

  useEffect(() => {
    const apiUrl =
      process.env
        .NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return;
    }

    const streamUrl = new URL(
      "/api/notifications/stream/",
      new URL(apiUrl).origin
    );

    const stream =
      new EventSource(
        streamUrl.toString(),
        {
          withCredentials: true,
        }
      );

    stream.onmessage = (event) => {
      try {
        const parsed =
          JSON.parse(
            event.data
          ) as NotificationItem;

        setNotifications(
          (current) => [
            parsed,
            ...current,
          ].slice(0, 5)
        );
      } catch {
      }
    };

    stream.onerror = () => {
      stream.close();
    };

    return () => {
      stream.close();
    };
  }, []);

  return (
    <section className="rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-[#4F7A57]/10 p-2 text-[#4F7A57]">
          <Bell className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#1E1E1E]">
            Notifications
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Live updates for buyer activity.
          </p>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="mt-4 space-y-3">
          {notifications.map(
            (notification) => (
              <article
                className="flex gap-3 rounded-md border border-[#D8D3CC] p-3"
                key={notification.id}
              >
                <span
                  className={`mt-1 h-2 w-2 rounded-sm ${getToneClass(notification.tone)}`}
                />
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E]">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    {notification.body}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-[#D8D3CC] p-4 text-center">
          <p className="font-medium text-[#1E1E1E]">
            No notifications yet
          </p>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            RFQ, order, invoice, wallet, and shipment alerts will appear here in real time.
          </p>
        </div>
      )}
    </section>
  );
}
