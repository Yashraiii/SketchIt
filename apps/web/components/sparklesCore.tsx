"use client";

import React from "react";
import { SparklesCore } from "./ui/sparkles";

interface SparklesBackgroundProps {
  children: React.ReactNode;
  particleColor?: string;
  particleDensity?: number;
}

export default function SparklesBackground({
  children,
  particleColor = "#818cf8", // subtle indigo sparkle
  particleDensity = 60,
}: SparklesBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] overflow-x-hidden">
      {/* Background Particles Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <SparklesCore
          id="bg-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          speed={1}
          particleDensity={particleDensity}
          className="w-full h-full"
          particleColor={particleColor}
        />
      </div>

      {/* Foreground Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}