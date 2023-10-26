import { Container, Typography } from '@mui/material';
import { CallToActionButtons } from './Buttons/CallToActionButtons';
import { SIZES } from 'pages/theme';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h1">Enter the gaming</Typography>
      <Typography variant="h1">guild ecosystem</Typography>
      <Typography
        variant="h4"
        gutterBottom
        component="h2"
        style={{ marginTop: `${SIZES['lineHeight'] * 2}rem` }}
      >
        JOIN A GUILD OR MANAGE YOUR OWN
      </Typography>

      <CallToActionButtons />
    </Container>
  );
};

export default Home;
