import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { SigningClientProvider } from 'contexts/client';
import { AuthProvider } from 'contexts/AuthContext'; // Import the AuthProvider
import { useRouter } from 'next/router';

import '../styles/globals.css';
import theme from './theme';
import Layout from 'components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  let isMetaverse = pathname.includes('metaverse');

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SigningClientProvider>
          {isMetaverse ? (
            <>
              <Component {...pageProps} />
            </>
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </SigningClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
