import { useState } from 'react'
import { Cw4GroupNamedClient } from 'hooks/guildapp-ts/Cw4GroupNamed.client'
import { useSigningClient } from 'contexts/client'

interface IProps {
    guildName: string,
    guildAddress: string,
}

export default function CreateVault(props: IProps) {
    const { walletAddress, signingClient } = useSigningClient()
    const [multisigCreated, setMultisigCreated] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')    
    
    const createVault = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
    //    console.log(JSON.stringify(leader), JSON.stringify(guildName));
        let instantiateVaultMsg = {
        group_addr: props.guildAddress,
        threshold: {absolute_count: {weight: 2}},
        max_voting_period: {time: 172800},
        executor: null,
        proposal_deposit: null
        };

        let res = await signingClient?.instantiate(
        walletAddress,
        521,
        instantiateVaultMsg,
        "bank",
        "auto"
        );

        // Check if 'res' contains 'contractAddress' property
        if (res && res.contractAddress) {
        let contractAddress = res.contractAddress;
        if (contractAddress) setMultisigCreated(contractAddress)
        
        } else {
        console.error("Error creating multisig.");
        }

        setLoading(false);
    };

    const linkVaultGuild = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        if (!signingClient || !multisigCreated) return
        let client = new Cw4GroupNamedClient(signingClient, walletAddress, props.guildAddress)
        let res = await client.addHook({addr: multisigCreated}, "auto") 

        if (res) {
        setSuccess("Perfect! you have a new multisig")     
        } else {
        console.error("Error creating multisig.");
        }
        setLoading(false);    
    }

    return (
    <>
        {loading ? 
            <>
                {multisigCreated ? 
                <>
                You need to link your multisig ({multisigCreated}) 
                <button
                    onClick={linkVaultGuild}
                    >Link with your guild</button>
                </>
                :
                <>
                Create a vault for {props.guildName}
                <hr />
                <button
                onClick={createVault}
                >Create</button>
                </>
                }
            </>
            :
            <p>Loading</p>
        }
    </>)
}