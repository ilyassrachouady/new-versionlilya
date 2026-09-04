import { ImageResponse } from "next/og";

export const alt = "Maison Liya Zahra — Beauty, rooted in Morocco";
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
          background: "#241815",
          color: "#F3EDE3",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            letterSpacing: 8,
            fontSize: 18,
            textTransform: "uppercase",
            color: "#A77A45",
          }}
        >
          Maison Liya Zahra
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 84, lineHeight: 0.95, fontFamily: "Georgia, serif" }}>
            Beauty, rooted in Morocco.
          </div>
          <div style={{ fontSize: 22, color: "#C9B9A1", marginTop: 12 }}>
            A Moroccan beauty house. One scent. Seven objects.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
