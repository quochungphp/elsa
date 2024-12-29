import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { useSocket } from "../../context/socket-io.context";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socketEmitSigInJoin } from "../../reduxStore/signin-join/action";
import { socketEmitSigInJoinSelector } from "../../reduxStore/signin-join/sliceReducer";
export const SignIn = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [requestConnect, setRequestConnect] = React.useState(false);
  const initialState = useSelector(socketEmitSigInJoinSelector);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && name) {
      setRequestConnect(!requestConnect);
    }
  };
  React.useEffect(() => {
    if (initialState.isJoined) {
      navigate("/onboarding");
    }
  }, [initialState, navigate]);
  React.useEffect(() => {
    if (requestConnect) {
      const input = {
        email,
        name,
      };
      dispatch(socketEmitSigInJoin(input));
      return () => {
        socket.off("USER_JOIN");
      };
    }
  }, [dispatch, email, name, requestConnect, socket]);
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "680px",
        border: "2px solid #4f41a9",
        padding: "50px",
        borderRadius: "20px",
        marginTop: "10px",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{}}
          alt="Assignment"
          src="mainLogoLogin.jpeg"
        />
        <br />
        <Typography component="h1" variant="h5" mb={1}>
          Happy Join
        </Typography>
        <Typography
          component="h4"
          variant="h5"
          sx={{ color: "#ff6a3d" }}
          mb={1}
        >
          Happy Quiz
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="text"
              id="name"
              autoComplete="current-name"
              onChange={(e) => setName(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                background: "#afa8a8",
                height: "50px",
                verticalAlign: "center",
              }}
              size="large"
            >
              Join
            </Button>
            <Grid item xs={12} mb={2}>
              <Typography
                className="textSubColor"
                textAlign={"center"}
              ></Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
