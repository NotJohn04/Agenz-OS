"use client";

import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  gradient?: "blue-cyan" | "cyan-purple" | "purple-blue" | "green-blue" | "red-orange";
}

const gradients = {
  "blue-cyan": "from-[#3b82f6] via-[#06b6d4] to-[#3b82f6]",
  "cyan-purple": "from-[#06b6d4] via-[#8b5cf6] to-[#06b6d4]",
  "purple-blue": "from-[#8b5cf6] via-[#3b82f6] to-[#8b5cf6]",
  "green-blue": "from-[#10b981] via-[#3b82f6] to-[#10b981]",
  "red-orange": "from-[#ef4444] via-[#f97316] to-[#ef4444]",
};

export function BackgroundGradientCard({
  children,
  className,
  containerClassName,
  animate = true,
  gradient = "blue-cyan",
}: BackgroundGradientProps) {
  return (
    <div className={cn("group relative p-[1px] rounded-2xl", containerClassName)}>
      {/* Gradient border */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-50 group-hover:opacity-80 transition-opacity duration-300",
          gradients[gradient],
          animate && "animate-gradient"
        )}
      />
      {/* Blur glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-r blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300",
          gradients[gradient]
        )}
      />
      {/* Content */}
      <div
        className={cn(
          "relative rounded-2xl bg-card p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function GradientText({
  children,
  gradient = "blue-cyan",
  className,
}: {
  children: React.ReactNode;
  gradient?: "blue-cyan" | "cyan-purple" | "purple-blue" | "green-blue";
  className?: string;
}) {
  const textGradients = {
    "blue-cyan": "from-[#3b82f6] to-[#06b6d4]",
    "cyan-purple": "from-[#06b6d4] to-[#8b5cf6]",
    "purple-blue": "from-[#8b5cf6] to-[#3b82f6]",
    "green-blue": "from-[#10b981] to-[#3b82f6]",
  };

  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        textGradients[gradient],
        className
      )}
    >
      {children}
    </span>
  );
}
