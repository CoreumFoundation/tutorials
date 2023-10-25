import { useState, useEffect } from 'react';
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

const ExploreGuilds: NextPage = () => {
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const { walletAddress, signingClient } = useSigningClient();
  console.log('signingClient', signingClient);

  const [searchText, setSearchText] = useState('');

  async function getDataFromContract(signingClient: SigningCosmWasmClient) {
    if (!signingClient) {
      return [];
    }
    let data = await signingClient.getContracts(
      process.env.NEXT_PUBLIC_CONTRACT_NUMBER,
    );

    let list = data.map((x) => {
      return x;
    });

    let acu = [];
    for (let i = 0; i < list.length; i++) {
      let guild_address = list[i];
      //      console.log(`calling ${guild_address}`)
      //@ts-ignore
      let guild_data = await signingClient.getContract(guild_address);
      //      console.log(`::> ${JSON.stringify(guild_data)}`)
      acu.push(guild_data);
    }
    setGuilds(acu);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    function fetchData() {
      const result = getDataFromContract(signingClient);
    }

    fetchData();
  }, [signingClient]);

  const filteredGuilds = guilds?.filter((guild) =>
    guild.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  console.log("guilds",guilds);

  return (
    <>
      {/* {filteredGuilds.length ? (
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
      ) : null} */}

      <Box sx={{ margin: SIZES['lineHeight'] }}>
        <Grid container spacing={4}>
          {filteredGuilds.length ? (
            filteredGuilds.map((guild) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={guild.name}>
                <GuildCard
                  handleClick={() => router.push(`/guild/${guild.address}`)}
                  guild={guild}
                  key={guild.name}
                />
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
