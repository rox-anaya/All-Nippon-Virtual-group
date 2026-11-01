import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "tsconfig.json",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/components/Navigation.tsx",
  "src/components/Footer.tsx",
  "src/components/HomeCarousel.tsx",
  "src/components/HomeContentAdmin.tsx",
  "src/components/PublicLayout.tsx",
  "src/app/admin/page.tsx",
  "src/app/admin/home/page.tsx",
  "src/app/admin/dashboard/page.tsx",
  "src/lib/supabase/server.ts",
  "proxy.ts",
  "supabase/migrations/202611010001_initial_anvg_foundation.sql",
  "README.md",
  "public/manifest.webmanifest",
];
const routes = ["about", "staff", "pilots", "events", "fleet", "routes", "codeshare", "ranks", "training", "changelog", "settings", "apply"];
const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing required file: ${file}`);
}

for (const route of routes) {
  if (!fs.existsSync(path.join(root, "src/app", route, "page.tsx"))) failures.push(`Missing public route: /${route}`);
}

for (const jsonFile of ["package.json", "tsconfig.json", "public/manifest.webmanifest"]) {
  try { JSON.parse(fs.readFileSync(path.join(root, jsonFile), "utf8")); }
  catch (error) { failures.push(`Invalid JSON in ${jsonFile}: ${error.message}`); }
}

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|mjs|css|sql|md)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, "src"));
walk(path.join(root, "supabase"));
const joined = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const forbiddenHandle = ["ravi", "kumar"].join("");
if (new RegExp(forbiddenHandle, "i").test(joined)) failures.push("Private IFC username found in source files.");
if (/sb_secret_[A-Za-z0-9_]+|service_role\s*[:=]\s*['\"][^'\"]+/i.test(joined)) failures.push("Possible privileged Supabase secret found in source files.");
if (!joined.includes("Developed By") || !joined.includes("Anaya")) failures.push("Developer credit not found.");
if (!joined.includes("public.is_admin()")) failures.push("Admin database policy helper not found.");

const navSource = fs.readFileSync(path.join(root, "src/components/Navigation.tsx"), "utf8");
const stylesSource = fs.readFileSync(path.join(root, "src/app/site.css"), "utf8");
if (!navSource.includes("document.body.style.position = \"fixed\"") || !stylesSource.includes("overscroll-behavior: contain")) failures.push("Navigation background scroll-lock implementation is missing.");
if (navSource.includes("/admin")) failures.push("Admin route must not appear in public navigation component.");

const homeSource = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
for (const marker of ["ANVG • Waypoints Community Airline", "Operations Center", "https://waypoint-live.app/embed/va/all-nippon-virtual-airways", "Our Mission", "Fleet Showcase", "Ready to join?"]) {
  if (!homeSource.includes(marker)) failures.push(`Expected Home content missing: ${marker}`);
}
const homeAdminSource = fs.readFileSync(path.join(root, "src/components/HomeContentAdmin.tsx"), "utf8");
for (const marker of ["saveSettings", "saveMetrics", "replaceSlideImage", "handleShowcaseUpload", "footer_instagram_url", "menu_button_url"]) {
  if (!homeAdminSource.includes(marker)) failures.push(`Expected Home admin feature missing: ${marker}`);
}

const sql = fs.readFileSync(path.join(root, "supabase/migrations/202611010001_initial_anvg_foundation.sql"), "utf8");
for (const table of ["events", "news_items", "operating_locations", "operational_routes", "airline_divisions", "aircraft", "staff_members", "pilot_profiles", "pilot_ranks", "training_stages", "recruitment_steps", "codeshare_partners", "change_log_entries", "page_announcements", "application_prerequisites", "application_steps"]) {
  if (!sql.includes(`'${table}'`) && !sql.includes(`public.${table}`)) failures.push(`Expected schema table missing: ${table}`);
}
if (!sql.includes("ANVG admin media insert") || !sql.includes("ANVG public media read")) failures.push("Storage policy names are missing.");
if (!sql.includes("alter table public.admin_users enable row level security")) failures.push("Administrator allowlist RLS is missing.");
if (/create policy[^;]+on public\.admin_users[^;]+for all/i.test(sql)) failures.push("Unsafe admin allowlist write policy found.");

if (failures.length) {
  console.error("Foundation validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Foundation validation passed: ${requiredFiles.length} required files, ${routes.length} public route shells, Home/admin markers, JSON manifests and security schema markers.`);
}
