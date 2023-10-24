import { ReactNode } from 'react';
import { Drawer, List, ListItemButton, ListSubheader } from '@mui/material';

import styled from '@emotion/styled';
import { SIZES } from 'pages/theme';
import { useRouter } from 'next/navigation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

const Sidebar = () => {
  const router = useRouter();
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
          onClick={() =>
            router.push(
              '/management/user-profile/testcore1rwufsu4v98jc5zlt928ta70fjzml42fgxq03au3jedqmq79933cqm2557z', //Todo replace and create component
            )
          }
        >
          My profile
        </StyledListItemButton>

        <SidebarSubHeader>
          Guild <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          onClick={() =>
            router.push(
              '/management/guild-profile/testcore1rwufsu4v98jc5zlt928ta70fjzml42fgxq03au3jedqmq79933cqm2557z', //Todo replace and create component
            )
          }
        >
          Guild profile
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() =>
            router.push(
              '/management/members/testcore1rwufsu4v98jc5zlt928ta70fjzml42fgxq03au3jedqmq79933cqm2557z', //Todo replace and create component
            )
          }
        >
          Members
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() =>
            router.push(
              '/management/vaults/testcore1rwufsu4v98jc5zlt928ta70fjzml42fgxq03au3jedqmq79933cqm2557z', //Todo replace and create component
            )
          }
        >
          Vaults
        </StyledListItemButton>
        <SidebarSubHeader>
          Governance <ChevronRightIcon />
        </SidebarSubHeader>
        <StyledListItemButton
          onClick={() =>
            router.push(
              '/management/vote/testcore1rwufsu4v98jc5zlt928ta70fjzml42fgxq03au3jedqmq79933cqm2557z', //Todo replace and create component
            )
          }
        >
          Vote
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() =>
            router.push(
              '/management/purpose/testcore1rwufsu4v98jc5zlt928ta70fjzml42fgxq03au3jedqmq79933cqm2557z', //Todo replace and create component
            )
          }
        >
          Purpose
        </StyledListItemButton>
      </List>
    </Drawer>
  );
};

const Content = styled('div')`
  padding: 2rem;
  flex: 1;
`;

const PageWithSidebar = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      <Sidebar />
      <Content>{children}</Content>
    </div>
  );
};

export default PageWithSidebar;
