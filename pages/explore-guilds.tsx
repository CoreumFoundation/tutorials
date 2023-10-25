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
      522
    );

    let list = data.map((x) => {
      return x;
    });

    let acu = [];

    for (let i = 0; i < list.length; i++) {
      let guild_address = list[i];
      //@ts-ignore
      let guild_data = await signingClient.getContract(guild_address);

      // 获取 membersList
      let membersMsg = {
        list_members: {
          start_after: null,
          limit: null,
        },
      };
      let membersList = await signingClient?.queryContractSmart(
        guild_address,  // 注意这里使用 guild_address
        membersMsg,
      );

      // 如果 membersList?.members 存在，将其添加到 guild_data
      if (membersList?.members) {
        guild_data.member = membersList.members;
        guild_data.member_count = membersList.members.length;
      } else {
        setError('No members could be found');
      }

      acu.push(guild_data);
    }
    setGuilds(acu);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    getDataFromContract(signingClient);
  }, [signingClient]);
  console.log("guilds", guilds);


  const filteredGuilds = guilds && guilds.length > 0
    ? guilds.filter((guild) => guild.label.toLowerCase().includes(searchText.toLowerCase()))
    : [];


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
          {filteredGuilds.length && guilds.length > 0 ? (
            filteredGuilds.map((guild) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={guild.name}>
                <GuildCard
                  handleClick={() => router.push(`/guild/${guild.address}`)}
                  guild={{
                    name: guild.label, // Todo check the types
                    totalMembers: guild.member_count,
                    thumbnail:
                      'https://i.pinimg.com/564x/06/0d/21/060d2195df7a10d4fd8e37fde4cf5320.jpg',
                  }}
                  key={guild.name}
                />
              </Grid>
            ))
          ) : (
            <Box
              maxWidth="sm"
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              {/* <CircularProgress /> */}
            </Box>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default ExploreGuilds;
