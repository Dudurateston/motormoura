import React, { useState } from "react";

export default function LazyImage({
  src,
  alt = "",
  className = "",
  style = {},
  placeholderStyle = {},
  placeholder = null,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      {/* Skeleton shown until image loads */}
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
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full"
          style={{
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "block",
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
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