import { ReactNode } from 'react';

import { useSigningClient } from 'contexts/client';
import {
  Box,
  Card,
  CardActionArea,
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

const WalletLoader = ({ children, loading = false, fake = false }: Props) => {
  const {
    connectWallet,
    error,
    loading: clientLoading,
    walletAddress,
  } = useSigningClient();

  if (loading || clientLoading) {
    return (
      <Box maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
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
              Enter the gaming{' '}
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

        <Container maxWidth="lg">
          <Card onClick={connectWallet}>
            <CardActionArea>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Connect your wallet
                </Typography>
                <Typography variant="body1">
                  Get your Keplr wallet connected now and start using it.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Container>
      </>
    );
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>;
  }

  return <>{children}</>;
};

export default WalletLoader;
