"use client";

import {
  Suspense,
  useEffect,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import {
  verifyEmail,
} from "@/services/auth.service";

function VerifyEmailContent() {
  const params =
    useSearchParams();

  const router =
    useRouter();

  useEffect(() => {
    const token =
      params.get("token");

    if (!token) return;

    verifyEmail(token)
      .then(() => {
        router.push(
          "/login"
        );
      });
  }, [
    params,
    router,
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h3 className="text-gray-500 text-2xl font-bold">Verifying email...</h3>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center gap-4"><h3 className="text-gray-500 text-2xl font-bold">Verifying email...</h3></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}