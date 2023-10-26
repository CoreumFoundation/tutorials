import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import type { NextPage } from 'next';

import { useSigningClient } from 'contexts/client';
import {
  Box,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import GuildCard from 'components/GuildCard';

import { SIZES } from './theme';

//@ts-ignore
import type { Guild } from 'util/types';

import WalletLoader from 'components/WalletLoader';
import { AuthContext } from 'contexts/AuthContext';

import { useGetGuildsList } from 'hooks/useGetGuildsList';

const ExploreGuilds: NextPage = () => {
  const authContext = useContext(AuthContext);

  const [makeFake, setMakeFake] = useState(false);

  const router = useRouter();
  const { walletAddress, signingClient } = useSigningClient();
  const { fakeList } = useGetGuildsList();
  const [guilds, setGuilds] = useState<Guild[]>(fakeList);
  console.log('fakedata is', fakeList);

  useEffect(() => {
    if (authContext?.loggedAddress.length === 0) {
      setMakeFake(true);
      setGuilds(fakeList);
    }
  }, []); // Dependency array

  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredGuilds =
    guilds && guilds.length > 0
      ? guilds.filter((guild) =>
          guild.name.toLowerCase().includes(searchText.toLowerCase()),
        )
      : [];

  console.log('filtered ', filteredGuilds.length);
  return (
    <>
      {
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
      }

      <Box sx={{ margin: SIZES['lineHeight'] }}>
        <Grid container spacing={4}>
          {filteredGuilds.map((guild) => (
            <Grid item xs={12} md={6} lg={4} xl={3} key={guild.name}>
              <GuildCard
                handleClick={() => router.push(`/public-guild-view`)}
                guild={guild}
                key={guild.name}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default ExploreGuilds;
