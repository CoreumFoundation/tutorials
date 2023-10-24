import type { NextPage } from 'next';

import {
  Box,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useGetGuildsList } from 'hooks/useGetGuildsList';
import { SIZES } from './theme';
import { useState, useEffect } from 'react';

import { useSigningClient } from 'contexts/client';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import GuildCard from 'components/GuildCard';

async function getDataFromContract(signingClient: SigningCosmWasmClient) {
  if (!signingClient) {
    return [];
  }
  let data = await signingClient.getContracts(
    process.env.NEXT_PUBLIC_CONTRACT_NUMBER,
  );
  console.log('data is ', data);
  return { key: 'value' };
}

const ExploreGuilds: NextPage = () => {
  const { guilds } = useGetGuildsList();
  const { walletAddress, signingClient } = useSigningClient();
  console.log('signingClient', signingClient);

  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await getDataFromContract(signingClient);
    }

    fetchData();
  }, [signingClient]);

  const filteredGuilds = guilds?.filter((guild) =>
    guild.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <>
      {filteredGuilds.length ? (
        <Box sx={{ marginBottom: 4, textAlign: 'left' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Guilds"
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      ) : null}

      <Box sx={{ margin: SIZES['lineHeight'] }}>
        <Grid container spacing={4}>
          {filteredGuilds.length ? (
            filteredGuilds.map((guild) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={guild.name}>
                <GuildCard guild={guild} key={guild.name} />
              </Grid>
            ))
          ) : (
            <Box
              maxWidth="sm"
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <CircularProgress />
            </Box>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default ExploreGuilds;
