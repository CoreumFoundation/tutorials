import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';
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
  guildProposals: any;//Proposal[];
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
  const [guildProposals, setGuildProposals] = useState<any[]>([])
  const fetched = useRef<boolean>(false)

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
        //console.log(`contract ${response}`);
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
  async function getProposals(guildVaults:string[]) {
    try {
      let proposalsMsg = {
        reverse_proposals: {
            start_before: null,
            limit: null
        }
      }
      for (let i = 0; i < guildVaults.length; i++) {
//        console.log(`searching proposals for vault: ${guildVaults[i]}`)
        let proposals = await signingClient?.queryContractSmart(
          guildVaults[i], proposalsMsg
        )
        if (proposals?.proposals) { 
          let proposals_o = proposals.proposals.map((p: any) => ({...p, vault: guildVaults[i]}))
          setGuildProposals((guildProposals) => [...guildProposals, ...proposals_o]) 
        }
      }
      //console.log(`proposals ${acu}`)
    } catch (err: any) {
        console.error(err.toString())
    }            
  }
  useEffect(() => {
    if (guildAddress) {
      getMultisigs(guildAddress);
      getMembers(guildAddress);
      getAdmin(guildAddress);
    }
  }, [guildContract]);
  
  useEffect(() => {
    if (guildVaults.length > 0 && !fetched.current) {
      getProposals(guildVaults)
      fetched.current = true 
    }
  }, [guildVaults])

  return (
    <GuildContext.Provider
      value={{
        guildAddress,
        guildVaults,
        guildContract,
        guildAdmin,
        guildMembers,
        guildProposals,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
};
