import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.writeFileSync(
    path.join(__dirname, "../lib/esm/package.json"),
    JSON.stringify({
        type: "module",
    })
);

fs.writeFileSync(
    path.join(__dirname, "../lib/cjs/package.json"),
    JSON.stringify({
        type: "commonjs",
    })
);
