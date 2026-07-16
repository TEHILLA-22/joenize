import {
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  GitCompare,
  PackageOpen,
  Search,
  Send,
} from "lucide-react";

const steps = [
  { label: "Discover", icon: Search },
  { label: "Browse", icon: Boxes },
  { label: "Compare", icon: GitCompare },
  { label: "RFQ/Buy", icon: Send },
  { label: "Track", icon: ClipboardCheck },
  { label: "Receive", icon: PackageOpen },
  { label: "Rate", icon: BadgeCheck },
];

export function ProcurementFlow() {
  return (
    <section className="rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#1E1E1E]">
            Procurement Flow
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            The buyer journey from supplier discovery to post-delivery rating.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Connecting line background */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-[#D8D3CC] hidden sm:block"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D8D3CC] bg-white text-[#6B6B6B] transition-colors group-hover:border-[#4F7A57] group-hover:text-[#4F7A57] shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col sm:items-center">
                  <span className="text-sm font-medium text-[#1E1E1E]">
                    {step.label}
                  </span>
                  <span className="text-xs text-[#6B6B6B] sm:hidden">
                    Step {index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
