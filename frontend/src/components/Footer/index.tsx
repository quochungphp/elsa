import React from 'react';
import Container from '@mui/material/Container';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './style.css';
const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];
const Footer = ({ children }: any) => {
    return (
        <Container
            maxWidth={false}
            component="footer"
            sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                mt: 8,
                py: [3, 6],
                width: '100%',
            }}
            className="footerBackground"
        >
            <Grid container spacing={4} justifyContent="space-evenly">
                {footers.map((footer) => (
                    <Grid item xs={6} sm={3} key={footer.title}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            {footer.title}
                        </Typography>
                        <ul>
                            {footer.description.map((item) => (
                                <li key={item}>
                                    <Link to="#">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
export default Footer;
