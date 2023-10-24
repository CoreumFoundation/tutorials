import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
//import {Coin} from '@cosmjs/amino'
import { decodeBech32Pubkey } from '@cosmjs/amino';
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import {
  convertDenomToMicroDenom,
  convertFromMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion';
import { EncodeObject } from '@cosmjs/proto-signing';
import { createMultisigFromCompressedSecp256k1Pubkeys } from 'utils/multisigHelper';
import { checkAddress } from 'utils/displayHelpers';

import {
  TextField,
  Button,
  Alert,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  InputLabel,
  Box,
} from '@mui/material';
import { NewspaperTwoTone } from '@mui/icons-material';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

interface Member {
  address: string;
  name: string | null;
  weight: number;
  //  pubkey: string | null;
}

const Multisig: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const [balance, setBalance] = useState('');
  const [loadedAt, setLoadedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [guildName, setGuildName] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newAddress, setNewAddress] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newWeight, setNewWeight] = useState<number>(1);
  const [threshold, setThreshold] = useState<number>(1);
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

  //const publicKeys = () => members.map(async (m: Member) => {return m.pubkey})

  const getPubkeyFromNode = async (address: string) => {
    //    const client = await StargateClient.connect(chain.nodeAddress);
    const accountOnChain = await signingClient?.getAccount(address);
    //    console.log(accountOnChain);
    if (!accountOnChain || !accountOnChain.pubkey) {
      throw new Error(
        'Account has no pubkey on chain, this address will need to send a transaction to appear on chain.',
      );
    }
    return accountOnChain.pubkey.value;
  };

  const handleAddMember = async () => {
    let err = checkAddress(
      newAddress,
      process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX || '',
    );
    let pk = await getPubkeyFromNode(newAddress);
    if (err || !pk) {
      console.log(`Error! ${err}`);
    } else {
      setMembers((members) => [
        ...members,
        {
          address: newAddress,
          name: newName,
          weight: newWeight /* , pubkey: pk */,
        },
      ]);
      setNewAddress('');
      setNewName('');
      setNewWeight(1);
    }
  };

  const handleCreate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    /* let list = members.map((m) => {
      return m.pubkey;
    }); */
    console.log(JSON.stringify(members));

    // needs to instantiate a group
    // with {admin: string, members: [{addr: String, name: String, weight: u64}]}
    // it does not work! a problem with the typeUrl required
    /*
    let admin = members[0].address
    let instantiateMsg = {
      admin,
      members
    }

    let res = await signingClient?.instantiate(
      walletAddress,
      522,  // my group variant
      instantiateMsg,
      guildName,
      "auto"
    )
    if (res) {
      console.log(res)
      setLoading(false)

    } else {
      console.log("no response for instantiation")
      setLoading(false)
    }
     */
    /*
    let multisigAddress = await createMultisigFromCompressedSecp256k1Pubkeys(
      //@ts-ignore
      list,
      threshold,
      process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX || '',
      process.env.NEXT_PUBLIC_CHAIN_ID || '',
    );
    if (multisigAddress) {
      let message = `Created new multisig ${multisigAddress}`;
      setLoading(false);
      setSuccess(message);
      // add link to the page
    } else {
      setLoading(false);
      setError(`Error creating multisig`);
    }
 */
  };
  return (
    <WalletLoader loading={loading}>
      <Typography variant="h3" gutterBottom>
        Set the members for your new guild in {PUBLIC_CHAIN_NAME}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 360 }}>
        {members.length > 0 ? (
          <List>
            {members.map((m: Member) => (
              <ListItem
                key={m.address}
                secondaryAction={
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      let newArr = members.filter(
                        (ms) => ms.address !== m.address,
                      );
                      setMembers(newArr);
                    }}
                  >
                    Remove
                  </Button>
                }
              >
                <ListItemText primary={m.address} /* secondary={m.pubkey} */ />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography align="center" variant="h6" gutterBottom>
            A guild with no members?
          </Typography>
        )}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        sx={{ mr: 2 }}
        placeholder="Name your guild"
        onChange={(e) => setGuildName(e.target.value)}
        value={guildName}
      />
      <Container
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          my: 2,
          flexDirection: 'column', // Changed to column for better mobile responsiveness
          alignItems: 'center', // Center align items
        }}
      >
        <TextField
          id="recipient-address"
          label={`${PUBLIC_CHAIN_NAME} Address`}
          variant="outlined"
          value={newAddress}
          onChange={(event) => setNewAddress(event.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="recipient-name"
          label="Name for the Member"
          variant="outlined"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="recipient-weight"
          label="Weight for the Member"
          variant="outlined"
          value={newWeight}
          onChange={(event) => {
            let val = parseInt(event.target.value);
            if (val > 0) {
              setNewWeight(val);
            }
          }}
          type="number"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddMember}>
          Add Member
        </Button>
      </Container>

      {members.length >= 2 && (
        <Container sx={{ my: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Signatures required
          </Typography>
          <TextField
            type="number"
            variant="outlined"
            label="Signature Threshold"
            onChange={(event) => {
              let val = parseInt(event.target.value);
              if (val > 0 && val <= members.length) {
                setThreshold(val);
              }
            }}
            value={threshold}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreate}
          >
            Create multisig
          </Button>
        </Container>
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
