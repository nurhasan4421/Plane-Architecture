"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Target mouse coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  // Interpolated smooth cursor coordinates
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable custom cursor on fine-pointer devices (desktop mice/trackpads, not touch)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;
    setIsFinePointer(true);

    document.body.classList.add("has-custom-cursor");

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor="interactive"]')
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // High performance 60/120fps lerp loop for fluid motion
    const renderLoop = () => {
      // Smooth lerp (0.28 factor gives ultra-responsive fluidity with no noticeable delay)
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.32;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.32;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[99999] will-change-transform transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      {/* Mini solid color ellipse that follows the cursor */}
      <div
        className={`rounded-full transition-all duration-200 ease-out ${
          isHoveringInteractive
            ? "h-7 w-7 bg-black/80 dark:bg-white/80 scale-100 backdrop-invert-0 shadow-sm"
            : isClicking
            ? "h-2 w-2.5 bg-black dark:bg-white scale-90"
            : "h-2.5 w-3 bg-black dark:bg-white scale-100 shadow-2xs"
        }`}
      />
    </div>
  );
}
