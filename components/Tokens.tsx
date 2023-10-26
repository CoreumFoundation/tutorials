import { useState } from 'react';
import type { NextPage } from 'next';

import {
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { useSigningClient } from 'contexts/client';

import {AssetFT as AssetFTTx, FT as FTTx} from "../coreum/tx";



function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect } from 'react';

function TokenForm() {
  const [formData, setFormData] = useState({
    description: '',
    tokenSymbol: '',
    type: 'CERC-20',
    supply: '',
    decimals: 0,
  });
  const { walletAddress, signingClient, coreumQueryClient } = useSigningClient();
  const authContext = useContext(AuthContext);

  const sendTx = async (msgs: readonly EncodeObject[]) => {
    try {
      console.log("SendTx walletAddress " + authContext.loggedAddress[0])
      const resp = await signingClient
        ?.signAndBroadcast(authContext.loggedAddress[0], msgs, 'auto')
      console.log(`Tx hash: ${resp?.transactionHash}`)
      console.log(resp)

      return true
    } catch (error: any) {
      console.error(error)
      console.log(error)
      return false
    }
  }

  async function createFt(){

    sendTx([AssetFTTx.MsgIssue({
      issuer: authContext.loggedAddress[0],
      symbol: formData.tokenSymbol,
      subunit: formData.tokenSymbol,
      precision: formData.decimals,
      initialAmount: formData.supply,
      description: formData.description,
      // To get valid values for the features go inside "Issue" object and then click at "token" within "./asset/ft/v1/token" path.
      features: ["minting"],
    })]).then((passed) => {
      if (passed) {

      }
    })
  }

  async function mintFT(){
    sendTx([AssetFTTx.MsgMint({
      sender: authContext.loggedAddress[0],
      coin: {
          denom: "subunit23-testcore1pcf50v775jlky863sws00qlqyttq6v62r885ph",
          amount: "1",
      }
    })]).then((passed) => {
      if (passed) {

      }
    })
  }

  const queryFTs = () => {
    coreumQueryClient?.FTClient().Tokens({
      issuer: authContext.loggedAddress[0],
    }).then(async (res: QueryTokensResponse) => {
      const fts = await Promise.all(
        res.tokens.map(async (ft) => {
          return {
            denom: ft.denom,
            description: ft.description,
            issuer: ft.issuer,
            precision: ft.precision,
            subunit: ft.subunit,
            symbol: ft.symbol
          }
        })
      )
      console.log(fts)
      return fts;
    })
      .catch((error) => {
        console.log("Query FT's Error" + error)
      })
  }
  queryFTs();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box component="form" sx={{ mt: 3 }}>
      <TextField
        margin="normal"
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <TextField
        margin="normal"
        label="Token Symbol"
        name="tokenSymbol"
        value={formData.tokenSymbol}
        onChange={handleInputChange}
      />
      <FormControl margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          disabled
        >
          <MenuItem value="CERC-20">CERC-20</MenuItem>
        </Select>
      </FormControl>
      <TextField
        margin="normal"
        label="Supply"
        name="supply"
        placeholder="Supply (e.g., 1,000,000)"
        value={formData.supply}
        onChange={handleInputChange}
      />
      <TextField
        margin="normal"
        label="Decimals"
        name="decimals"
        type="number"
        sx={{ width: '8rem' }}
        value={formData.decimals}
        onChange={handleInputChange}
        inputProps={{ min: 0, max: 18 }} // This constrains input to the range 0-18
      />
      <Button onClick={createFt} variant="contained" color="primary" sx={{ mt: 3 }}>
        Add
      </Button>
    </Box>
  );
}

const MyTokensTab = ({
  onButtonCreateTokenClick,
}: {
  onButtonCreateTokenClick: () => void;
}) => {
  let hasTokens = false; // Todo use to display the existing tokens

  const renderNoTokensView = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
        }}
        mt={6}
      >
        <Typography variant="body1">
          You don't have tokens created yet.
        </Typography>
        <Box>
          <Button variant="contained" onClick={onButtonCreateTokenClick}>
            Create token
          </Button>
        </Box>
      </Box>
    );
  };

  const renderTokensView = () => {
    const tokens = ['token 1', 'token 2']; // TODO: get the tokens from the contract

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            gap: '2rem',
          }}
        >
          {tokens.map((token) => (
            <Card key={token}>
              <CardContent>
                <Typography variant="h6">Token</Typography>
                <Typography variant="body1">{token}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box mt={4}>
          <Button variant="contained" onClick={onButtonCreateTokenClick}>
            Create token
          </Button>
        </Box>
      </Box>
    );
  };

  return hasTokens ? renderTokensView() : renderNoTokensView();
};

const Tokens: NextPage = () => {
  const [tabNumber, setTabNumber] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tokens
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabNumber}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Tokens" {...a11yProps(0)} />
            <Tab label="My tokens" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
          <Box>
            <Typography variant="body1">
              Create the tokens you need for your guild
            </Typography>
            <TokenForm />
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          <MyTokensTab onButtonCreateTokenClick={() => setTabNumber(0)} />
        </CustomTabPanel>
      </Box>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default Tokens;
