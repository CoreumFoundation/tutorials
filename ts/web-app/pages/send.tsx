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
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

const Send: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const [balance, setBalance] = useState('');
  const [loadedAt, setLoadedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
  }, [signingClient, walletAddress, loadedAt]);

  const handleSend = () => {
    setError('');
    setSuccess('');
    setLoading(true);
    const amount: Coin[] = [
      {
        amount: convertDenomToMicroDenom(sendAmount),
        denom: PUBLIC_STAKING_DENOM,
      },
    ];

    signingClient
      ?.sendTokens(walletAddress, recipientAddress, amount, 'auto')
      .then(() => {
        const message = `Success! Sent ${sendAmount}  ${convertFromMicroDenom(
          PUBLIC_STAKING_DENOM,
        )} to ${recipientAddress}.`;

        setLoadedAt(new Date());
        setLoading(false);
        setSendAmount('');
        setSuccess(message);
      })
      .catch((error) => {
        setLoading(false);
        setError(`Error! ${error.message}`);
      });
  };
  return (
    <WalletLoader loading={loading}>
      <Typography variant="h5" gutterBottom>
        Your wallet has {balance}
      </Typography>

      <Typography variant="h3" gutterBottom>
        Send to {PUBLIC_CHAIN_NAME} recipient wallet address:
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label={`${PUBLIC_CHAIN_NAME} recipient wallet address...`}
        onChange={(event) => setRecipientAddress(event.target.value)}
        value={recipientAddress}
        sx={{ my: 2 }}
      />

      <Container sx={{ my: 2 }}>
        <TextField
          type="number"
          variant="outlined"
          label="Amount"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {convertFromMicroDenom(PUBLIC_STAKING_DENOM)}
              </InputAdornment>
            ),
          }}
          onChange={(event) => setSendAmount(event.target.value)}
          value={sendAmount}
        />

        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </Container>

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

export default Send;
