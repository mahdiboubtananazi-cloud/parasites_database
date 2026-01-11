// scripts/analyze.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// جذر المشروع
const root = path.join(__dirname, '..');
// مجلد التقارير
const reportsDir = path.join(root, 'reports');

// إنشاء مجلد reports إن لم يكن موجودًا
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

function runTool(name, cmd, outFile) {
  console.log(`\n=== Running ${name} ===`);
  let result = '';
  try {
    result = execSync(cmd, {
      cwd: root,
      encoding: 'utf8',
      stdio: 'pipe'
    });
  } catch (err) {
    // لا نوقف السكربت، فقط نحفظ ما خرج من الأداة
    result =
      (err.stdout && err.stdout.toString()) ||
      (err.stderr && err.stderr.toString()) ||
      String(err);
  }

  if (outFile) {
    fs.writeFileSync(path.join(reportsDir, outFile), result, 'utf8');
  }
  return result;
}

// أوامر الأدوات
const eslintCmd = 'npx eslint "src/**/*.{ts,tsx,js,jsx}" -f json';
const depcheckCmd = 'npx depcheck';
const tsPruneCmd = 'npx ts-prune -p tsconfig.json';
const madgeCmd = 'npx madge --circular src';

// تشغيل الأدوات
const eslintOutput = runTool('ESLint', eslintCmd, 'eslint_report.json');
const depcheckOutput = runTool('depcheck', depcheckCmd, 'depcheck.txt');
const tsPruneOutput = runTool('ts-prune', tsPruneCmd, 'ts-prune.txt');
const madgeOutput = runTool('madge', madgeCmd, 'madge.txt');

// محاولة تنسيق مخرجات ESLint كـ JSON جميل
let eslintPretty = eslintOutput;
try {
  eslintPretty = JSON.stringify(JSON.parse(eslintOutput), null, 2);
} catch {
  // لو فشل التحويل لـ JSON نتركها كما هي
}

const reportMd = `# Technical Analysis Report

Generated: ${new Date().toISOString()}

## 1. ESLint Report (Code Quality)
\`\`\`json
${eslintPretty}
\`\`\`

---

## 2. Unused Dependencies (depcheck)
\`\`\`
${depcheckOutput}
\`\`\`

---

## 3. Unused/Unreferenced TS Exports (ts-prune)
\`\`\`
${tsPruneOutput}
\`\`\`

---

## 4. Circular Dependencies (madge)
\`\`\`
${madgeOutput}
\`\`\`

---

## Notes

- This report is auto-generated from static analysis tools.
- Open this file in Cursor and ask @Codebase to summarize and propose improvements.
`;

fs.writeFileSync(path.join(root, 'FULL_REPORT.md'), reportMd, 'utf8');
console.log('\nFULL_REPORT.md generated at project root.');