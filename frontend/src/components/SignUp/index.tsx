import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './style.css';
import { UserSignUpPayloadDto, ErrorResponse } from '../../domain';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';
import { validateEmail } from '../../utils/isEmail';
import { postSignUp } from '../../reduxStore/signup-request/action';
import { userSignUpSelector } from '../../reduxStore/signup-request/sliceReducer';

export const SignUp = () => {
    const dispatch = useDispatch();
    const initialState = useSelector(userSignUpSelector);
    const [errorEmail, setErrorEmail] = React.useState('');

    const [userState, setUserState] = useState({ username: '', password: '', passwordConfirm: '', email: '', fullName: '', phone: '' });
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUserState((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'email' && !validateEmail(value)) {
            setErrorEmail('Email is invalid');
        } else {
            setErrorEmail('');
        }
    };
    const handleChangePhone = (value: string) => {
        setUserState((prevState) => ({
            ...prevState,
            phone: value.toString(),
        }));
    };

    const [errors, setErrors] = React.useState<ErrorResponse[]>();
    const [status, setStatus] = React.useState('');
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(postSignUp(userState as unknown as UserSignUpPayloadDto));
    };
    React.useEffect(() => {
        if (initialState.data.status) {
            setErrors(initialState.data.errors);
            setStatus(initialState.data.status);
        }
    }, [initialState]);
    React.useEffect(() => {
        if (initialState.data.status === 'success') {
            window.location.href = '/sign-in';
        }
    }, [initialState]);

    return (
        <Container
            component="main"
            maxWidth="lg"
            sx={{
                border: '2px solid #ff6a3d',
                padding: '50px',
                borderRadius: '20px',
                marginTop: '10px',
            }}
        >
            <CssBaseline />
            <Grid container>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            marginTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box component="img" sx={{}} alt="TestAssignment" src="mainLogoLogin.jpeg" />
                        <Typography component="h1" variant="h5" mb={1}>
                            <br />
                            Le Quoc Hung
                        </Typography>
                        <Typography component="h4" variant="h5" sx={{ color: '#ff6a3d' }} mb={1}>
                            Objectives
                        </Typography>
                        <ul className="listDescription">
                            <li>My carer path, I wish to come Expert / Principle Software Dev</li>
                            <li>Senior fullstack developer: I can work both of Backend and Frontend from Zero to Hero</li>
                            <li>Technical stacks: Node TypeScript, Go, Python, CI/CD gitlab github and circle ci, Frontend skill also</li>
                            <li>Test skills: unit test, e2e test , performance test</li>
                            <li>Funny, hard work, dedication</li>
                        </ul>
                    </Box>
                </Grid>
                <Grid item xs={1} sx={{ borderLeft: '1px solid #ddd' }}></Grid>
                <Grid item xs={5}>
                    <Box
                        sx={{
                            marginTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                {status === 'error' && (
                                    <Alert sx={{ marginTop: 1 }} severity="error" className="alertError">
                                        Please enter valid values!
                                    </Alert>
                                )}

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="fullName"
                                    label="Full Name"
                                    name="fullName"
                                    autoComplete="fullName"
                                    autoFocus
                                    onChange={(e) => handleChange(e)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => handleChange(e)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={errorEmail.length > 0 ? true : false}
                                    helperText={errorEmail}
                                    onChange={(e) => handleChange(e)}
                                />
                                <PhoneInput
                                    country={'us'}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true,
                                    }}
                                    onChange={(phone) => handleChangePhone(phone.toString())}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) => handleChange(e)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="passwordConfirm"
                                    label="Password Confirm"
                                    type="password"
                                    id="passwordConfirm"
                                    error={userState.password !== userState.passwordConfirm}
                                    helperText={userState.password !== userState.passwordConfirm ? 'Password is not match' : ''}
                                    autoComplete="current-password-confirm"
                                    onChange={(e) => handleChange(e)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        mt: 1,
                                        mb: 1,
                                        background: '#afa8a8',
                                        height: '50px',
                                        verticalAlign: 'center',
                                    }}
                                    size="large"
                                >
                                    Sign Up
                                </Button>
                                <Grid item xs={12}>
                                    <Typography textAlign={'center'}>Happy to work!</Typography>
                                    <br />
                                    <Typography textAlign={'center'}>Already have an account? Log In.</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};
