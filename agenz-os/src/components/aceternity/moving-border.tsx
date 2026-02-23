"use client";

import React, { useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

export function MovingBorderCard({
  children,
  duration = 3000,
  className,
  containerClassName,
  borderClassName,
  as: Tag = "div",
  ...otherProps
}: MovingBorderProps) {
  return (
    <Tag
      className={cn(
        "relative h-auto w-full overflow-hidden rounded-2xl p-[1px]",
        containerClassName
      )}
      {...otherProps}
    >
      <MovingBorder duration={duration} rx="16px" ry="16px">
        <div
          className={cn(
            "h-16 w-16 opacity-[0.8] bg-[radial-gradient(var(--agenz-cyan)_40%,transparent_60%)]",
            borderClassName
          )}
        />
      </MovingBorder>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-2xl bg-card text-card-foreground",
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

function MovingBorder({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
