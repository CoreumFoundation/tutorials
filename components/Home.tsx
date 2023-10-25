import { Container, Typography } from '@mui/material';
import { CallToActionButtons } from './Buttons/CallToActionButtons';
import { SIZES } from 'pages/theme';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h1">Gaming Guilds Go </Typography>
      <Typography variant="h1">Digital: Dive into Web3!</Typography>
      <Typography
        variant="h4"
        gutterBottom
        component="h2"
        style={{ marginTop: `${SIZES['lineHeight'] * 2}rem` }}
      >
        JOIN AND CREATE YOUR GUILD
      </Typography>

      <CallToActionButtons />
    </Container>
  );
};

export default Home;
