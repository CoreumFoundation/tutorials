import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import {
  convertFromMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion';
import { checkAddress } from 'utils/displayHelpers';

import { useRouter } from 'next/router';
import {
  Alert,
  Button,
  Container,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { Cw3FlexMultisigNamedClient } from 'hooks/guildapp-ts/Cw3FlexMultisigNamed.client';
import { Cw4GroupNamedClient } from 'hooks/guildapp-ts/Cw4GroupNamed.client';
import CreateVault from 'components/CreateVault';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

type Member = {
  address: string;
  name: string;
  weight: number;
};

const Multisig: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const [balance, setBalance] = useState('');
  const [contractCreated, setContractCreated] = useState<string | null>(null);
  const [multisigCreated, setMultisigCreated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guildName, setGuildName] = useState<string>('');

  const [leader, setLeader] = useState<Member>({
    weight: 1,
    address: '',
    name: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return;
    }
    setError('');
    setSuccess('');

    signingClient
      .getBalance(walletAddress, PUBLIC_STAKING_DENOM)
      .then((response: any) => {
        const { amount, denom }: { amount: number; denom: string } = response;
        setBalance(
          `${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`,
        );
      })
      .catch((error) => {
        setError(`Error! ${error.message}`);
      });
  }, [signingClient, walletAddress]);

  const handleCreate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    console.log(JSON.stringify(leader), JSON.stringify(guildName));
    let instantiateMsg = {
      admin: leader.address,
      members: [
        {
          addr: leader.address,
          name: leader.name.toLocaleLowerCase(),
          weight: 1,
        },
      ],
    };

    let res = await signingClient?.instantiate(
      walletAddress,
      522,
      instantiateMsg,
      guildName.toLocaleLowerCase(),
      'auto',
    );

    // Check if 'res' contains 'contractAddress' property
    if (res && res.contractAddress) {
      let contractAddress = res.contractAddress;
      if (contractAddress) setContractCreated(contractAddress);
    } else {
      console.log('contractAddress not found in the response.');
    }

    setLoading(false);
    router.back();
  };

  return (
    <WalletLoader loading={loading}>
      <Container
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          my: 2,
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 8 }}>
          Create your Guild
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Guild Leader
        </Typography>
        <Typography variant="subtitle2" gutterBottom component="p">
          Once you create the guild, you will become the guild leader.
        </Typography>
        <Box sx={{ mb: 8, mt: 3, display: 'flex', gap: '1rem' }}>
          <TextField
            label="Leader Address"
            onChange={(event) =>
              setLeader((prev) => ({ ...prev, address: event.target.value }))
            }
            sx={{ mb: 2 }}
            value={leader.address}
            variant="outlined"
          />
          <TextField
            label="Leader Name"
            onChange={(event) =>
              setLeader((prev) => ({ ...prev, name: event.target.value }))
            }
            sx={{ mb: 2 }}
            value={leader.name}
            variant="outlined"
          />
        </Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Guild name
        </Typography>
        <Typography variant="subtitle2" gutterBottom component="p">
          Do you have already a guild name? If not, it is your time to be
          creative.
        </Typography>
        <TextField
          label="Guild Name"
          onChange={(e) => setGuildName(e.target.value)}
          sx={{ mb: 2, mt: 3, display: 'flex', gap: '1rem' }}
          value={guildName}
          variant="outlined"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={
            loading ||
            !leader.address.trim().length ||
            !leader.name.trim().length ||
            !guildName.trim().length ||
            !guildName.length
          }
        >
          Create guild
        </Button>
      </Container>
      {contractCreated && (
        <CreateVault guildAddress={contractCreated} guildName={guildName} />
      )}
      <Container sx={{ my: 2 }}>
        {success.length > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </WalletLoader>
  );
};

export default Multisig;
