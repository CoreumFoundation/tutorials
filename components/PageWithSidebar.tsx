import { ReactNode } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import styled from '@emotion/styled';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          top: '64px',
        },
      }}
    >
      <List>
        {['Inbox', 'Mail'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

const Content = styled('div')`
  margin-left: 240px;
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
