"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Target mouse coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  // Interpolated smooth cursor coordinates
  const currentPos = useRef({ x: -100, y: -100 });
  const isClickingRef = useRef(false);

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

      // If user is currently dragging/holding to select text, lock directly to mouse with zero lag
      if (isClickingRef.current) {
        currentPos.current.x = e.clientX;
        currentPos.current.y = e.clientY;
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
      }

      // Check target element
      const target = e.target as HTMLElement | null;
      if (target) {
        // Interactive: links, buttons, form controls
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor="interactive"]')
        );
        setIsHoveringInteractive(isInteractive);

        // Text elements: headings, paragraphs, spans, blockquotes, list items, etc.
        const isText = !isInteractive && Boolean(
          target.closest('p, h1, h2, h3, h4, h5, h6, span, article, blockquote, li, dt, dd, figcaption, td, th')
        );
        setIsHoveringText(isText);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      // Only track primary (left) button for dragging/selection
      if (e.button === 0) {
        setIsClicking(true);
        isClickingRef.current = true;
        // Snap instantly so drag selection starts at the exact pixel
        currentPos.current.x = mousePos.current.x;
        currentPos.current.y = mousePos.current.y;
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
        }
      }
    };

    const onMouseUp = () => {
      setIsClicking(false);
      isClickingRef.current = false;
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // High performance animation loop
    const renderLoop = () => {
      if (isClickingRef.current) {
        // While dragging/selecting, lock 100% to pointer coordinates (zero lag)
        currentPos.current.x = mousePos.current.x;
        currentPos.current.y = mousePos.current.y;
      } else {
        // Smooth responsive follow
        currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.45;
        currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.45;
      }

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
      className={`pointer-events-none select-none fixed left-0 top-0 z-[99999] will-change-transform transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      {/* Mini solid color ellipse */}
      <div
        className={`pointer-events-none select-none rounded-full transition-all duration-150 ease-out ${
          isHoveringInteractive
            ? "h-7 w-7 bg-black/80 dark:bg-white/80 scale-100 shadow-sm"
            : isClicking
            ? isHoveringText
              ? "h-4 w-1.5 bg-black dark:bg-white shadow-2xs"
              : "h-2 w-2.5 bg-black dark:bg-white scale-90"
            : isHoveringText
            ? "h-4 w-1.5 bg-black dark:bg-white shadow-2xs"
            : "h-2.5 w-3 bg-black dark:bg-white scale-100 shadow-2xs"
        }`}
      />
    </div>
  );
}
