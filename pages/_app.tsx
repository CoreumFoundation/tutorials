import { useEffect } from "react";
import type { AppProps } from 'next/app';

import { SigningClientProvider } from 'contexts/client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import '../styles/globals.css';
import theme from './theme';

import Layout from 'components/Layout';



function MyApp({ Component, pageProps }: AppProps) {
  useEffect(()=>{
    const chainId = "coreum-testnet-1";

    // Enabling before using the Keplr is recommended.
    // This method will ask the user whether to allow access if they haven't visited this website.
    // Also, it will request that the user unlock the wallet if the wallet is locked.
    //await window.keplr.enable(chainId);

    const offlineSigner = window.keplr.getOfflineSigner(chainId);

    // You can get the address/public keys by `getAccounts` method.
    // It can return the array of address/public key.
    // But, currently, Keplr extension manages only one address/public key pair.
    // XXX: This line is needed to set the sender address for SigningCosmosClient.
    const accounts = offlineSigner.getAccounts().then(response =>{
      console.log(response)
    });



  },[])
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
