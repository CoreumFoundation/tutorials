import { useEffect, useState, useRef } from 'react';

import type { NextPage } from 'next';

//@ts-ignore
import type { Guild } from 'util/types';

import { useSigningClient } from 'contexts/client';

import WalletLoader from 'components/WalletLoader';

const Home: NextPage = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const fetched = useRef<boolean>(false);

  const [loading, setLoading] = useState(false);

  const { signingClient } = useSigningClient();

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

  return <WalletLoader loading={loading}></WalletLoader>;
};

export default Home;
