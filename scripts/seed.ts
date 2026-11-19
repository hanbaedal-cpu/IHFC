import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config();

import { ensureAdminSeed } from "../src/lib/auth";
import { connectDB } from "../src/lib/mongodb";
import { getSiteSettings } from "../src/models/SiteSettings";

async function main() {
  await connectDB();
  const admin = await ensureAdminSeed();
  await getSiteSettings();
  console.log("Seed complete");
  console.log(`Admin username: ${admin.username}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD || "admin1234"}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
