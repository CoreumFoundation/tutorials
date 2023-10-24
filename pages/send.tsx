import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { Coin } from '@cosmjs/amino';
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/client';
import {
  convertDenomToMicroDenom,
  convertFromMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || '';

const Send: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient();
  const [balance, setBalance] = useState('');
  const [loadedAt, setLoadedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return;
    }
    setError('');
    setSuccess('');

    signingClient
      .getBalance(walletAddress, PUBLIC_STAKING_DENOM)
      .then((response: any) => {
        const { amount, denom }: { amount: number; denom: string } = response;
        setBalance(
          `${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`,
        );
      })
      .catch((error) => {
        setError(`Error! ${error.message}`);
      });
  }, [signingClient, walletAddress, loadedAt]);

  const handleSend = () => {
    setError('');
    setSuccess('');
    setLoading(true);
    const amount: Coin[] = [
      {
        amount: convertDenomToMicroDenom(sendAmount),
        denom: PUBLIC_STAKING_DENOM,
      },
    ];

    signingClient
      ?.sendTokens(walletAddress, recipientAddress, amount, 'auto')
      .then(() => {
        const message = `Success! Sent ${sendAmount}  ${convertFromMicroDenom(
          PUBLIC_STAKING_DENOM,
        )} to ${recipientAddress}.`;

        setLoadedAt(new Date());
        setLoading(false);
        setSendAmount('');
        setSuccess(message);
      })
      .catch((error) => {
        setLoading(false);
        setError(`Error! ${error.message}`);
      });
  };
  return (
    <WalletLoader loading={loading}>
      <p>Your wallet has {balance}</p>

      <h1>Send to {PUBLIC_CHAIN_NAME} recipient wallet address:</h1>
      <div className="flex w-full max-w-xl">
        <input
          type="text"
          id="recipient-address"
          placeholder={`${PUBLIC_CHAIN_NAME} recipient wallet address...`}
          onChange={(event) => setRecipientAddress(event.target.value)}
          value={recipientAddress}
        />
      </div>
      <div>
        <div>
          <input
            type="number"
            id="send-amount"
            placeholder="Amount..."
            step="0.1"
            onChange={(event) => setSendAmount(event.target.value)}
            value={sendAmount}
          />
          <span>{convertFromMicroDenom(PUBLIC_STAKING_DENOM)}</span>
        </div>
        <button onClick={handleSend}>SEND</button>
      </div>
      <div>
        {success.length > 0 && (
          <div className="alert alert-success">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <label>{success}</label>
            </div>
          </div>
        )}
        {error.length > 0 && (
          <div className="alert alert-error">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                ></path>
              </svg>
              <label>{error}</label>
            </div>
          </div>
        )}
      </div>
    </WalletLoader>
  );
};

export default Send;
