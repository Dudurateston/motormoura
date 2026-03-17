import React, { useRef, useState, useEffect } from "react";

/**
 * LazyImage — loads the image only when it enters the viewport.
 * Shows a skeleton placeholder while loading.
 */
export default function LazyImage({
  src,
  alt = "",
  className = "",
  style = {},
  placeholderStyle = {},
  placeholder = null,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    const el = ref.current;
    if (!el) return;

    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" } // preload 200px before entering viewport
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      {/* Skeleton */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
            ...placeholderStyle,
          }}
        >
          {placeholder}
        </div>
      )}
      {/* Actual image — only set src once visible */}
      {visible && src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onLoad={() => setLoaded(true)}
        />
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}