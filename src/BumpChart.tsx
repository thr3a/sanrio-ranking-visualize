import { Box } from '@mantine/core';
import type { ECharts, EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { rankingData } from './data';

const CHARACTER_COLORS: Record<string, string> = {
  ハローキティ: '#e6002e',
  マイメロディ: '#e85292',
  クロミ: '#595757',
  シナモロール: '#01b3dd',
  ポムポムプリン: '#fff471',
  ポチャッコ: '#F6F7F8',
  ハンギョドン: '#83cbd1',
  タキシードサム: '#0096df',
  あひるのペックル: '#f7b52c',
  バッドばつ丸: '#595757',
  けろけろけろっぴ: '#dadf03',
  ぐでたま: '#f7b52c',
  マイスウィートピアノ: '#f9dbe8',
  マロンクリーム: '#e9dbcb'
};

const START_YEAR = 1986;
const END_YEAR = 2025;
const RANK_COUNT = 10;
// 1年あたりの横幅(px)。年数 × この値 + 左右マージンでチャート全体の幅を決める
const PIXELS_PER_YEAR = 80;

const filteredData = rankingData.filter(
  (entry) => entry.year >= START_YEAR && entry.year <= END_YEAR && entry.rank <= RANK_COUNT
);

const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => String(START_YEAR + i));

// 横スクロール用のチャート全体の幅(px)。grid の left(30) + right(100) を加味
const chartWidth = years.length * PIXELS_PER_YEAR + 130;

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
    const color = CHARACTER_COLORS[name];
    seriesList.push({
      name,
      symbolSize: 30,
      type: 'line',
      smooth: false,
      ...(color ? { color } : {}),
      emphasis: {
        focus: 'series'
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{c}',
        color: '#333',
        fontSize: 11
      },
      lineStyle: {
        width: 3
      },
      connectNulls: false,
      data
    });
  });

  return seriesList;
};

const rankingMap = buildRankingMap();

const option: EChartsOption = {
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: 30,
    right: 100,
    bottom: 30,
    top: 60,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    position: 'top',
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
      formatter: '{value}位'
    },
    inverse: true,
    interval: 1,
    min: 1,
    max: RANK_COUNT
  },
  series: generateSeriesList(rankingMap)
};

const addNameLabels = (chart: ECharts) => {
  const graphicElements: object[] = [];

  rankingMap.forEach((data, name) => {
    // const _color = CHARACTER_COLORS[name];
    const lastNonNullIndex = data.reduce<number>((li, v, i) => (v !== null ? i : li), -1);
    const lastRank = data[lastNonNullIndex];

    if (lastNonNullIndex === -1 || lastRank === null) return;

    const pixel = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [years[lastNonNullIndex], lastRank]);
    if (!pixel) return;

    graphicElements.push({
      type: 'text',
      z: 100,
      style: {
        text: name,
        x: pixel[0],
        y: pixel[1] + 20,
        textAlign: 'center',
        textVerticalAlign: 'top',
        fill: '#595757',
        font: 'bold 12px sans-serif',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowBlur: 4,
        textShadowOffsetX: 1,
        textShadowOffsetY: 1
      }
    });
  });

  chart.setOption({ graphic: graphicElements });
};

const handleChartReady = (chart: ECharts) => {
  setTimeout(() => {
    chart.resize();
    setTimeout(() => addNameLabels(chart), 50);
  }, 0);
};

const BumpChart = () => {
  // 685px=全部で10位なので9間隔,9*5=45px
  // 全年(40年)を表示するため、親要素を overflow-x: auto で横スクロール可能にする
  return (
    <Box style={{ overflowX: 'auto', width: '100%' }}>
      <ReactECharts
        option={option}
        style={{ height: '685px', width: `${chartWidth}px` }}
        onChartReady={handleChartReady}
      />
    </Box>
  );
};

export default BumpChart;
