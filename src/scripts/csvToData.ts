/// <reference types="node" />
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CSV_PATH = resolve('ranking.csv');
const OUT_PATH = resolve('src/data.ts');

const MISSING = '―';

const raw = readFileSync(CSV_PATH, 'utf-8');
const lines = raw
  .trim()
  .split('\n')
  .map((l: string) => l.split(','));

// 1行目: ヘッダー（順位, 1986年(第1回), ...）
const header = lines[0];
// 年だけ抽出 例: "1986年(第1回)" -> 1986
const years = header.slice(1).map((h: string) => Number(h.match(/(\d{4})年/)?.[1]));

type RankEntry = {
  character: string;
  year: number;
  rank: number;
};

const entries: RankEntry[] = [];

// 2行目以降: 各順位行
for (const row of lines.slice(1)) {
  const rankLabel = row[0]; // "1位", "2位", ...
  const rank = Number(rankLabel.replace('位', ''));
  const chars = row.slice(1);

  for (let i = 0; i < chars.length; i++) {
    const character = chars[i].trim();
    if (!character || character === MISSING) continue;
    entries.push({ character, year: years[i], rank });
  }
}

const tsContent = `// node --import tsx ./src/scripts/csvToData.ts
// 手動で編集しないでください

export type RankEntry = {
  character: string
  year: number
  rank: number
}

export const rankingData: RankEntry[] = ${JSON.stringify(entries, null, 2)}
`;

writeFileSync(OUT_PATH, tsContent, 'utf-8');
console.log(`変換完了: ${entries.length} 件のエントリを ${OUT_PATH} に書き出しました`);

// 簡易確認: 年・キャラクター数
const years_uniq = [...new Set(entries.map((e) => e.year))].sort();
const chars_uniq = [...new Set(entries.map((e) => e.character))].sort();
console.log(`年数: ${years_uniq.length} (${years_uniq[0]}〜${years_uniq[years_uniq.length - 1]})`);
console.log(`ユニークキャラクター数: ${chars_uniq.length}`);
