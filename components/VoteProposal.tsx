type Vote = {
  id: number;
  voter: string;
  vote: 'Yes' | 'No' | 'Abstain' | 'Veto';
  weight: number;
};

type VoteProposal = {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Passed' | 'Rejected';
  votes: Vote[];
};
import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled';
import {
  Typography,
  LinearProgress,
  Badge,
  Box,
  Paper,
  Button,
} from '@mui/material';
import { getDatetime } from 'util/helpers';
//@ts-ignore
import { Proposal } from 'util/types'
import { useSigningClient } from 'contexts/client';
import { Cw3FlexMultisigNamedClient } from 'hooks/guildapp-ts/Cw3FlexMultisigNamed.client';

const VotingButton = styled(Button)`
  min-width: 10px;
  padding: 2px 1rem;
  font-size: 0.8rem;
`;

interface IProps {
  prop: Proposal;
  creatorName: string;
}
//@ts-ignore
export const VoteProposal: React.FC = (props: IProps) => {
  const { signingClient, walletAddress } = useSigningClient()
  const [votes, setVotes] = useState<Vote[]>([])
  const fetched = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false) 
  const [voted, setVoted] = useState<boolean>(false)
  const [isExpired, setIsExpired] = useState<boolean>(false)

  //const yes_pct = () => {} get the sum of weight for Yes / total weight

  async function getVotes() {
    try {
      let votesMsg = {
        list_votes: {
            proposal_id: props.prop.id,
            start_after: null,
            limit: null
        }
      }
      let votesList = await signingClient?.queryContractSmart(
          props.prop.vault,
          votesMsg
      )
      //console.log(votesList)
      if (votesList?.votes) {
        setVotes(votesList.votes)
        let userVoted = votesList.votes.some((v: any) => v.voter === walletAddress)
        setVoted(userVoted)
      } else {
          console.error("No votes could be found")
      }
      } catch(err: any) {
          console.error(err.toString())
      }
  }

  useEffect(() => {
    if (!fetched.current) {
      let now = new Date()
      let now_t = now.getTime() * 1_000_000
      //console.log(`gonna compare ${props.prop.expires.at_time} and ${now_t}`)
      if (now_t > props.prop.expires.at_time) {
        setIsExpired(true)
      } else { setIsExpired(false) } 

      getVotes()
      fetched.current = true
    }
  },[fetched, props])

  async function handleVote(vote: 'yes' | 'no' ) {
    setLoading(true)
    if (!signingClient) return
    let client = new Cw3FlexMultisigNamedClient(signingClient, walletAddress, props.prop.vault)
    let res = await client.vote({ proposalId: props.prop.id, vote: vote }, 'auto')
    if (res) {
      setVoted(true)
    }
    setLoading(false)
  }


  return (
    <Paper
      sx={{
        textAlign: 'left',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '2rem',
        marginBottom: '2rem',
      }}
    >
      <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'grey.800' }}>
        <Typography variant="h4" gutterBottom>
          {props.prop.title}
        </Typography>
        <Box sx={{ marginLeft: '5rem' }}>
          <Badge badgeContent="Active" color="primary" />
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '80%', borderRight: 1, borderColor: 'grey.800' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'grey.800' }} mt={2}>
            <Typography variant="h5" gutterBottom>
              Description:
            </Typography>
            <Typography paragraph gutterBottom>
              {props.prop.description}
            </Typography>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'grey.800' }}>
            {props.prop.msgs.length > 0 ?
            <>
            <Typography variant="h5" gutterBottom mt={2}>
              Transaction to be Executed:
            </Typography>
            <Typography paragraph gutterBottom>
              TODO: decode tx
            </Typography>
            </>
            :
            <Typography variant="h5" gutterBottom mt={2}>
              No transaction to be executed from this proposal.
            </Typography>
            }
          </Box>
          <Box display="flex" mt={2}>
            <Box flexGrow={1} flexBasis={0} display="flex">
              <Box>
                <Typography>Expiration Date: </Typography>
                <Typography>{getDatetime(props.prop.expires.at_time)}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                borderRight: 1,
                borderColor: 'grey.800',
                flex: '1',
              }}
            >
              <Typography>Creation Date: </Typography>
              <Typography>28-Ago-2023</Typography>
            </Box>
            <Box
              flexGrow={1}
              flexBasis={0}
              display="flex"
              flexDirection="column"
            >
              <Typography>Submitted By:</Typography>
              <Typography>{props.creatorName}</Typography>
            </Box>
          </Box>

          <Typography variant="body2"></Typography>
        </Box>
        <Box mt={2} ml={2}>
          <Typography variant="h6" align="left">
            Poll Results:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1rem',
            }}
          >
            <Typography variant="caption">Yes:</Typography>
            <Typography variant="caption">80%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={80} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1rem',
            }}
          >
            <Typography variant="caption">No:</Typography>
            <Typography variant="caption">20%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={20} />
          <Box mt={2} mb={2} display="flex" flexDirection="column">
            <Typography variant="h6">54 votes cast</Typography>
            <Typography variant="caption">
              *To be valid need 100 casted votes in total.
            </Typography>
          </Box>
          {isExpired ? 
            <Typography variant="h6">Expired</Typography>
          :
            <>
              {!voted &&
                <Box
                sx={{
                  display: 'flex',
                  marginTop: '1rem',
                  justifyContent: 'center',
                  gap: '2rem',
                }}
                >
                  <VotingButton 
                    onClick={() => handleVote("yes")}
                    variant="outlined" size="small">
                    Yes
                  </VotingButton>
                  <VotingButton 
                    onClick={() => handleVote("no")}
                    variant="outlined">No</VotingButton>
                </Box>
              }
            </>
          }
        </Box>
      </Box>
    </Paper>
  );
};

export default VoteProposal;
