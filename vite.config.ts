import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const CHAT_MODEL = "openai/gpt-oss-20b";

function chatApiDevPlugin(apiKey: string | undefined): Plugin {
  return {
    name: "chat-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/chat" || req.method !== "POST") {
          return next();
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          res.setHeader("Content-Type", "application/json");

          if (!apiKey) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: "Missing GROQ_API_KEY. Add it to your .env file.",
              })
            );
            return;
          }

          try {
            const { messages } = JSON.parse(body);
            if (!Array.isArray(messages) || messages.length === 0) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Messages must be a non-empty array" }));
              return;
            }

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: CHAT_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 300,
              }),
            });

            const data = await response.json();
            res.statusCode = response.status;
            res.end(JSON.stringify(data));
          } catch (error) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: "Internal Server Error",
                details: error instanceof Error ? error.message : "Unknown error",
              })
            );
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
  plugins: [react(), chatApiDevPlugin(env.GROQ_API_KEY)],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', 'three-stdlib'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'gsap': ['gsap'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap', 'lenis']
  }
};
});
