import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { sha256 } from 'js-sha256';

import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import { QueryNFTsResponse } from '../coreum/proto-ts/coreum/nft/v1beta1/query';
import { AssetNFT as AssetNFTTx, NFT as NFTTx } from '../coreum/tx';
import { EncodeObject } from '@cosmjs/proto-signing';

const nftClassSymbol = `kittens${Date.now()}`;

const generateKittenURL = () => {
  return `https://placekitten.com/${200 + Math.floor(Math.random() * 100)}/${
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
  const nftClassID = `${nftClassSymbol}-${walletAddress}`;

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
        id: `kitten-${Date.now()}`,
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
      {error.length > 0 && (
        <div>
          <label>{error}</label>
        </div>
      )}
      {transferID == '' && !classCreated && (
        <div>
          <h1>Create your {nftClassSymbol} NFT class</h1>
          <div>
            <input
              type="text"
              id="description"
              placeholder={`Class description`}
              onChange={(event) => setNFTClassDescription(event.target.value)}
              value={nftClassDescription}
            />
            <button onClick={createNFTClass}>Create</button>
          </div>
        </div>
      )}
      {transferID == '' && classCreated && (
        <div>
          <h1>Welcome to your {nftClassSymbol} collection!</h1>
          <h1>{nftClassDescription}</h1>
          <div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>ID</th>
                    <th>Owner</th>
                    <th>Hash</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {nfts.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td>
                          <div>
                            <div>
                              <div>
                                <img src={l.uri} alt="Images" />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{l.id}</td>
                        <td>{l.owner}</td>
                        <td>
                          <p>{l.uriHash}</p>
                        </td>
                        <td>
                          {walletAddress == l.owner && (
                            <button onClick={() => setTransferID(l.id)}>
                              Transfer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <img src={kittenURI} alt="" />
              <div>
                <button onClick={changeKitten}>Change</button>
                <button onClick={mintKitten}>Mint</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {transferID != '' && classCreated && (
        <div>
          <h1>Transfer {transferID} NFT ownership.</h1>
          <div>
            <input
              type="text"
              id="recipient-address"
              placeholder="Recipient address"
              onChange={(event) => setRecipientAddress(event.target.value)}
              value={recipientAddress}
            />
          </div>
          <div>
            <div>
              <button onClick={cancelTransferOwnership}>Cancel</button>
              <button onClick={transferOwnership}>Transfer</button>
            </div>
          </div>
        </div>
      )}
    </WalletLoader>
  );
};

export default NFT;
