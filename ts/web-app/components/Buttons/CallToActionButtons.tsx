import { useRouter } from 'next/router';

import { Box, Button } from '@mui/material';
import { SIZES } from 'pages/theme';

export const CallToActionButtons = () => {
  const router = useRouter();

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
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/multisig')}
      >
        Create Guild
      </Button>
    </Box>
  );
};
