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

import styled from '@emotion/styled';
import {
  Typography,
  LinearProgress,
  Badge,
  Box,
  Paper,
  Button,
} from '@mui/material';

const VotingButton = styled(Button)`
  min-width: 10px;
  padding: 2px 1rem;
  font-size: 0.8rem;
`;

export const VoteProposal: React.FC = () => {
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
          The lunar festival
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
              Do you want to join a fun and festive game guild event in World of
              Warcraft? The Lunar Festival is a seasonal event that celebrates
              the moon, the stars, and the night sky. It offers many activities
              and rewards, such as visiting elders, launching fireworks,
              fighting Omen, and collecting coins of...
            </Typography>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'grey.800' }}>
            <Typography variant="h5" gutterBottom mt={2}>
              Transaction to be Executed:
            </Typography>
            <Typography paragraph gutterBottom>
              Send to santi.piratesbcn USDT 100
            </Typography>
          </Box>
          <Box display="flex" mt={2}>
            <Box flexGrow={1} flexBasis={0} display="flex">
              <Box>
                <Typography>Expiration Date: </Typography>
                <Typography>28-Ago-2023</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                borderRight: 1,
                borderColor: 'grey.800',
                flex: '1',
              }}
            >
              <Typography>Expiration Date: </Typography>
              <Typography>28-Ago-2023</Typography>
            </Box>
            <Box
              flexGrow={1}
              flexBasis={0}
              display="flex"
              flexDirection="column"
            >
              <Typography style={{ flex: '1' }}>Submitted By:</Typography>
              <Typography style={{ flex: '1' }}>Igor.piratesbcn</Typography>
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
          <Box
            sx={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'center',
              gap: '2rem',
            }}
          >
            <VotingButton variant="outlined" size="small">
              Yes
            </VotingButton>
            <VotingButton variant="outlined">No</VotingButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default VoteProposal;
