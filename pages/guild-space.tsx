import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

import styled from '@emotion/styled';

import {
  Typography,
  Box,
  Grid,
  Container,
  Button,
  CircularProgress,
} from '@mui/material';

//@ts-ignore
import type { Guild } from 'util/types';

import { useSigningClient } from 'contexts/client';

import GuildCard from 'components/GuildCard';
import { guildCreatorCodeId, vaultCreatorCodeId } from 'util/constants';

const StyledTitle = styled(Typography)`
  color: ${(props) => props.theme.palette.primary.main};
`;

const GuildSpace: NextPage = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const fetched = useRef<boolean>(false);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { signingClient } = useSigningClient();

  async function getContracts() {
    setLoading(true);
    //@ts-ignore
    let data = await signingClient.getContracts(guildCreatorCodeId);
    console.log(data)
    let list = data.map((x) => {
      return x;
    });
    let acu = [];
    for (let i = 0; i < list.length; i++) {
      let guild_address = list[i];
      //@ts-ignore
      let guild_data = await signingClient.getContract(guild_address);

      let membersMsg = {
        list_members: {
          start_after: null,
          limit: null,
        },
      };
      let membersList = await signingClient?.queryContractSmart(
        guild_address,
        membersMsg,
      );

      if (membersList?.members) {
        guild_data.member = membersList.members;
        guild_data.member_count = membersList.members.length;
      } else {
        setError('No members could be found');
      }

      acu.push(guild_data);
    }
    setGuilds(acu);
    setLoading(false);
  }

  useEffect(() => {
    if (signingClient && !fetched.current) {
      getContracts();
      fetched.current = true;
    }
  }, [signingClient, fetched]);

  if (loading) {
    return (
      <Box maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {guilds.length === 0 && (
        <Container>
          <Box sx={{ marginBottom: 8 }}>
            <StyledTitle variant="h5" gutterBottom>
              You have no guilds
            </StyledTitle>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h4" gutterBottom>
              Create your first Guild
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1">
              Create your first guild to be able to invite members, set a
              governance and manage the vault.
            </Typography>
          </Box>
          <Box style={{ marginTop: '10rem' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/multisig')}
            >
              Create Guild
            </Button>
          </Box>
        </Container>
      )}

      {guilds.length > 0 && (
        <Container>
          <Box sx={{ marginBottom: 6 }}>
            <StyledTitle variant="h5" gutterBottom>
              You are part of {guilds.length}
              {` `}
              {guilds.length === 1 ? 'guild' : 'guilds'}
            </StyledTitle>
          </Box>
          <Grid container spacing={4}>
            {guilds.map((guild) => (
              <Grid item xs={12} md={6} key={guild.name}>
                <GuildCard
                  handleClick={() => router.push(`/metaverse/${guild.address}`)}
                  guild={{
                    name: guild.label, // Todo check the types
                    totalMembers: guild.member_count, // Todo get this from the contract
                    thumbnail:
                      'https://i.pinimg.com/564x/06/0d/21/060d2195df7a10d4fd8e37fde4cf5320.jpg',
                  }}
                  key={guild.name}
                />
              </Grid>
            ))}
          </Grid>
          <Box style={{ marginTop: '10rem' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/multisig')}
            >
              Create Guild
            </Button>
          </Box>
        </Container>
      )}
    </>
  );
};

export default GuildSpace;
