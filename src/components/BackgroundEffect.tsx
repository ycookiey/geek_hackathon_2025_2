"use client";

import React from "react";

export default function BackgroundEffect() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:30px_30px] opacity-30"></div>
        </div>
    );
}
