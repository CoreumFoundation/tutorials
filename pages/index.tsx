import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

import styled from '@emotion/styled';

import { Typography, Box, Grid, Container, Button } from '@mui/material';

//@ts-ignore
import type { Guild } from 'util/types';

import { useSigningClient } from 'contexts/client';

import WalletLoader from 'components/WalletLoader';
import GuildCard from 'components/GuildCard';

const StyledTitle = styled(Typography)`
  color: ${(props) => props.theme.palette.primary.main};
`;

const Home: NextPage = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const fetched = useRef<boolean>(false);

  const router = useRouter();


  const [loading,setLoading] = useState(false);


  const { walletAddress, signingClient } = useSigningClient();

  async function getContracts() {

    setLoading(true);
    //@ts-ignore
    let data = await signingClient.getContracts(522);
    //    console.log(JSON.stringify(data))
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
    setLoading(false);
  }

  useEffect(() => {
    if (signingClient && !fetched.current) {
      getContracts();
      fetched.current = true;
    }
  }, [signingClient, fetched]);

  return (
    <WalletLoader loading={loading}>
    </WalletLoader>
  );
};

export default Home;
