"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { PremiumInput } from "@/components/auth/premium-input";
import { AuthCard } from "./auth-card";
import { OAuthButtons } from "./oauth-buttons";
import { useLogin } from "@/hooks/use-login";
import { me } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api/errors";


export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const setAccessToken =
    useAuthStore(
      (state) =>
        state.setAccessToken
    );
  const setRefreshToken =
    useAuthStore(
      (state) =>
        state.setRefreshToken
    );
  const setUser =
    useAuthStore(
      (state) => state.setUser
    );
  const [formError, setFormError] =
    useState<string | null>(
      null
    );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(
    data: LoginFormData
  ): Promise<void> {
    setFormError(null);

    try {
      const result =
        await login.mutateAsync(
          data
        );

      setAccessToken(
        result.access
      );

      if (result.refresh_token) {
        setRefreshToken(
          result.refresh_token
        );
      }

      const user =
        await me();

      setUser(user);

      router.push(
        "/dashboard"
      );
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          "Something went wrong. Please try again."
        )
      );
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue sourcing with Joenise."
    >
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-4"
      >
        <PremiumInput
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          error={
            errors.email?.message
          }
          {...register("email")}
        />

        <PremiumInput
          icon={<Lock className="h-4 w-4" />}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          error={
            errors.password
              ?.message
          }
          {...register(
            "password"
          )}
        />

        {formError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            login.isPending
          }
          className="h-11 w-full bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]"
        >
          {
            login.isPending
              ? "Signing in..."
              : "Sign in"
          }
        </Button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-[#D8D3CC]" />
          <span className="text-xs font-medium uppercase text-[#6B6B6B]">
            or
          </span>
          <div className="h-px flex-1 bg-[#D8D3CC]" />
        </div>

        <OAuthButtons
          onError={setFormError}
        />
      </form>

      <p className="mt-6 text-center text-sm text-[#6B6B6B]">
        New to Joenise?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#7A623F] transition-colors hover:text-[#1E1E1E]"
        >
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
