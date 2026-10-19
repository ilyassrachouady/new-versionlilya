"use client";

import { useState } from "react";
import { previousRevenuePoints, revenuePoints } from "@/lib/admin-data";

function pathFor(values: number[], width: number, height: number) {
  const min = 25, max = 190;
  return values.map((value, index) => `${index ? "L" : "M"} ${(index / (values.length - 1)) * width} ${height - ((value - min) / (max - min)) * height}`).join(" ");
}

export function RevenueChart() {
  const [active, setActive] = useState(13);
  const width = 900, height = 250;
  const x = (active / (revenuePoints.length - 1)) * width;
  const y = height - ((revenuePoints[active] - 25) / 165) * height;
  return <div className="relative mt-8 overflow-hidden">
    <div className="absolute end-0 top-0 z-10 border border-[#d3c8b9] bg-[#faf7f1] px-3 py-2 text-xs shadow-sm"><span className="text-[#8d8075]">11 oct.</span><strong className="admin-serif ms-3 text-base font-normal">2,180 MAD</strong></div>
    <svg viewBox={`0 0 ${width} ${height + 30}`} className="h-[18rem] w-full overflow-visible" role="img" aria-label="Le chiffre d’affaires progresse sur la période sélectionnée">
      {[0,1,2,3].map((line) => <line key={line} x1="0" x2={width} y1={line * 70 + 12} y2={line * 70 + 12} stroke="#d8cfc1" strokeWidth="1" />)}
      <path d={pathFor(previousRevenuePoints, width, height)} fill="none" stroke="#b9ad9f" strokeWidth="1.5" strokeDasharray="5 7" />
      <path d={`${pathFor(revenuePoints, width, height)} L ${width} ${height} L 0 ${height} Z`} fill="url(#area)" opacity=".32" />
      <path d={pathFor(revenuePoints, width, height)} fill="none" stroke="#263a2c" strokeWidth="2.5" />
      <line x1={x} x2={x} y1="0" y2={height} stroke="#8e806f" strokeWidth="1" />
      <circle cx={x} cy={y} r="5" fill="#f4efe7" stroke="#263a2c" strokeWidth="2" />
      {revenuePoints.map((_, index) => <rect key={index} x={(index / revenuePoints.length) * width} y="0" width={width / revenuePoints.length} height={height} fill="transparent" onMouseEnter={() => setActive(index)} />)}
      <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6e806b" /><stop offset="1" stopColor="#6e806b" stopOpacity="0" /></linearGradient></defs>
      <g fill="#8c8075" fontSize="11">{["28 sept.","1 oct.","4 oct.","7 oct.","11 oct."].map((label,index) => <text key={label} x={(index/4)*width} y={height+26} textAnchor={index === 0 ? "start" : index === 4 ? "end" : "middle"}>{label}</text>)}</g>
    </svg>
  </div>;
}
