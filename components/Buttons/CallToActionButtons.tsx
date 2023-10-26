import { useRouter } from 'next/router';

import { useSigningClient } from 'contexts/client';
import { Box, Button } from '@mui/material';
import { SIZES } from 'pages/theme';

export const CallToActionButtons = () => {
  const router = useRouter();

  const { connectWallet } = useSigningClient();
  const handleConnect = () => {
    connectWallet();
    router.push('/multisig');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: `${SIZES['lineHeight']}rem`,
        marginTop: `${SIZES['lineHeight'] * 3}rem`,
        marginBottom: `${SIZES['lineHeight'] * 3}rem`,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/explore-guilds')}
      >
        Explore Guilds
      </Button>
      <Button variant="contained" color="primary" onClick={handleConnect}>
        Create Guild
      </Button>
    </Box>
  );
};
