import { Box, Container, Stack, Text, Title } from '@mantine/core';
import BumpChart from './BumpChart';
import { ShareButton } from './ShareButton';

const Home = () => {
  return (
    <Container maw={1400} py='md'>
      <Stack>
        <Title c={'#333'} order={1}>
          サンリオ大賞ひすとりー
        </Title>
        <Box>
          <Text c={'#333'}>
            「サンリオキャラクター大賞」は、ファンが自分のお気に入りのキャラクターに投票し、その年の人気ランキングを決定する1986年開催以降年に1度の一大イベントです。
          </Text>
          <Text c={'#333'}>歴代順位の推移をグラフで可視化できます。横にスクロールすることができます。</Text>
        </Box>
        <Box>
          <ShareButton title='サンリオ大賞ひすとりー'></ShareButton>
        </Box>
      </Stack>
      <BumpChart />
    </Container>
  );
};

export default Home;
