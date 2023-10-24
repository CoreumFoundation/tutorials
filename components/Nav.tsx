import Image from 'next/image';
import Router from 'next/router';

import Menu from '@mui/icons-material/Menu';
import styled from '@emotion/styled';
import { Button, Typography, Toolbar, Box, IconButton } from '@mui/material';

import { useSigningClient } from 'contexts/client';
import { AuthContext } from 'contexts/AuthContext';

import AppBar from '@mui/material/AppBar';

import { shortAddress } from 'util/conversion';
import { SIZES } from 'pages/theme';
import { StyledLink } from './StyledLink';
import { useContext } from 'react';

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const LogoLink = styled(StyledLink)``;

const ButtonContainer = styled(Box)``;

function Nav() {
  const authContext = useContext(AuthContext);
  console.log('authContext', authContext);
  const { walletAddress, connectWallet, disconnect } = useSigningClient();
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet();
    } else {
      disconnect();
      Router.push('/');
    }
  };

  const PUBLIC_SITE_ICON_URL = process.env.NEXT_PUBLIC_SITE_ICON_URL || '';

  const renderNavOptions = () => {
    return (
      <Box>
        <Button variant="outlined" onClick={handleConnect}>
          Log out: {shortAddress(walletAddress)}
        </Button>
        <IconButton size="large">
          <Menu />
        </IconButton>
      </Box>
    );
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar
        style={{
          margin: `${SIZES['lineHeight'] / 2}rem ${SIZES['lineHeight']}rem`,
        }}
      >
        <LogoContainer>
          <StyledLink href="/" passHref>
            {PUBLIC_SITE_ICON_URL.length > 0 ? (
              <Image
                src={PUBLIC_SITE_ICON_URL}
                height={25}
                width={150}
                alt="Logo"
              />
            ) : (
              <Typography variant="h4" component="span">
                [GUILDAPP]
              </Typography>
            )}
          </StyledLink>
        </LogoContainer>
        <ButtonContainer>
          {walletAddress ? (
            renderNavOptions()
          ) : (
            <Button variant="outlined" color="primary" onClick={handleConnect}>
              Log in Guild
            </Button>
          )}
        </ButtonContainer>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
