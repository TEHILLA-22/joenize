"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string | undefined;
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, icon, type = "text", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "h-11 w-full rounded-md border bg-white px-4 py-2.5 text-sm text-[#1E1E1E]",
              "placeholder:text-[#1E1E1E]/40",
              "transition-colors duration-200",
              "focus:outline-none focus:border-[#C4A574]",
              "disabled:cursor-not-allowed disabled:bg-[#F5F3EF] disabled:text-[#1E1E1E]/40",
              error 
                ? "border-red-400 focus:border-red-400" 
                : "border-[#1E1E1E]/15 hover:border-[#C4A574]/50",
              icon ? "pl-9" : "pl-4",
              isPassword ? "pr-10" : "pr-4",
              className
            )}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40 hover:text-[#C4A574] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";
