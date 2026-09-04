import { ImageResponse } from "next/og";

export const alt = "Maison Lilya Zahra — Beauty, rooted in Morocco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1c3225",
          color: "#e6d3bf",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            letterSpacing: 10,
            fontSize: 18,
            textTransform: "uppercase",
            color: "#e6d3bf",
          }}
        >
          <div style={{ fontSize: 14, letterSpacing: 12, opacity: 0.75 }}>Maison</div>
          <div style={{ fontSize: 28, letterSpacing: 8, fontFamily: "Georgia, serif" }}>
            Lilya Zahra
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 76, lineHeight: 0.95, fontFamily: "Georgia, serif" }}>
            For her & him.
          </div>
          <div style={{ fontSize: 22, color: "#c9b9a1", marginTop: 12 }}>
            A Moroccan beauty house. One scent. Seven objects.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
