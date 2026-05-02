import { Container, Paper, Text, Title } from '@mantine/core';
import BumpChart from './BumpChart';

const Home = () => {
  return (
    <Container maw={1400} py='md'>
      <Paper mb={'lg'}>
        <Title c={'#333'} order={1}>
          サンリオキャラクター大賞 順位推移グラフ
        </Title>
        <Text c={'#333'}>
          毎年開催される「サンリオキャラクター大賞」は、ファンが自分のお気に入りのキャラクターに投票し、その年の人気ランキングを決定する一大イベントです。
        </Text>
        <Text c={'#333'}>
          1986年に公式月刊誌である「いちご新聞」の企画として始まり、今では世界中のファンが注目する恒例行事として定着しています。
        </Text>
      </Paper>
      <BumpChart />
    </Container>
  );
};

export default Home;
