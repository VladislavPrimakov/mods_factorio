import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function release() {
  console.log("[Release] Reading package.json...");
  const pkgPath = path.join(__dirname, "package.json");
  const pkgInfo = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const version = pkgInfo.version;
  const modName = pkgInfo.name;

  if (!version) {
    console.error("No version found in package.json");
    process.exit(1)
  }

  console.log(`[Release] Mod: ${modName}, Version: ${version}`);
  console.log("[Release] Updating static/info.json...");
  const infoPath = path.join(__dirname, "static", "info.json");
  if (fs.existsSync(infoPath)) {
    const infoJson = JSON.parse(fs.readFileSync(infoPath, "utf8"));
    infoJson.version = version;
    fs.writeFileSync(infoPath, JSON.stringify(infoJson, null, 2) + "\n");
  }

  console.log("[Release] Building fcore mod...");
  execSync("npm run build", { stdio: "inherit", cwd: __dirname });

  const releaseFolderName = `fcore_${version}`;
  const distPath = path.join(__dirname, "dist");
  const tempDir = path.join(__dirname, "dist_temp_release");
  const tempReleasePath = path.join(tempDir, releaseFolderName);
  const releasesDir = path.join(__dirname, "releases");
  const zipName = `${releaseFolderName}.zip`;
  const zipPath = path.join(releasesDir, zipName);

  if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir, { recursive: true });
  }

  console.log(`[Release] Preparing release folder: ${releaseFolderName}...`);
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempReleasePath, { recursive: true });
  fs.cpSync(distPath, tempReleasePath, { recursive: true });

  // Remove typescript declaration and map files from factorio mod zip
  function cleanupDevFiles(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        cleanupDevFiles(full);
      } else if (entry.isFile() && (entry.name.endsWith('.d.ts') || entry.name.endsWith('.tsbuildinfo') || entry.name.endsWith('.js.map'))) {
        fs.rmSync(full, { force: true });
      }
    }
  }
  cleanupDevFiles(tempReleasePath);

  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath, { force: true });
  }

  console.log(`[Release] Zipping to releases/${zipName}...`);
  const psCommand = `Compress-Archive -Path "${tempReleasePath}" -DestinationPath "${zipPath}" -Force`;
  execSync(`powershell -Command "${psCommand}"`, { stdio: "inherit" });

  console.log("[Release] Cleaning up temporary folder...");
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log(`[Release] Done! Archive created at: ${zipPath}`);
}

release().catch((err) => {
  console.error(err);
  process.exit(1);
});
