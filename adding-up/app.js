'use strict';

//モジュール:ファイルシステム
const fs = require('fs');
// ファイルを1行ずつ読むモジュール
const readline = require('readline');
// Streamでファイルを読み込む
const rs = fs.createReadStream('./popu-pref.csv');
//ファイルを読むモジュールのinputに読み込んだファイルを設定
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//key:都道府県 value:集計データ
const prefectureDataMap = new Map();

//rlオブジェクトでlineイベントが発生した場合
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});

rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  //普通の配列に変換後Sort
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  })
  //配列のmap関数
  const rankingStrings = rankingArray.map(([key, value]) => {
    return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率' + value.change;
  });
  console.log(rankingStrings);
});
