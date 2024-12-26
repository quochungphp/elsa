import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { ErrorResponse } from "../../domain";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../resources/server-api";
import { signInByPasswordSelector } from "../../reduxStore/signin-request-by-password/sliceReducer";
import { v4 as uuidv4 } from "uuid";
import { getWsUrl } from "../../utils/envs";
export const SignIn = () => {
  const initialState = useSelector(signInByPasswordSelector);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [requestConnect, setRequestConnect] = React.useState(false);
  const [errors, setErrors] = React.useState<ErrorResponse[]>();
  const [status, setStatus] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && name) {
      setRequestConnect(!requestConnect);
    }
  };
  React.useEffect(() => {
    if (initialState.data.status) {
      setErrors(initialState.data.errors);
      setStatus(initialState.data.status);
    }
  }, [initialState]);

  const accessToken = serverApi.getAccessToken();
  React.useEffect(() => {
    if (status === "success" || accessToken) {
      window.location.href = "/comments";
    }
  }, [status, accessToken]);

  //

  const ws = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    if (requestConnect) {
      const url = `${getWsUrl()}?refId=${uuidv4()}&email=${email}&name=${name}`;
      ws.current = new WebSocket(url);
      ws.current.onopen = () => console.log("ws opened");
      ws.current.onclose = () => console.log("ws closed");
      ws.current.onerror = (e) => console.log(e);
      const wsCurrent = ws.current;

      return () => {
        wsCurrent?.close();
      };
    }
  }, [email, name, requestConnect]);

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
