import React, { createContext, useState, useEffect, ReactNode } from 'react';
//@ts-ignore
import { Guild, Member } from 'util/types';
import { useSigningClient } from './client';
import { useRouter } from 'next/router';

interface GuildContextProps {
  guildAddress: string | null;
  guildContract: Guild | null;
  guildVaults: string[];
  guildAdmin: string;
  guildMembers: Member[];
}

export const GuildContext = createContext<GuildContextProps | undefined>(
  undefined,
  /*  {
    guildAddress: null,
    guildContract: null,
    guildVaults: [],
    guildAdmin: '',
    guildMembers: []
} */
);

interface GuildProviderProps {
  children: ReactNode;
}

export const GuildProvider: React.FC<GuildProviderProps> = ({ children }) => {
  const router = useRouter();
  const [guildAddress, setGuildAddress] = useState<string>('');
  const { walletAddress, signingClient } = useSigningClient();
  const [guildContract, setGuildContract] = useState<Guild | null>(null);
  const [guildVaults, setGuildVaults] = useState<string[]>([]);
  const [guildMembers, setGuildMembers] = useState<Member[]>([]);
  const [guildAdmin, setGuildAdmin] = useState<string>('');

  useEffect(() => {
    let guildAddress = router.query.address;
    if (typeof guildAddress == 'string') {
      setGuildAddress(guildAddress);
    }
  }, [router]);

  useEffect(() => {
    if (!signingClient || !walletAddress || !guildAddress) {
      return;
    }

    signingClient
      .getContract(guildAddress)
      .then((response: Guild) => {
        console.log(`contract ${response}`);
        setGuildContract(response);
      })
      .catch((error) => {
        console.error(`Error! ${error.message}`);
      });
  }, [signingClient, walletAddress, guildAddress]);

  async function getMultisigs(address: string) {
    try {
      let hooksMsg = {
        hooks: {},
      };
      let hooks = await signingClient?.queryContractSmart(address, hooksMsg);
      if (hooks?.hooks) {
        setGuildVaults(hooks.hooks);
      }
    } catch (err: any) {
      console.error(err.toString());
    }
  }

  async function getMembers(address: string) {
    try {
      let membersMsg = {
        list_members: {
          start_after: null,
          limit: null,
        },
      };
      let membersList = await signingClient?.queryContractSmart(
        address,
        membersMsg,
      );
      //      console.log(`members list ${membersList}`)
      if (membersList?.members) {
        setGuildMembers(membersList.members);
      } else {
        console.error('No members could be found');
      }
    } catch (err: any) {
      console.error(err.toString());
    }
  }
  async function getAdmin(address: string) {
    try {
      let adminMsg = {
        admin: {},
      };
      let admin = await signingClient?.queryContractSmart(address, adminMsg);
      if (admin?.admin) {
        setGuildAdmin(admin.admin);
      }
    } catch (err: any) {
      console.error(err.toString());
    }
  }
  useEffect(() => {
    if (guildAddress) {
      getMultisigs(guildAddress);
      getMembers(guildAddress);
      getAdmin(guildAddress);
    }
  }, [guildContract]);

  return (
    <GuildContext.Provider
      value={{
        guildAddress,
        guildVaults,
        guildContract,
        guildAdmin,
        guildMembers,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
};
