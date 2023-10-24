import { ReactNode } from 'react';
import Head from 'next/head';
import { Paper, Box } from '@mui/material';
import styled from '@emotion/styled';
import Nav from './Nav';

import Footer from './Footer';

const StyledMain = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 80vh;
`;

const StyledBox = styled(Box)`
  min-height: 100vh;
`;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <StyledBox>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
        <meta name="description" content="Guild DApp - created for hackaton" />
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Nav />
      <StyledMain>{children}</StyledMain>
      <Footer />
    </StyledBox>
  );
}
