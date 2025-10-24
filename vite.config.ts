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
                        void fs
                            .readFile(mockFilePath, "utf-8")
                            .then((content) => {
                                console.log(`📖 [GET] Loaded ${content.length} bytes`);
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
                        let rawBody = "";

                        req.on("data", (chunk) => {
                            rawBody += chunk;
                        });

                        req.on("end", () => {
                            try {
                                const payload = JSON.parse(rawBody || "{}");

                                void fs
                                    .writeFile(
                                        mockFilePath,
                                        `${JSON.stringify(payload, null, 4)}\n`,
                                        "utf-8",
                                    )
                                    .then(() => {
                                        console.log(`💾 [POST] Saved ${payload.tasks?.length || 0} tasks, ${payload.links?.length || 0} links`);
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.end(JSON.stringify({ status: "ok" }));
                                    })
                                    .catch((error) => {
                                        console.error("❌ [POST] Write error:", (error as Error).message);
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
                                console.error("❌ [POST] Parse error:", (error as Error).message);
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
