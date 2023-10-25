import { useContext } from 'react';
import type { NextPage } from 'next';

import { Typography } from '@mui/material';

import VaultCreator from 'components/CreateVault';
import { GuildContext } from 'contexts/guildContext';

interface IProps {
  guildName: string;
  guildAddress: string;
}
//@ts-ignore
const Vaults: NextPage = (props: IProps) => {
  const ctx = useContext(GuildContext);
  const vaults = ctx?.guildVaults;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Vaults
      </Typography>
      <VaultCreator />
      <hr />
      {vaults && vaults?.length > 0 && (
        <ul>
          {vaults?.map((v) => {
            return <li key={v}>{v}</li>;
          })}
        </ul>
      )}
    </>
  );
};

export default Vaults;
