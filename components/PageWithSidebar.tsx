import { useState } from 'react';
import { Drawer, List, ListItemButton, ListSubheader } from '@mui/material';

import styled from '@emotion/styled';
import { SIZES } from 'pages/theme';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import GuildMembers from './GuildMembers';
import GuildProfile from './GuildProfile';
import Purpose from './Purpose';
import Tokens from './Tokens';
import UserProfile from './UserProfile';
import Vaults from './Vaults';
import Vote from './Vote';

const MANAGEMENT_CONTENT = {
  GUILD_MEMBERS: 'guild-members',
  GUILD_PROFILE: 'guild-profile',
  PURPOSE: 'purpose',
  TOKENS: 'tokens',
  USER_PROFILE: 'user-profile',
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
};

const Sidebar = ({ setSelectedMenuOption }: SidebarProps) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          top: `${SIZES.lineHeight * 3.4}rem`,
        },
      }}
    >
      <List>
        <SidebarSubHeader>
          Profile <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.USER_PROFILE)}
        >
          My profile
        </StyledListItemButton>

        <SidebarSubHeader>
          Guild <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          onClick={() =>
            setSelectedMenuOption(MANAGEMENT_CONTENT.GUILD_PROFILE)
          }
        >
          Guild profile
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() =>
            setSelectedMenuOption(MANAGEMENT_CONTENT.GUILD_MEMBERS)
          }
        >
          Members
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.VAULTS)}
        >
          Vaults
        </StyledListItemButton>
        <SidebarSubHeader>
          Governance <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.VOTE)}
        >
          Vote
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() => setSelectedMenuOption(MANAGEMENT_CONTENT.PURPOSE)}
        >
          Propose
        </StyledListItemButton>
      </List>
    </Drawer>
  );
};

const Content = styled('div')`
  padding: 2rem;
  flex: 1;
`;

const PageWithSidebar = () => {
  const [selectedMenuOption, setSelectedMenuOption] =
    useState<ManagementContent>(MANAGEMENT_CONTENT.USER_PROFILE);

  const renderContent = () => {
    switch (selectedMenuOption) {
      case MANAGEMENT_CONTENT.USER_PROFILE:
        return <UserProfile />;
      case MANAGEMENT_CONTENT.TOKENS:
        return <Tokens />;
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
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      <Sidebar setSelectedMenuOption={setSelectedMenuOption} />
      <Content>{renderContent()}</Content>
    </div>
  );
};

export default PageWithSidebar;
