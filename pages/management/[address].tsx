import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListSubheader,
} from '@mui/material';
//@ts-ignore
import { Guild, Member } from 'util/types'
import { useSigningClient } from 'contexts/client';
import styled from '@emotion/styled';
import { SIZES } from 'pages/theme';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GuildMembers from 'components/GuildMembers';
import GuildProfile from 'components/GuildProfile';
import Purpose from 'components/Purpose';
import UserProfile from 'components/UserProfile';
import Vaults from 'components/Vaults';
import Vote from 'components/Vote';
import { useSearchParams } from 'next/navigation'

const MANAGEMENT_CONTENT = {
  USER_PROFILE: 'user-profile',
  GUILD_PROFILE: 'guild-profile',
  GUILD_MEMBERS: 'guild-members',
  PURPOSE: 'purpose',
  VAULTS: 'vaults',
  VOTE: 'vote',
} as const;

type ManagementContent =
  (typeof MANAGEMENT_CONTENT)[keyof typeof MANAGEMENT_CONTENT];

const SidebarSubHeader = styled(ListSubheader)`
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  marginleft: ${SIZES.lineHeight}rem;
`;

const StyledListItemButton = styled(ListItemButton)`
  padding-left: ${SIZES.lineHeight * 2}rem;
`;

type SidebarProps = {
  setSelectedMenuOption: (option: ManagementContent) => void;
  selectedMenuOption: ManagementContent;
};

const Sidebar = ({ setSelectedMenuOption }: SidebarProps) => {
  const { walletAddress, signingClient } = useSigningClient()
  const [guildContract, setGuildContract] = useState<Guild | null>(null)
  const [guildMultisigs, setGuildMultisigs] = useState<string[]>([])
  const [guildMembers, setGuildMembers] = useState<Member[]>([])
  const [guildAdmin, setGuildAdmin] = useState<string>("")
  const searchParams = useSearchParams()
  const guildAddress = searchParams.get('address')

  useEffect(() => {
    if (!signingClient || !walletAddress || !guildAddress) {
      return;
    }

    signingClient
      .getContract(guildAddress)
      .then((response: Guild) => {
        console.log(`contract ${response}`)
        setGuildContract(response);
      })
      .catch((error) => {
        console.error(`Error! ${error.message}`);
      });
  }, [signingClient, walletAddress, guildAddress]);

  async function getMultisigs(address:string) {
    try {
        let hooksMsg = {
            hooks: {}
        }
        let hooks = await signingClient?.queryContractSmart(
            address, hooksMsg
        )
        if (hooks?.hooks) { setGuildMultisigs([hooks.hooks]) }
    } catch (err: any) {
        console.error(err.toString())
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
      getMultisigs(guildAddress)
      getMembers(guildAddress)
      getAdmin(guildAddress)      
    }
  }, [guildAddress])
    
  return (
    <Box>
      <List>
        <SidebarSubHeader>
          Profile <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          selected={selectedMenuOption === MANAGEMENT_CONTENT.USER_PROFILE}
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.USER_PROFILE)}
        >
          My profile
        </StyledListItemButton>

        <SidebarSubHeader>
          Guild <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          selected={selectedMenuOption === MANAGEMENT_CONTENT.GUILD_PROFILE}
          onClick={() =>
            setSelectedMenuOption(MANAGEMENT_CONTENT.GUILD_PROFILE)
          }
        >
          Guild profile
        </StyledListItemButton>
        <StyledListItemButton
          selected={selectedMenuOption === MANAGEMENT_CONTENT.GUILD_MEMBERS}
          onClick={() =>
            setSelectedMenuOption(MANAGEMENT_CONTENT.GUILD_MEMBERS)
          }
        >
          Members
        </StyledListItemButton>
        <StyledListItemButton
          selected={selectedMenuOption === MANAGEMENT_CONTENT.VAULTS}
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.VAULTS)}
        >
          Vaults
        </StyledListItemButton>
        <SidebarSubHeader>
          Governance <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          selected={selectedMenuOption === MANAGEMENT_CONTENT.VOTE}
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.VOTE)}
        >
          Vote
        </StyledListItemButton>
        <StyledListItemButton
          selected={selectedMenuOption === MANAGEMENT_CONTENT.PURPOSE}
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.PURPOSE)}
        >
          Purpose
        </StyledListItemButton>
      </List>
    </Box>
  );
};

const Content = styled('div')`
  padding: 2rem;
  flex: 1;
`;

interface IProps {
  guildContract: Guild,
  guildMembers: Member[],
  guildAdmin: string,
  guildMultisigs: string[],
}

const Management = (props: IProps) => {
  const [selectedMenuOption, setSelectedMenuOption] =
    useState<ManagementContent>(MANAGEMENT_CONTENT.USER_PROFILE);

  const renderContent = () => {
    switch (selectedMenuOption) {
      case MANAGEMENT_CONTENT.USER_PROFILE:
        return <UserProfile />;
      case MANAGEMENT_CONTENT.GUILD_PROFILE:
        return <GuildProfile />;
      case MANAGEMENT_CONTENT.GUILD_MEMBERS:
        return <GuildMembers />;
      case MANAGEMENT_CONTENT.PURPOSE:
        return <Purpose />;
      case MANAGEMENT_CONTENT.VAULTS:
        return <Vaults />;
      case MANAGEMENT_CONTENT.VOTE:
        return <Vote />;
      default:
        return <div>This could not be a possible option</div>;
    }
  };

  return (
    <Box
      style={{
        textAlign: 'left',
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Sidebar
        setSelectedMenuOption={setSelectedMenuOption}
        selectedMenuOption={selectedMenuOption}
      />
      <Content>{renderContent()}</Content>
    </Box>
  );
};

export default Management;
