import type { EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { rankingData } from './data';

const START_YEAR = 2015;
const END_YEAR = 2025;
const RANK_COUNT = 10;

const filteredData = rankingData.filter(
  (entry) => entry.year >= START_YEAR && entry.year <= END_YEAR && entry.rank <= RANK_COUNT
);

const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => String(START_YEAR + i));

const characters = Array.from(new Set(filteredData.map((entry) => entry.character)));

type RankingMap = Map<string, (number | null)[]>;

const buildRankingMap = (): RankingMap => {
  const map: RankingMap = new Map();
  for (const character of characters) {
    const ranks = years.map((y) => {
      const entry = filteredData.find((e) => e.character === character && String(e.year) === y);
      return entry ? entry.rank : null;
    });
    map.set(character, ranks);
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

const rankingMap = buildRankingMap();

const option: EChartsOption = {
  title: {
    text: 'サンリオキャラクター大賞 順位推移',
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
