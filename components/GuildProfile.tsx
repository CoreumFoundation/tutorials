import type { NextPage } from 'next';

import { useSigningClient } from 'contexts/client';

import { CircularProgress, Paper, Typography } from '@mui/material';
//@ts-ignore
import { Guild, Member } from 'util/types';

import { useContext } from 'react';
import { GuildContext } from 'contexts/guildContext';

interface IProps {
  guildContract: Guild;
  guildAdmin: string;
  members: Member[];
}

const GuildProfile: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const ctx = useContext(GuildContext);
  console.log(`context is ${JSON.stringify(ctx)}`);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Guild Profile
      </Typography>
      <Typography variant="h4" gutterBottom>
        Guild:{' '}
        {ctx?.guildContract ? ctx?.guildContract.label : <CircularProgress />}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Created by:{' '}
        {ctx?.guildContract ? ctx.guildContract.creator : <CircularProgress />}
      </Typography>
      {ctx?.guildAdmin && (
        <Typography variant="h5" gutterBottom>
          Admin is: {ctx?.guildAdmin == walletAddress ? 'YOU' : ctx?.guildAdmin}
        </Typography>
      )}
      <hr />
      {ctx?.guildMembers && ctx?.guildMembers?.length > 0 && (
        <Paper>
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default GuildProfile;
