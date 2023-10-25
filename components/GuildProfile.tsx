import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { Coin } from '@cosmjs/amino';
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import {
  convertDenomToMicroDenom,
  convertFromMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
//@ts-ignore
import { Guild, Member } from 'util/types';
import MembersTable from 'components/MembersTable';
import PageWithSidebar from 'components/PageWithSidebar';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

interface IProps {
  guildContract: Guild;
  guildAdmin: string;
  members: Member[];    
}
//@ts-ignore
const GuildProfile: NextPage = (props: IProps) => {
  const { walletAddress, signingClient } = useSigningClient();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Guild Profile
      </Typography>
      <Typography variant="h4" gutterBottom>
        Guild: {props.guildContract ? props.guildContract.label : <CircularProgress />}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Created by:{' '}
        {props.guildContract ? props.guildContract.creator : <CircularProgress />}
      </Typography>
      {props.guildAdmin && (
        <Typography variant="h5" gutterBottom>
          Admin is: {props.guildAdmin == walletAddress ? 'YOU' : props.guildAdmin}
        </Typography>
      )}
      <hr />
      {props.members?.length > 0 && (
        <Paper>
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>
          <Box>
            {props.members?.map((m: Member) => {
              return (
                <Typography
                  variant="body1"
                  style={
                    m.addr === walletAddress
                      ? { fontWeight: 700 }
                      : { fontWeight: 400 }
                  }
                  key={m.addr}
                >
                  {m.name} ({m.weight})
                </Typography>
              );
            })}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default GuildProfile;
