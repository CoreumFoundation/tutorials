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
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
//@ts-ignore
import { Guild, Member } from 'util/types';
import MembersTable from 'components/MembersTable';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

const Guild: NextPage = () => {
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
    if (!guildAddress) {
      let address = router.query.address;
      if (typeof address == 'string') {
        setGuildAddress(address);
      }
    }
  }, [router]);

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

  async function getMembers(address: string) {
    try {
      let membersMsg = {
        list_members: {
          start_after: null,
          limit: null,
        },
      };
      let membersList = await signingClient?.queryContractSmart(
        address,
        membersMsg,
      );
      //console.log(membersList)
      if (membersList?.members) {
        setMembers(membersList.members);
      } else {
        setError('No members could be found');
      }
    } catch (err: any) {
      setError(err.toString());
    }
  }
  async function getAdmin(address: string) {
    try {
      let adminMsg = {
        admin: {},
      };
      let admin = await signingClient?.queryContractSmart(address, adminMsg);
      if (admin?.admin) {
        setGuildAdmin(admin.admin);
      }
    } catch (err: any) {
      setError(err.toString());
    }
  }
  async function getMultisig(address: string) {}

  useEffect(() => {
    if (guildContract && guildAddress) {
      getMembers(guildAddress);
      getAdmin(guildAddress);
      // get multisig

      // proposals

      // history txs
    }
  }, [guildContract]);

  return (
    <WalletLoader loading={loading}>
      <Typography variant="h3" gutterBottom>
        Guild: {guildContract ? guildContract.label : 'Loading'}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Created by: {guildContract ? guildContract.creator : 'Loading'}
      </Typography>
      {guildAdmin && (
        <Typography variant="h5" gutterBottom>
          Admin is: {guildAdmin == walletAddress ? 'YOU' : guildAdmin}
        </Typography>
      )}
      <hr />
      {members.length > 0 && (
        <Paper>
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>
          <Box>
            {members.map((m: Member) => {
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
      {members.length > 0 && (
        <Paper>
          <MembersTable members={members} />
        </Paper>
      )}
    </WalletLoader>
  );
};

export default Guild;
