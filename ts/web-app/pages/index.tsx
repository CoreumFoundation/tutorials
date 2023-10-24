import { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';
import styled from '@emotion/styled';
import { Typography, Card, CardContent, Paper, Box } from '@mui/material';

//@ts-ignore
import type { Guild } from 'util/types';

import { useSigningClient } from 'contexts/client';

import WalletLoader from 'components/WalletLoader';
import { StyledLink } from 'components/StyledLink';

const StyledCard = styled(Card)`
  margin: 1rem;
  max-width: 384px;
  padding: 1rem;
  text-align: center;
`;

const StyledTitle = styled(Typography)`
  color: ${(props) => props.theme.palette.primary.main};
`;
const Home: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const fetched = useRef<boolean>(false);

  async function getContracts() {
    //@ts-ignore
    let data = await signingClient.getContracts(522);
    //    console.log(JSON.stringify(data))
    let list = data.map((x) => {
      return x;
    });
    let acu = [];
    for (let i = 0; i < list.length; i++) {
      let guild_address = list[i];
      //      console.log(`calling ${guild_address}`)
      //@ts-ignore
      let guild_data = await signingClient.getContract(guild_address);
      //      console.log(`::> ${JSON.stringify(guild_data)}`)
      acu.push(guild_data);
    }
    setGuilds(acu);
  }

  const shortAddress = (addr: string) => {
    let shorted = `${addr.slice(0, 4)}...${addr.slice(-4, addr.length)}`;
    return shorted;
  };

  useEffect(() => {
    if (signingClient && !fetched.current) {
      getContracts();
      fetched.current = true;
    }
  }, [signingClient, fetched]);

  return (
    <WalletLoader>
      <Typography variant="h5" gutterBottom>
        Your wallet address is:
        <StyledLink
          href={
            process.env.NEXT_PUBLIC_CHAIN_EXPLORER +
            'coreum/accounts/' +
            walletAddress
          }
          passHref
          target="_blank"
        >
          {walletAddress}
        </StyledLink>
      </Typography>

      <Box>
        {/*
         <StyledCard variant="outlined">
          <CardContent>
            <StyledLink
              href="https://docs.coreum.dev/tools-ecosystem/faucet.html"
              passHref
              target="_blank"
            >
              <Typography variant="h5" gutterBottom>
                Fund wallet
              </Typography>
              <Typography>
                Fund you wallet for the {process.env.NEXT_PUBLIC_CHAIN_NAME}.
              </Typography>
            </StyledLink>
          </CardContent>
        </StyledCard>

        <StyledCard variant="outlined">
          <CardContent>
            <StyledLink href="/send" passHref>
              <Typography variant="h5" gutterBottom>
                Send to wallet
              </Typography>
              <Typography>
                Execute a transaction to send funds to a wallet address.
              </Typography>
            </StyledLink>
          </CardContent>
        </StyledCard>

        <StyledCard variant="outlined">
          <CardContent>
            <StyledLink href="/nft" passHref>
              <Typography variant="h5" gutterBottom>
                NFT
              </Typography>
              <Typography>
                Create you NFT class and mint NFTs for it.
              </Typography>
            </StyledLink>
          </CardContent>
        </StyledCard>
 */}
        <StyledCard variant="elevation">
          <CardContent>
            <StyledLink href="/multisig" passHref>
              <StyledTitle variant="h5" gutterBottom>
                Guild creator
              </StyledTitle>
              <Typography>
                Create a multisig with your peers and start management of your
                group's assets.
              </Typography>
            </StyledLink>
          </CardContent>
        </StyledCard>
      </Box>
      <hr />
      <Paper>
        {guilds.length > 0 && (
          <Box>
            {guilds.map((g: Guild) => {
              return (
                <Paper key={g}>
                  {g.label}
                  <hr />
                  <Typography>Created by {shortAddress(g.creator)}</Typography>
                  <StyledLink href={`/guild/${g.address}`} passHref>
                    Enter
                  </StyledLink>
                </Paper>
              );
            })}
          </Box>
        )}
      </Paper>
    </WalletLoader>
  );
};

export default Home;
