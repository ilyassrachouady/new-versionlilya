/**
 * Object-bounding-box clip paths for the house's two architectural crops.
 * Rendered once, at the top of the document, and referenced from CSS.
 */
export function ArchDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <clipPath id="mlz-arch" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.58 C0,0.30 0.16,0.10 0.5,0 C0.84,0.10 1,0.30 1,0.58 L1,1 Z" />
        </clipPath>
        <clipPath id="mlz-arch-keyhole" clipPathUnits="objectBoundingBox">
          <path d="M0.06,1 L0.06,0.60 C0.06,0.42 0,0.36 0,0.30 C0,0.13 0.22,0 0.5,0 C0.78,0 1,0.13 1,0.30 C1,0.36 0.94,0.42 0.94,0.60 L0.94,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
