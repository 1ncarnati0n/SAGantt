import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mockFilePath = path.resolve(__dirname, "public/mock.json");

export default defineConfig({
    plugins: [
        react(),
        {
            name: "mock-writer",
            apply: "serve",
            configureServer(server) {
                server.middlewares.use("/api/mock", (req, res, next) => {
                    if (!req.method) {
                        next();
                        return;
                    }

                    if (req.method === "OPTIONS") {
                        res.statusCode = 204;
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
                        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                        res.end();
                        return;
                    }

                    if (req.method === "GET") {
                        console.log("🔵 [API] GET /api/mock - Request received");
                        console.log("🔵 [API] Reading from:", mockFilePath);
                        void fs
                            .stat(mockFilePath)
                            .then((stats) => {
                                console.log("🔵 [API] File stats before read:", {
                                    size: stats.size,
                                    modified: stats.mtime.toISOString()
                                });
                                return fs.readFile(mockFilePath, "utf-8");
                            })
                            .then((content) => {
                                console.log("✅ [API] File read successfully, size:", content.length);
                                console.log("✅ [API] First 100 chars:", content.substring(0, 100));
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
                                res.setHeader("Pragma", "no-cache");
                                res.setHeader("Expires", "0");
                                res.end(content);
                            })
                            .catch((error) => {
                                res.statusCode = 500;
                                res.setHeader("Content-Type", "application/json");
                                res.end(
                                    JSON.stringify({
                                        status: "error",
                                        message: (error as Error).message,
                                    }),
                                );
                            });

                        return;
                    }

                    if (req.method === "POST") {
                        console.log("🔵 [API] POST /api/mock - Request received");
                        let rawBody = "";

                        req.on("data", (chunk) => {
                            rawBody += chunk;
                        });

                        req.on("end", () => {
                            try {
                                console.log("🔵 [API] Received body length:", rawBody.length);
                                const payload = JSON.parse(rawBody || "{}");
                                console.log("🔵 [API] Parsed payload:", {
                                    tasks: payload.tasks?.length || 0,
                                    links: payload.links?.length || 0,
                                    scales: payload.scales?.length || 0,
                                });
                                console.log("🔵 [API] Writing to:", mockFilePath);

                                void fs
                                    .writeFile(
                                        mockFilePath,
                                        `${JSON.stringify(payload, null, 4)}\n`,
                                        "utf-8",
                                    )
                                    .then(() => {
                                        console.log("✅ [API] File written successfully");
                                        // 파일이 실제로 변경되었는지 확인
                                        return fs.stat(mockFilePath);
                                    })
                                    .then((stats) => {
                                        console.log("✅ [API] File stats:", {
                                            size: stats.size,
                                            modified: stats.mtime.toISOString()
                                        });
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.end(JSON.stringify({ status: "ok" }));
                                    })
                                    .catch((error) => {
                                        console.error("❌ [API] Write error:", error);
                                        res.statusCode = 500;
                                        res.setHeader("Content-Type", "application/json");
                                        res.end(
                                            JSON.stringify({
                                                status: "error",
                                                message: (error as Error).message,
                                            }),
                                        );
                                    });
                            } catch (error) {
                                console.error("❌ [API] Parse error:", error);
                                res.statusCode = 400;
                                res.setHeader("Content-Type", "application/json");
                                res.end(
                                    JSON.stringify({
                                        status: "error",
                                        message: (error as Error).message,
                                    }),
                                );
                            }
                        });

                        return;
                    }

                    next();
                });
            },
        },
    ],
});
