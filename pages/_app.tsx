import type { AppProps } from 'next/app';

import { SigningClientProvider } from 'contexts/client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import '../styles/globals.css';
import theme from './theme';

import Layout from 'components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SigningClientProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SigningClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
