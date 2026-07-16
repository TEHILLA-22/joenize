"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumInput } from "@/components/auth/premium-input";
import { useRegister } from "@/hooks/use-register";
import { AuthCard } from "@/components/auth/auth-card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  registerSchema,
  RegisterFormData,
} from "@/lib/validations/auth";

export function SignupForm() {
  const registerMutation =
    useRegister();
  const [formMessage, setFormMessage] =
    useState<string | null>(
      null
    );
  const [formError, setFormError] =
    useState<string | null>(
      null
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(
      registerSchema
    ),
  });

  async function onSubmit(
    data: RegisterFormData
  ): Promise<void> {
    setFormError(null);
    setFormMessage(null);

    try {
      const response =
        await registerMutation.mutateAsync(
          {
            username:
              data.username,
            email: data.email,
            password:
              data.password,
          }
        );

      setFormMessage(
        response.detail
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFormError(
          getApiErrorMessage(
            error,
            "We could not create this account. Please check your details."
          )
        );

        return;
      }

      setFormError(
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <AuthCard
      title="Create account"
      description="Start buying and sourcing on Joenise."
    >
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-4"
      >
        <PremiumInput
          icon={<User className="h-4 w-4" />}
          placeholder="Username"
          autoComplete="username"
          error={
            errors.username
              ?.message
          }
          {...register("username")}
        />

        <PremiumInput
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder="Email"
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
          autoComplete="new-password"
          error={
            errors.password
              ?.message
          }
          {...register("password")}
        />

        <PremiumInput
          icon={<Lock className="h-4 w-4" />}
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          error={
            errors.confirmPassword
              ?.message
          }
          {...register(
            "confirmPassword"
          )}
        />

        {formError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        {formMessage && (
          <p className="rounded-md border border-[#4F7A57]/25 bg-[#4F7A57]/10 px-3 py-2 text-sm text-[#4F7A57]">
            {formMessage}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]"
          disabled={
            registerMutation.isPending
          }
        >
          {
            registerMutation.isPending
              ? "Creating account..."
              : "Create account"
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#7A623F] transition-colors hover:text-[#1E1E1E]"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
