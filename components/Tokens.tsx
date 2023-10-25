import { useState } from 'react';
import type { NextPage } from 'next';

import { Box, Button, Tab, Tabs, Typography } from '@mui/material';

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NoTokensView = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body1">
        You don't have any tokens yet. Create some!
      </Typography>
      <Box>
        <Button variant="contained">Create token</Button>
      </Box>
    </Box>
  );
};

const TokenCreation = () => {
  let hasTokens = false;

  return hasTokens ? <p>form</p> : <NoTokensView />;
};

const Tokens: NextPage = () => {
  const [tabNumber, setTabNumber] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tokens
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabNumber}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Tokens" {...a11yProps(0)} />
            <Tab label="My tokens" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
          <TokenCreation />
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          My tokens
        </CustomTabPanel>
      </Box>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default Tokens;
