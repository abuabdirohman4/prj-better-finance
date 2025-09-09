#!/usr/bin/env node

const fs = require("fs");

// Simple environment variable loader
function loadEnv() {
    try {
        const envContent = fs.readFileSync(".env", "utf8");
        const envVars = {};

        envContent.split("\n").forEach((line) => {
            if (line.includes("=") && !line.startsWith("#")) {
                const [key, value] = line.split("=");
                envVars[key.trim()] = value.trim();
            }
        });

        return envVars;
    } catch (error) {
        console.log("Using default values (localhost)");
        return { NEXT_PUBLIC_APP_URL: "http://localhost:3000" };
    }
}

// Load environment variables
const env = loadEnv();
const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

console.log("🔧 Building PWA...");
console.log("App URL:", appUrl);

// Update robots.txt
try {
    const robotsPath = "public/robots.txt";
    let content = fs.readFileSync(robotsPath, "utf8");
    content = content.replace("{{APP_URL}}", appUrl);
    fs.writeFileSync(robotsPath, content);
    console.log("✅ Updated robots.txt");
} catch (error) {
    console.error("❌ Error updating robots.txt:", error.message);
}

console.log("🎉 PWA build preparation completed!");
console.log("Now run: npm run build");
