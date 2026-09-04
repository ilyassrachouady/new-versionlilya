import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#541D1B",
          color: "#C9B9A1",
          fontSize: 13,
          letterSpacing: 1,
          fontFamily: "Georgia, serif",
        }}
      >
        LZ
      </div>
    ),
    { ...size },
  );
}
