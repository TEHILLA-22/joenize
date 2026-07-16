import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div className="rounded-lg border border-[#D8D3CC] bg-white p-5 shadow-sm transition-shadow duration-300 sm:p-7">
      <h1 className="text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">
        {title}
      </h1>

      <p className="mt-2 text-sm text-[#6B6B6B]">
        {description}
      </p>

      <div className="mt-6 sm:mt-8">
        {children}
      </div>
    </div>
  );
}
