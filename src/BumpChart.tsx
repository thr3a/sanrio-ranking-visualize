import type { EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

const vegetables = [
  'トマト',
  'キュウリ',
  'ナス',
  'ピーマン',
  'じゃがいも',
  'たまねぎ',
  'にんじん',
  'ほうれん草',
  'キャベツ',
  'レタス',
  'ブロッコリー',
  'かぼちゃ'
] as const;

const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
const RANK_COUNT = 10;

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  let currentIndex = arr.length;
  while (currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
};

type RankingMap = Map<string, (number | null)[]>;

const generateRankingData = (): RankingMap => {
  const map: RankingMap = new Map();
  for (const veg of vegetables) {
    map.set(veg, []);
  }

  for (const _ of years) {
    const shuffled = shuffle([...vegetables]);
    const selected = shuffled.slice(0, RANK_COUNT);

    for (const veg of vegetables) {
      const current = map.get(veg) ?? [];
      const rankIdx = selected.indexOf(veg);
      map.set(veg, [...current, rankIdx !== -1 ? rankIdx + 1 : null]);
    }
  }

  return map;
};

const generateSeriesList = (rankingMap: RankingMap): SeriesOption[] => {
  const seriesList: SeriesOption[] = [];

  rankingMap.forEach((data, name) => {
    seriesList.push({
      name,
      symbolSize: 20,
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      endLabel: {
        show: true,
        formatter: '{a}',
        distance: 20
      },
      lineStyle: {
        width: 4
      },
      connectNulls: false,
      data
    });
  });

  return seriesList;
};

const rankingMap = generateRankingData();

const option: EChartsOption = {
  title: {
    text: '人気野菜ランキング推移',
    left: 'center',
    textStyle: {
      fontSize: 20
    }
  },
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: 30,
    right: 160,
    bottom: 30,
    top: 60,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    splitLine: {
      show: true
    },
    axisLabel: {
      margin: 30,
      fontSize: 16
    },
    boundaryGap: false,
    data: years
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      margin: 30,
      fontSize: 16,
      formatter: '#{value}'
    },
    inverse: true,
    interval: 1,
    min: 1,
    max: RANK_COUNT
  },
  series: generateSeriesList(rankingMap)
};

const BumpChart = () => {
  return <ReactECharts option={option} style={{ height: '640px', width: '100%' }} />;
};

export default BumpChart;
