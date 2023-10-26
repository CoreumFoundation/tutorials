import { ReactNode } from 'react';

import { useSigningClient } from 'contexts/client';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
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
  padding: 50px; // Adjust this to your needs
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
  color: white; // Adjust as needed
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

const WalletLoader = ({ children, loading = false, fake = false }: Props) => {
  const { error, loading: clientLoading, walletAddress } = useSigningClient();

  if (loading || clientLoading) {
    return (
      <Box maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>;
  }

  if (walletAddress === '' && fake === false) {
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
      </>
    );
  }

  return <>{children}</>;
};

export default WalletLoader;
