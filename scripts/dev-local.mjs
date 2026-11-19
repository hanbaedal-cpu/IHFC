import { spawn } from "child_process";
import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri("ihfc");

process.env.MONGODB_URI = uri;
process.env.AUTH_SECRET =
  process.env.AUTH_SECRET || "ihfc-dev-secret-change-in-production-32chars";
process.env.ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

console.log("[local] In-memory MongoDB started");
console.log(`[local] ${uri}`);

const child = spawn("npx", ["tsx", "scripts/seed.ts"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

await new Promise((resolvePromise, reject) => {
  child.on("exit", (code) => {
    if (code === 0) resolvePromise(undefined);
    else reject(new Error(`seed failed: ${code}`));
  });
});

const next = spawn("npx", ["next", "dev", "--port", "3000"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

const shutdown = async () => {
  next.kill("SIGTERM");
  await mongod.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

next.on("exit", async (code) => {
  await mongod.stop();
  process.exit(code ?? 0);
});
