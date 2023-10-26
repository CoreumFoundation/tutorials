import { ReactNode } from 'react';

import Image from 'next/image';

import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { SIZES } from 'pages/theme';
import { CallToActionButtons } from './Buttons/CallToActionButtons';
import styled from '@emotion/styled';

type Props = {
  children: ReactNode;
  loading?: boolean;
  fake?: boolean;
};

const VideoBackgroundContainer = styled.div`
  width: 100%;
  padding: 50px;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translateX(-50%) translateY(-50%);
`;

const TextContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
`;

const CardComponent = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Card sx={{ width: 385, padding: '1rem' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom textAlign={'left'} mb={3}>
          {title}
        </Typography>
        <Typography variant="body1" textAlign={'left'}>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Main = () => {
  return (
    <>
      <VideoBackgroundContainer>
        <BackgroundVideo
          autoPlay
          loop
          muted
          src="/video/home_video.mp4"
          type="video/mp4"
        />

        <TextContent>
          <Typography variant="h1" align="right">
            Enter the gaming
          </Typography>
          <Typography variant="h1" align="right">
            guild ecosystem
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
            component="h2"
            align="right"
            style={{ marginTop: `${SIZES['lineHeight'] * 2}rem` }}
          >
            JOIN A GUILD OR MANAGE YOUR OWN
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CallToActionButtons />
          </Box>
        </TextContent>
      </VideoBackgroundContainer>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          marginTop: 12,
          gap: '2rem',
        }}
      >
        <CardComponent
          title="DISCOVER, JOIN or CREATE YOUR GUILD"
          content="Explore the guild universe. Discover the right guild for you and join, or just create a new one, manage it, and make it grow."
        />
        <CardComponent
          title="METAVERSE YOUR GUILD"
          content="Gather together with your guild in your private metaverse . Interact with other members, visualize the community loot, and create proposals."
        />
        <CardComponent
          title="TOKENIZE YOUR GUILD AND GET FUNDED"
          content="Generate your own tokens and NFT collections and let team members and  investors support your guild."
        />
      </Container>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '150px',
          flexGrow: 1,
          marginLeft: SIZES['lineHeight'] * 2,
          marginRight: SIZES['lineHeight'] * 2,
          gap: '2rem',
        }}
      >
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Image
            src="/landing_layers.png"
            alt="Descriptive text here"
            width={500}
            height={400}
          />
        </Box>
        <Box sx={{ width: '50%', maxWidth: '600px' }}>
          <Typography variant="h4" align="left" sx={{ marginTop: '1.2rem' }}>
            A GAME-AGNOSTIC
          </Typography>
          <Typography variant="h4" align="left" mb={4}>
            GUILD MANAGER
          </Typography>
          <Typography variant="body1" align="left">
            Allow guilds to access and play any game, manage teams of all sizes,
            get into chat interactions, make governance decisions in a private
            metaverse, create multiple asset vaults, initiate transactions based
            on voting power, and tokenize it to attract funds.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <CallToActionButtons />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: '150px',
          width: '100vw',
          paddingLeft: `${SIZES['lineHeight'] * 2}rem`,
          paddingRight: `${SIZES['lineHeight'] * 2}rem`,
        }}
      >
        <Typography variant="h3" align="left" gutterBottom>
          JOIN THE GUILD NATION
        </Typography>
        <Typography variant="body1" align="left" maxWidth={900}>
          Guild Hub enables all types of gamers and metaverse players to plug
          into a collaborative ecosystem where everyone can join a guild or
          create and manage their own.
        </Typography>
      </Box>
    </>
  );
};

export default Main;
