import type { NextPage } from 'next';
import { useContext, useState } from 'react'
import { Button, Typography, TextField } from '@mui/material';
import { GuildContext } from 'contexts/guildContext';
import { Cw3FlexMultisigNamedClient } from 'hooks/guildapp-ts/Cw3FlexMultisigNamed.client';
import { useSigningClient } from 'contexts/client';
/* 
TO FIX:
- select the vault to send the proposal
- Add tx generator
- handle response 
*/
const Purpose: NextPage = () => {
  const { signingClient, walletAddress } = useSigningClient()
  const ctx = useContext(GuildContext)
  const vaults = ctx?.guildVaults
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    msgs: [],
  });
  const [success, setSuccess] = useState<string>('')
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function createProposal() {
    if (!vaults || !signingClient) return
    let v1 = vaults[0]
    let msg = {
      title: formData.title,
      description: formData.description,
      msgs: [],
      latest: undefined
    }
    let client_o = new Cw3FlexMultisigNamedClient(signingClient, walletAddress, v1)
    let res = await client_o.propose(msg, "auto") 
    if (res) {
      setSuccess("your proposal has been created!")
    }
  }

  return (
    <>
    <Typography variant="h4" gutterBottom>
      Proposal
    </Typography>
      <>
        <TextField
          margin="normal"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <Button
          disabled
        >Add tx</Button>
      </>
      <Button
        onClick={() => createProposal()}
      >Create</Button>
    </>
  );
};

export default Purpose;
