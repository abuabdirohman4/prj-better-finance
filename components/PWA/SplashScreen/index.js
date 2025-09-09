"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 transition-opacity duration-500 ${
                isAnimating ? "opacity-0" : "opacity-100"
            }`}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center">
                {/* Logo with animation */}
                <div
                    className={`mb-8 transition-all duration-1000 ${
                        isAnimating
                            ? "scale-75 opacity-0"
                            : "scale-100 opacity-100"
                    }`}
                >
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <Image
                            src="/img/logo.svg"
                            alt="Better Finance Logo"
                            fill
                            className="drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>

                {/* App name */}
                <h1
                    className={`text-4xl font-bold text-white mb-2 transition-all duration-1000 delay-300 ${
                        isAnimating
                            ? "translate-y-4 opacity-0"
                            : "translate-y-0 opacity-100"
                    }`}
                >
                    Better Finance
                </h1>

                {/* Tagline */}
                <p
                    className={`text-lg text-blue-100 transition-all duration-1000 delay-500 ${
                        isAnimating
                            ? "translate-y-4 opacity-0"
                            : "translate-y-0 opacity-100"
                    }`}
                >
                    Manage your money smarter
                </p>

                {/* Loading indicator */}
                <div
                    className={`mt-8 transition-all duration-1000 delay-700 ${
                        isAnimating ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
                        <div
                            className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                            className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Bottom text */}
            <div
                className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 delay-1000 ${
                    isAnimating ? "opacity-0" : "opacity-100"
                }`}
            >
                <p className="text-sm text-blue-200">
                    Created By Abu Abdirohman
                </p>
            </div>
        </div>
    );
}
