import { useContext, useState } from 'react'
//@ts-ignore
import { Member } from 'util/types'
import { Container, Button, ListItem, List, ListItemText } from '@mui/material';
import { checkAddress } from 'utils/displayHelpers';
import { useSigningClient } from 'contexts/client';
import { Cw4GroupNamedClient } from 'hooks/guildapp-ts/Cw4GroupNamed.client';
import { GuildContext } from 'contexts/guildContext';

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;

function MembersManager() {
    const { walletAddress, signingClient } = useSigningClient();
    const [addMembers, setAddMembers] = useState<Member[]>([]);
    const [removeMembers, setRemoveMembers] = useState<string[]>([]); 
    const [newAddress, setNewAddress] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [newWeight, setNewWeight] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const ctx = useContext(GuildContext)
    const members = ctx?.guildMembers

    const handleEdit = async () => {
        setLoading(true);
        // @ts-ignore
        let client_override = new Cw4GroupNamedClient(signingClient, walletAddress, ctx?.guildAddress)

        const msg_p = {
            remove: removeMembers,
            add: addMembers,
        };

        if (!signingClient) return
        try {
            let res = await client_override.updateMembers(msg_p, "auto")            
            if (res) {
                console.log(JSON.stringify(res))
            }            
        } catch(err) {
            console.error(err)
        }
    };

    return (
        <div style={{border: "1px solid black"}}>
            <b>Add/Remove members</b>

            <Container sx={{ display: 'flex', my: 2 }}>
                <input
                placeholder={`${PUBLIC_CHAIN_NAME} address`}
                onChange={(event) => setNewAddress(event.target.value)}
                value={newAddress}
                type="text"
                id="recipient-address"
                className="input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center text-lg"
                />
                <input
                type="text"
                id="recipient-name"
                className="input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center text-lg"
                placeholder={`name for the member`}
                onChange={(event) => setNewName(event.target.value)}
                value={newName}
                />
                <input
                type="number"
                id="recipient-weight"
                className="input input-bordered focus:input-primary input-lg rounded-full flex-grow font-mono text-center text-lg"
                placeholder={`weight for the member`}
                onChange={(event) => {
                    let val = parseInt(event.target.value)
                    if (val >= 0) {
                    setNewWeight(val)
                    }
                }}
                value={newWeight}
                />
                <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    let err = checkAddress(
                    newAddress,
                    process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX || '',
                    );
                    setAddMembers((members) => [
                        ...members,
                        { addr: newAddress, name: newName, weight: newWeight/* , pubkey: pk */ },
                    ]);
                    setNewAddress('');
                    setNewName('');
                    setNewWeight(1);
                }}
                >
                Add Member
                </Button>
            </Container>
            {members && members.length > 0 &&
                <List>
                    {members.map((m: Member) => {return (
                        <ListItem
                            key={m.address}
                            secondaryAction={
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                if (removeMembers.find((f) => f == m.addr)) {
                                    let newArr = removeMembers.filter(
                                        (ms) => ms !== m.addr,
                                    );
                                    setRemoveMembers(newArr);
                                } else {
                                    setRemoveMembers([...removeMembers, m.addr]);
                                }}
                                }
                            >
                                Remove
                            </Button>
                            }
                        >
                            <ListItemText primary={m.name} /* secondary={m.pubkey} */ />
                        </ListItem>
                    )})}
                </List>
            }
            <hr />
            {addMembers.length > 0 &&
                <>
                    <p>Add:</p>
                    {addMembers.map((m) => {return(
                        <p key={m.address}>{m.name} - {m.address}</p>
                    )})}
                </>
            }

            {removeMembers.length > 0 &&
                <>
                    <p>Remove:</p>
                    {removeMembers.map((m) => {return(
                        <p key={m}>{m}</p>
                    )})}
                </>
            }
            {(addMembers.length > 0 || removeMembers.length > 0) &&
                <>
                {loading ? 
                    <b>Loading tx</b>
                    :
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit()}
                    >
                        Modify
                    </Button>
                }
                </>
            }

        </div>
  );
}

export default MembersManager;
