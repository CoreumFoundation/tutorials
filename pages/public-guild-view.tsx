import type { NextPage } from 'next';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    Container,
    InputAdornment,
    Typography,
    CardMedia
} from '@mui/material';

import Image from 'next/image';

import { CallToActionButtons } from '../components/Buttons/CallToActionButtons';
import { SIZES } from 'pages/theme';

const PublicGuildView: NextPage = () => {

    function noop() { }

    return (

        <Container maxWidth="lg">
            <Card sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: 2 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 150, objectFit: 'cover', height: 150, marginLeft: 2 }}
                    image="https://i.pinimg.com/564x/06/0d/21/060d2195df7a10d4fd8e37fde4cf5320.jpg"
                    alt="Mother Hacker"
                />
                <CardContent>
                    <Typography variant="body1">
                        Welcome to 'EtherScape', a game built on Unity, enriched with Web3. Dive into a universe where assets are unique NFTs. Trade items, engage in quests, and be part of a community that merges gaming with real-world value. Powered by Unity's graphics and blockchain's decentralization.
                    </Typography>
                </CardContent>
            </Card>
        </Container>

    );

}

export default PublicGuildView;