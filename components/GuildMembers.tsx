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
  members: Member[]; 
}

//@ts-ignore
const GuildMembers: NextPage = (props: IProps) => {
  const { walletAddress, signingClient } = useSigningClient();
  
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Members
      </Typography>

      {props.members?.length > 0 && (
        <Paper>
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>
          <Box>
            {props.members.map((m: Member) => {
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
      {props.members?.length > 0 && (
        <Paper>
          <MembersTable members={props.members} />
        </Paper>
      )}
    </>
  );
};

export default GuildMembers;
