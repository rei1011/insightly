/**
 * HTMLファイルから給与データを抽出し、
 * company, occupation, salary テーブルに投入するスクリプト
 *
 * 実行: npx tsx scripts/import-salary-from-html.ts [path]
 * path: 省略時は ./salary。単一HTMLファイルまたはディレクトリを指定可能
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PATH = path.join(process.cwd(), "salary");

interface ParsedSalaryCard {
  companyId: number;
  salaryId: string;
  companyName: string;
  occupationName: string;
  age: number;
  grade: string | null;
  overtimeHours: number | null;
  annualSalary: number;
  baseSalary: number;
  bonus: number | null;
  stockOptions: number | null;
  rsu: number | null;
}

/**
 * 万円表記の文字列を数値に変換
 * "800万", "800万円", "1,200万" → 800, 800, 1200
 */
function parseManAmount(text: string | undefined): number | null {
  if (!text || text.includes("非公開") || text.trim() === "") return null;
  const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*万/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * 残業時間をパース（"20時間" など）
 */
function parseOvertimeHours(text: string | undefined): number | null {
  if (!text || text.includes("非公開") || text.trim() === "") return null;
  const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*時間?/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * 給与カードのHTMLからデータを抽出
 */
function parseSalaryCard(
  $: cheerio.CheerioAPI,
  card: Element
): ParsedSalaryCard | null {
  const $card = $(card);

  // salary ID: カードの href="/salaries/{id}" から抽出
  const cardHref = $card.attr("href") ?? "";
  const salaryIdMatch = cardHref.match(/\/salaries\/([^/]+)/);
  const salaryId = salaryIdMatch ? salaryIdMatch[1] : "";
  if (!salaryId) return null;

  // company ID: カード内または親要素内の a[href^="/corporations/"] から抽出
  // ネストされたaタグはHTMLとして無効なため、パーサが構造を変える場合がある
  let corpLink =
    $card.find('a[href^="/corporations/"]').first().attr("href") ?? "";
  if (!corpLink) {
    corpLink =
      $card.parent().find('a[href^="/corporations/"]').first().attr("href") ??
      "";
  }
  const companyIdMatch = corpLink.match(/\/corporations\/(\d+)/);
  const companyId = companyIdMatch ? parseInt(companyIdMatch[1], 10) : NaN;
  if (isNaN(companyId)) return null;

  const ariaLabel = $card.attr("aria-label") ?? "";
  const cardText = $card.text();

  // 会社名: aria-label から "XXXの詳しい年収" の XXX を抽出
  const companyMatch = ariaLabel.match(/^(.+?)の詳しい年収/);
  const companyName = companyMatch ? companyMatch[1].trim() : "";
  if (!companyName) return null;

  // 年齢: XX歳
  const ageMatch = cardText.match(/(\d{2})歳/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : 0;
  if (age < 18 || age > 70) return null;

  // 職種: 職種ラベル直後のテキスト、またはカード内の候補から抽出
  let occupationName = "不明";
  const occupationMatch = cardText.match(
    /職種\s*[：:]\s*([^\s年収基本給賞与残業]+)/
  );
  if (occupationMatch) {
    occupationName = occupationMatch[1].trim();
  } else {
    const occupationCandidates = [
      "ソフトウェアエンジニア",
      "プロダクトマネージャー",
      "データサイエンティスト",
      "エンジニア",
      "マネージャー",
      "デザイナー",
      "PM",
      "開発者",
    ];
    for (const occ of occupationCandidates) {
      if (cardText.includes(occ)) {
        occupationName = occ;
        break;
      }
    }
  }

  // グレード
  const gradePatterns = [
    "シニア",
    "ミドル",
    "ジュニア",
    "スタッフ",
    "マネージャー",
    "リード",
  ];
  let grade: string | null = null;
  for (const g of gradePatterns) {
    if (cardText.includes(g)) {
      grade = g;
      break;
    }
  }

  // 給与数値: ラベルに続く数値を探索
  // 年収・基本給は必須。カード内の数値パターンから抽出を試みる
  const manAmounts = [...cardText.matchAll(/(\d+(?:,\d+)*)\s*万/g)].map((m) =>
    parseFloat(m[0].replace(/,/g, "").replace("万", ""))
  );

  // 年収・基本給・賞与の順で表示されることが多い。最初の2つを年収・基本給とする
  const annualSalary = manAmounts[0] ?? 0;
  const baseSalary = manAmounts[1] ?? manAmounts[0] ?? 0;
  if (annualSalary === 0 || baseSalary === 0) return null;

  // 賞与・残業・RSU・ストックオプション
  let bonus: number | null = null;
  let overtimeHours: number | null = null;
  let rsu: number | null = null;
  let stockOptions: number | null = null;

  // 賞与
  const bonusIdx = cardText.indexOf("賞与");
  if (bonusIdx >= 0) {
    const afterBonus = cardText.slice(bonusIdx, bonusIdx + 50);
    bonus = parseManAmount(afterBonus);
  }

  // 残業
  const overtimeIdx = cardText.indexOf("残業");
  if (overtimeIdx >= 0) {
    const afterOvertime = cardText.slice(overtimeIdx, overtimeIdx + 30);
    overtimeHours = parseOvertimeHours(afterOvertime);
  }

  // RSU
  const rsuIdx = cardText.indexOf("RSU");
  if (rsuIdx >= 0) {
    const afterRsu = cardText.slice(rsuIdx, rsuIdx + 50);
    rsu = parseManAmount(afterRsu);
  }

  // ストックオプション
  const soIdx = cardText.indexOf("ストック");
  if (soIdx >= 0) {
    const afterSo = cardText.slice(soIdx, soIdx + 50);
    stockOptions = parseManAmount(afterSo);
  }

  return {
    companyId,
    salaryId,
    companyName,
    occupationName,
    age,
    grade,
    overtimeHours,
    annualSalary,
    baseSalary,
    bonus,
    stockOptions,
    rsu,
  };
}

/**
 * HTMLファイルをパースして給与カードの配列を返す
 */
function parseHtmlFile(htmlPath: string): ParsedSalaryCard[] {
  const html = fs.readFileSync(htmlPath, "utf-8");
  const $ = cheerio.load(html);

  const cards = $('a.group.block.no-underline[href^="/salaries/"]').toArray();
  const results: ParsedSalaryCard[] = [];

  for (const card of cards) {
    try {
      const parsed = parseSalaryCard($, card);
      if (parsed) results.push(parsed);
    } catch (err) {
      console.warn(`  [skip] カードのパースに失敗: ${err}`);
    }
  }

  return results;
}

/**
 * ディレクトリを再帰的に走査して .html ファイルのパスを返す
 */
function collectHtmlFiles(dirPath: string): string[] {
  const files: string[] = [];
  const stat = fs.statSync(dirPath);

  if (stat.isFile()) {
    if (dirPath.toLowerCase().endsWith(".html")) files.push(dirPath);
    return files;
  }

  if (!stat.isDirectory()) return files;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
    } else if (entry.name.toLowerCase().endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * メイン処理
 */
async function main() {
  const argPath = process.argv[2];
  const targetPath = path.resolve(argPath || DEFAULT_PATH);

  if (!fs.existsSync(targetPath)) {
    console.error(`エラー: パスが存在しません: ${targetPath}`);
    process.exit(1);
  }

  const htmlFiles = collectHtmlFiles(targetPath);
  if (htmlFiles.length === 0) {
    console.log(`HTMLファイルが見つかりません: ${targetPath}`);
    process.exit(0);
  }

  console.log(`${htmlFiles.length} 件のHTMLファイルを処理します`);

  // 既存データを全削除（外部キー制約のため salary → company → occupation の順）
  console.log("既存データを削除しています...");
  await prisma.salary.deleteMany();
  await prisma.company.deleteMany();
  await prisma.occupation.deleteMany();
  console.log("削除完了");

  let totalImported = 0;
  let totalSkipped = 0;

  for (const htmlPath of htmlFiles) {
    console.log(`\n処理中: ${path.relative(process.cwd(), htmlPath)}`);
    const cards = parseHtmlFile(htmlPath);
    console.log(`  ${cards.length} 件の給与カードを検出`);

    for (const card of cards) {
      try {
        let company = await prisma.company.findUnique({
          where: { id: card.companyId },
        });
        if (!company) {
          company = await prisma.company.create({
            data: { id: card.companyId, name: card.companyName },
          });
        }

        let occupation = await prisma.occupation.findFirst({
          where: { name: card.occupationName },
        });
        if (!occupation) {
          occupation = await prisma.occupation.create({
            data: { name: card.occupationName },
          });
        }

        const existing = await prisma.salary.findUnique({
          where: { id: card.salaryId },
        });

        if (existing) {
          totalSkipped++;
          continue;
        }

        await prisma.salary.create({
          data: {
            id: card.salaryId,
            companyId: company.id,
            occupationId: occupation.id,
            age: card.age,
            grade: card.grade,
            overtimeHours: card.overtimeHours,
            annualSalary: card.annualSalary,
            baseSalary: card.baseSalary,
            bonus: card.bonus,
            stockOptions: card.stockOptions,
            rsu: card.rsu,
          },
        });
        totalImported++;
      } catch (err) {
        console.warn(
          `  [skip] ${card.companyName} / ${card.occupationName}: ${err}`
        );
      }
    }
  }

  console.log(
    `\n完了: ${totalImported} 件をインポート, ${totalSkipped} 件をスキップ（重複）`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
