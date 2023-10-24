import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { sha256 } from 'js-sha256';

import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import { QueryNFTsResponse } from '../coreum/proto-ts/coreum/nft/v1beta1/query';
import { AssetNFT as AssetNFTTx, NFT as NFTTx } from '../coreum/tx';
import { EncodeObject } from '@cosmjs/proto-signing';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Typography,
  Grid,
  Avatar,
  Alert,
  Box,
  Paper,
} from '@mui/material';

const generateKittenURL = () => {
  return `https://some-fake-url/${200 + Math.floor(Math.random() * 100)}/${
    200 + Math.floor(Math.random() * 100)
  }`;
};

const NFT: NextPage = () => {
  const { walletAddress, signingClient, coreumQueryClient } =
    useSigningClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classCreated, setClassCreated] = useState(false);
  const [nftClassDescription, setNFTClassDescription] = useState('');
  const [nfts, setNfts] = useState<
    {
      classId: string;
      id: string;
      uri: string;
      uriHash: string;
      owner: string;
    }[]
  >([]);
  const [kittenURI, setKittenURI] = useState(generateKittenURL());
  const [transferID, setTransferID] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  //  const nftClassID = `${nftClassSymbol}-${walletAddress}`
  const nftClassID = `msgnft-${walletAddress}`;
  const nftClassSymbol = nftClassID; //`kittens${Date.now()}`

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return;
    }
    setError('');
    setLoading(true);
    queryClass();
  }, [signingClient, walletAddress]);

  const queryNFTs = () => {
    setLoading(true);
    coreumQueryClient
      ?.NFTClient()
      .NFTs({
        classId: nftClassID,
        owner: '',
      })
      .then(async (res: QueryNFTsResponse) => {
        const nfts = await Promise.all(
          res.nfts.map(async (nft) => {
            const resOwner = await coreumQueryClient?.NFTClient().Owner({
              classId: nft.classId,
              id: nft.id,
            });
            return {
              classId: nft.classId,
              id: nft.id,
              uri: nft.uri,
              uriHash: nft.uriHash,
              owner: resOwner.owner,
            };
          }),
        );
        nfts.sort((a, b) => a.id.localeCompare(b.id));
        setNfts(nfts);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(`Error! ${error.message}`);
      });
  };

  const queryClass = () => {
    // check that class is already created
    coreumQueryClient
      ?.NFTClient()
      .Class({ classId: nftClassID })
      .then(() => {
        queryNFTs();
        setClassCreated(true);
      })
      .catch((error) => {
        setLoading(false);
        if (error.message.includes('not found class')) {
          setClassCreated(false);
          return;
        }
        setError(`Error! ${error.message}`);
      });
  };

  const createNFTClass = () => {
    setError('');
    setLoading(true);

    sendTx([
      AssetNFTTx.MsgIssueClass({
        issuer: walletAddress,
        symbol: nftClassSymbol,
        description: nftClassDescription,
      }),
    ]).then((passed) => {
      setClassCreated(passed);
    });
  };

  const changeKitten = () => {
    setKittenURI(generateKittenURL());
  };

  const mintKitten = () => {
    setError('');
    setLoading(true);
    sendTx([
      AssetNFTTx.MsgMint({
        sender: walletAddress,
        classId: nftClassID,
        id: `msgnft-${Date.now()}`,
        uri: kittenURI,
        uriHash: sha256.create().update(kittenURI).hex(),
      }),
    ]).then((passed) => {
      if (passed) {
        queryNFTs();
      }
    });
  };

  const cancelTransferOwnership = () => {
    setError('');
    setTransferID('');
    setRecipientAddress('');
  };

  const transferOwnership = () => {
    setError('');
    setLoading(true);
    sendTx([
      NFTTx.MsgSend({
        sender: walletAddress,
        classId: nftClassID,
        id: transferID,
        receiver: recipientAddress,
      }),
    ]).then((passed) => {
      if (passed) {
        cancelTransferOwnership();
        queryNFTs();
      }
    });
  };

  const sendTx = async (msgs: readonly EncodeObject[]) => {
    try {
      const resp = await signingClient?.signAndBroadcast(
        walletAddress,
        msgs,
        'auto',
      );
      console.log(`Tx hash: ${resp?.transactionHash}`);
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setError(`Error! ${error}`);
      return false;
    }
  };

  return (
    <WalletLoader loading={loading}>
      {error.length > 0 && <Alert severity="error">{error}</Alert>}
      {transferID === '' && !classCreated && (
        <Paper>
          <Typography variant="h3" gutterBottom>
            Create your {nftClassSymbol} NFT class
          </Typography>
          <Container sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Class description"
              onChange={(event) => setNFTClassDescription(event.target.value)}
              value={nftClassDescription}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={createNFTClass}
            >
              Create
            </Button>
          </Container>
        </Paper>
      )}
      {transferID === '' && classCreated && (
        <Box>
          <Typography variant="h3" gutterBottom>
            Welcome to your {nftClassSymbol} collection!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {nftClassDescription}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Hash</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nfts.map((l, k) => (
                    <TableRow key={k}>
                      <TableCell>
                        <Avatar src={l.uri} alt="Images" />
                      </TableCell>
                      <TableCell>{l.id}</TableCell>
                      <TableCell>{l.owner}</TableCell>
                      <TableCell>{l.uriHash}</TableCell>
                      <TableCell>
                        {walletAddress === l.owner && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setTransferID(l.id)}
                          >
                            Transfer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={6}>
              <img
                src={kittenURI}
                alt=""
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  height: '200px',
                  width: '200px',
                }}
              />
              <Container
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={changeKitten}
                >
                  Change
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={mintKitten}
                >
                  Mint
                </Button>
              </Container>
            </Grid>
          </Grid>
        </Box>
      )}
      {transferID !== '' && classCreated && (
        <Paper>
          <Typography variant="h3" gutterBottom>
            Transfer {transferID} NFT ownership.
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Recipient address"
            onChange={(event) => setRecipientAddress(event.target.value)}
            value={recipientAddress}
            sx={{ my: 2 }}
          />
          <Container
            sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={cancelTransferOwnership}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={transferOwnership}
            >
              Transfer
            </Button>
          </Container>
        </Paper>
      )}
    </WalletLoader>
  );
};

export default NFT;
