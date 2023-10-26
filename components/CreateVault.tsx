import { useContext, useState } from 'react';
import { Cw4GroupNamedClient } from 'hooks/guildapp-ts/Cw4GroupNamed.client';
import { useSigningClient } from 'contexts/client';
import { GuildContext } from 'contexts/guildContext';

export default function VaultCreator() {
  const { walletAddress, signingClient } = useSigningClient();
  const [multisigCreated, setMultisigCreated] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const ctx = useContext(GuildContext);

  const createVault = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    //  console.log(JSON.stringify(leader), JSON.stringify(guildName));
    let instantiateVaultMsg = {
      group_addr: ctx?.guildAddress,
      threshold: { absolute_count: { weight: 2 } },
      max_voting_period: { time: 172800 },
      executor: null,
      proposal_deposit: null,
    };

    let res = await signingClient?.instantiate(
      walletAddress,
      521,
      instantiateVaultMsg,
      'bank',
      'auto',
    );
    if (res && res.contractAddress) {
      let contractAddress = res.contractAddress;
      setMultisigCreated(contractAddress);
    } else {
      console.error('Error creating multisig.');
    }

    setLoading(false);
  };

  const linkVaultGuild = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!signingClient || !multisigCreated || !ctx?.guildAddress) return;
    let client = new Cw4GroupNamedClient(
      signingClient,
      walletAddress,
      ctx.guildAddress,
    );
    let res = await client.addHook({ addr: multisigCreated }, 'auto');

    if (res) {
      setSuccess('Perfect! you have a new multisig');
    } else {
      console.error('Error creating multisig.');
    }
    setLoading(false);
  };

  return (
    <>
      {!success ? (
        <>
          {multisigCreated ? (
            <>
              You need to link your multisig ({multisigCreated})
              <button onClick={linkVaultGuild}>Link with your guild</button>
            </>
          ) : (
            <>
              Create a vault for {ctx?.guildContract?.label}
              <br />
              <button onClick={createVault}>Create</button>
            </>
          )}
        </>
      ) : (
        <b>{success}</b>
      )}
    </>
  );
}
