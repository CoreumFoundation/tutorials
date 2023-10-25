import type { NextPage } from 'next';

import { useSigningClient } from 'contexts/client';

import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';

import { useContext } from 'react';
import { GuildContext } from 'contexts/guildContext';

const GuildProfile: NextPage = () => {
  const { walletAddress } = useSigningClient();
  const ctx = useContext(GuildContext);
  console.log(`context is ${JSON.stringify(ctx)}`);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Guild Profile
      </Typography>
      <Paper>
        <Container>
          <Typography variant="h5" gutterBottom>
            Guild:{' '}
            {ctx?.guildContract ? (
              ctx?.guildContract.label
            ) : (
              <CircularProgress />
            )}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Created by:{' '}
            {ctx?.guildContract ? (
              ctx.guildContract.creator
            ) : (
              <CircularProgress />
            )}
          </Typography>
          {ctx?.guildAdmin && (
            <Typography variant="h5" gutterBottom>
              Admin is:{' '}
              {ctx?.guildAdmin == walletAddress ? 'YOU' : ctx?.guildAdmin}
            </Typography>
          )}
        </Container>
      </Paper>

      {ctx?.guildMembers && ctx?.guildMembers?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>
          <Paper>
            <Container>
              {ctx?.guildMembers?.map((member) => (
                <Typography variant="h6" gutterBottom key={member.name}>
                  {member.name}
                </Typography>
              ))}
            </Container>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default GuildProfile;
