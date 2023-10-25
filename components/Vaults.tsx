import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import {
  Typography,
} from '@mui/material';
//@ts-ignore
import { Guild, Member } from 'util/types';
import VaultCreator from 'components/CreateVault';
import { GuildContext } from 'contexts/guildContext';

//const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
//const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

interface IProps {
  guildName: string;
  guildAddress: string;
}
//@ts-ignore
const Vaults: NextPage = (props: IProps) => {

  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const ctx = useContext(GuildContext)
  const vaults = ctx?.guildVaults

/* 
  Get balances of each vault to display in a table (check the figma)

*/
/* 
useEffect(() => {

}, [vaults])
*/  


  return (
    <WalletLoader loading={loading}>
      <Typography variant="h4" gutterBottom>
        Vaults
      </Typography>
      <VaultCreator />
      <hr />
      {vaults && vaults?.length > 0 &&
        <ul>
          {vaults?.map((v) => {return(
            <li key={v}>
              {v}
            </li>
          )})}
        </ul>
      }
    </WalletLoader>
  );
};

export default Vaults;
