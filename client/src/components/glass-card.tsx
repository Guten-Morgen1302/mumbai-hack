import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "glass" | "glass-dark";
}

export default function GlassCard({ 
  children, 
  className, 
  variant = "glass",
  ...props 
}: GlassCardProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl p-6",
        variant === "glass" ? "glass" : "glass-dark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
