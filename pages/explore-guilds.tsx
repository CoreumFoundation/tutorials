import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/styles';

//@ts-ignore
import { type Guild } from 'util/types';

import { useGetGuildsList } from 'hooks/useGetGuildsList';
import { SIZES } from './theme';
import { useState, useEffect } from 'react';

import { useSigningClient } from 'contexts/client';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';


async function getDataFromContract(signingClient: SigningCosmWasmClient) {
  if(!signingClient) {
    return [];
  }
  console.log("29:::", signingClient);
  let data = await signingClient.getContracts(process.env.NEXT_PUBLIC_CONTRACT_NUMBER);
  console.log(data);
  return { "key": "value" };
}

function GuildCard({ guild }: { guild: Guild }) {
  const StyledName = styled(Typography)({
    textTransform: 'none',
  });
  const redirect = useRouter();

  return (
    <Card onClick={() => redirect.push('explore-guild')}>
      <CardActionArea
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 150, objectFit: 'cover', height: 150 }}
          image={guild.thumbnail}
          alt={guild.name}
        />
        <CardContent sx={{ textAlign: 'left', margin: SIZES.lineHeight }}>
          <StyledName variant="h5" gutterBottom>
            {guild.name}
          </StyledName>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            <b>members: {guild.totalMembers}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const ExploreGuilds: NextPage = () => {
  const { guilds } = useGetGuildsList();
  const { walletAddress, signingClient } = useSigningClient();

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
