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
  guildAddress: string;
}

const Vaults: NextPage = (props: IProps) => {
  const { walletAddress, signingClient } = useSigningClient();
  const router = useRouter();
  const [guildAddress, setGuildAddress] = useState<string | null>(null);
  const [guildContract, setGuildContract] = useState<Guild | null>(null);
  const [guildAdmin, setGuildAdmin] = useState<string>('');
  const [guildMultisig, setGuildMultisig] = useState<string | null>(null);

  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0 || !guildAddress) {
      return;
    }
    setError('');
    setSuccess('');

    signingClient
      .getContract(guildAddress)
      .then((response: Guild) => {
        setGuildContract(response);
        /* const { amount, denom }: { amount: number; denom: string } = response;
                setBalance(
                `${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`,
                ); */
      })
      .catch((error) => {
        setError(`Error! ${error.message}`);
      });
  }, [signingClient, walletAddress, guildAddress]);

  return (
    <WalletLoader loading={loading}>
      <Typography variant="h4" gutterBottom>
        Vaults
      </Typography>
    </WalletLoader>
  );
};

export default Vaults;
