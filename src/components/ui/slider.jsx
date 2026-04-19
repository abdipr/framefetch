import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A robust, beautifully styled native range slider that matches the Shadcn aesthetic.
 * This replaces the unstable library-based slider to guarantee draggability and performance.
 */
function Slider({
  className,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}) {
  const val = Array.isArray(value) ? value[0] : value;
  
  // Calculate percentage for the custom track gradient
  const percentage = ((val - min) / (max - min)) * 100;

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <div className={cn("relative w-full flex items-center group", className)}>
      {/* Visual Track (Progress) */}
      <div 
        className="absolute h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden pointer-events-none"
      >
        <div 
          className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-150 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* The Actual Hidden Range Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
        {...props}
      />

      {/* Visual Thumb */}
      <div 
        className="absolute h-4 w-4 bg-white dark:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-md pointer-events-none transition-transform group-active:scale-125"
        style={{ 
          left: `calc(${percentage}% - 8px)`,
          transition: "left 0.15s ease-out, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
      />
    </div>
  );
}

export { Slider };
