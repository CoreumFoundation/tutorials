import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import { Box, Tab, Tabs, Typography } from '@mui/material';
//@ts-ignore
import { Guild, Member } from 'util/types';
import { Token } from '../hooks/coreum-ts/coreum/asset/ft/v1/token';

const TokenCreation = () => {
  let hasTokens = false;
  return <> </>;
};

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

const Tokens: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const router = useRouter();
  const [guildAddress, setGuildAddress] = useState<string | null>(null);
  const [guildContract, setGuildContract] = useState<Guild | null>(null);
  const [guildAdmin, setGuildAdmin] = useState<string>('');
  const [guildMultisig, setGuildMultisig] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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

  useEffect(() => {
    if (guildContract && guildAddress) {
      getMembers(guildAddress);
      getAdmin(guildAddress);
    }
  }, [guildContract]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tokens
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Tokens" {...a11yProps(0)} />
            <Tab label="My tokens" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <TokenCreation />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          My tokens
        </CustomTabPanel>
      </Box>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default Tokens;
