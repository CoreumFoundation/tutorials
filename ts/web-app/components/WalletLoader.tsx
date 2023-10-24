import { ReactNode } from 'react';

import { useSigningClient } from 'contexts/client';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  InputAdornment,
  Typography,
} from '@mui/material';
import { SIZES } from 'pages/theme';
import { CallToActionButtons } from './Buttons/CallToActionButtons';

type Props = {
  children: ReactNode;
  loading?: boolean;
};

const WalletLoader = ({ children, loading = false }: Props) => {
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

  if (walletAddress === '') {
    return (
      <Container maxWidth="lg">
        <Typography variant="h1">Gaming Guilds Go </Typography>
        <Typography variant="h1">Digital: Dive into Web3!</Typography>
        <Typography
          variant="h4"
          gutterBottom
          component="h2"
          style={{ marginTop: `${SIZES['lineHeight'] * 2}rem` }}
        >
          JOIN AND CREATE YOUR GUILD
        </Typography>

        <CallToActionButtons />

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
    );
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>;
  }

  return <>{children}</>;
};

export default WalletLoader;
