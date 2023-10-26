import Image from 'next/image';
import { useRouter } from 'next/router';

import Menu from '@mui/icons-material/Menu';
import styled from '@emotion/styled';
import { Button, Typography, Toolbar, Box, IconButton } from '@mui/material';

import { useSigningClient } from 'contexts/client';
import { AuthContext } from 'contexts/AuthContext';

import AppBar from '@mui/material/AppBar';

import { shortAddress } from 'util/conversion';
import { SIZES } from 'pages/theme';
import { StyledLink } from './StyledLink';
import { useContext, useEffect } from 'react';

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const ButtonContainer = styled(Box)``;
const AddressContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3.125rem;
  background: #504f4f;
  padding: 0.5rem 1.5rem;
`;

function Nav() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  //  console.log('authContext', authContext);
  const { walletAddress, connectWallet, disconnect } = useSigningClient();

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet();
      router.push('/guild-space');
    } else {
      disconnect();
      router.push('/');
      authContext.clearLoggedAddress();
    }
  };

  authContext?.loggedAddress;

  const PUBLIC_SITE_ICON_URL = process.env.NEXT_PUBLIC_SITE_ICON_URL || '';

  const renderNavOptions = () => {
    return (
      <Box display="flex" flexDirection="row" mr={3}>
        <AddressContainer>
          Log out: {shortAddress(walletAddress)}
        </AddressContainer>
        {/* <IconButton size="large">
          <Menu />
        </IconButton> */}
      </Box>
    );
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ backgroundColor: 'transparent' }}
    >
      <Toolbar
        style={{
          margin: `${SIZES['lineHeight'] / 2}rem ${SIZES['lineHeight']}rem`,
        }}
      >
        <LogoContainer>
          <StyledLink
            href={authContext?.loggedAddress?.length > 0 ? '/guild-space' : '/'}
            passHref
          >
            {PUBLIC_SITE_ICON_URL.length > 0 ? (
              <Image
                src={PUBLIC_SITE_ICON_URL}
                height={25}
                width={150}
                alt="Logo"
              />
            ) : (
              <Typography variant="h4" component="span">
                [GUILDHUB]
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
