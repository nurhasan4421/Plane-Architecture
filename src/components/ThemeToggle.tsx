"use client";

import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const isTransitioningRef = useRef(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioningRef.current) return;

    // Trigger icon micro-rotation animation
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 900);

    // Get the exact center of the button for the bloom origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate distance to the furthest corner of viewport so the bloom covers the entire screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const doc =
      typeof document !== "undefined"
        ? (document as Document & {
            startViewTransition?: (callback: () => void | Promise<void>) => {
              ready: Promise<void>;
              finished: Promise<void>;
            };
          })
        : null;

    // Target theme:
    // When currently dark -> switching to light, white color blooms from icon across screen
    // When currently light -> switching to dark, dark color blooms from icon across screen
    const nextTheme = isDark ? "light" : "dark";

    if (!doc?.startViewTransition || isReducedMotion) {
      if (!isReducedMotion && typeof document !== "undefined") {
        isTransitioningRef.current = true;
        const bloomEl = document.createElement("div");
        bloomEl.className =
          "pointer-events-none fixed z-[99999] rounded-full transition-transform ease-out";
        bloomEl.style.top = `${y}px`;
        bloomEl.style.left = `${x}px`;
        bloomEl.style.width = "4px";
        bloomEl.style.height = "4px";
        bloomEl.style.transform = "translate(-50%, -50%) scale(0)";
        bloomEl.style.backgroundColor = nextTheme === "dark" ? "#303030" : "#ffffff";
        bloomEl.style.transition =
          "transform 950ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease";
        document.body.appendChild(bloomEl);

        // Force reflow
        bloomEl.getBoundingClientRect();

        const scale = (endRadius * 2.2) / 4;
        bloomEl.style.transform = `translate(-50%, -50%) scale(${scale})`;

        setTimeout(() => {
          toggleTheme();
          setTimeout(() => {
            bloomEl.style.opacity = "0";
            setTimeout(() => {
              bloomEl.remove();
              isTransitioningRef.current = false;
            }, 250);
          }, 150);
        }, 800);
        return;
      }

      toggleTheme();
      return;
    }

    // Native View Transition circular bloom
    isTransitioningRef.current = true;

    try {
      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          toggleTheme();
        });
      });

      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          const animation = document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 950,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );

          animation.onfinish = () => {
            isTransitioningRef.current = false;
          };
        })
        .catch(() => {
          isTransitioningRef.current = false;
        });

      transition.finished
        .then(() => {
          isTransitioningRef.current = false;
        })
        .catch(() => {
          isTransitioningRef.current = false;
        });
    } catch {
      toggleTheme();
      isTransitioningRef.current = false;
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-black dark:text-white transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 cursor-pointer focus:outline-none ${className}`}
    >
      <span className="absolute inset-0 rounded-full scale-0 transition-transform duration-300 group-active:scale-125 bg-black/5 dark:bg-white/10 pointer-events-none" />
      {isDark ? (
        <Sun
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-100 transition-transform duration-700 ${
            isRotating ? "rotate-180 scale-110" : "group-hover:rotate-45"
          }`}
        />
      ) : (
        <Moon
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-800 transition-transform duration-700 ${
            isRotating ? "-rotate-90 scale-110" : "group-hover:-rotate-12"
          }`}
        />
      )}
    </button>
  );
}
