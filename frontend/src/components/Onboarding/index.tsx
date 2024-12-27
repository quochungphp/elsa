import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { useSocket } from "../../context/socket-io.context";

export const Onboarding = () => {
  const socket = useSocket();
  React.useEffect(() => {
    socket.emit("LIST_QUIZ", {}, (ackResponse: string) => {
      // Handle acknowledgment from the server
      console.log("Acknowledgment received:", ackResponse);
    });
    return () => {
      socket.off("LIST_QUIZ");
    };
  }, [socket]);

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box
            sx={{
              marginTop: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              sx={{}}
              alt="TestAssignment"
              src="mainLogoLogin.jpeg"
            />
            <Typography component="h1" variant="h5" mb={1}>
              <br />
              Le Quoc Hung
            </Typography>
            <Typography
              component="h4"
              variant="h5"
              sx={{ color: "#ff6a3d" }}
              mb={1}
            >
              Objectives
            </Typography>
            <ul className="listDescription">
              <li>
                My carer path, I wish to come Expert / Principle Software Dev
              </li>
              <li>
                Senior fullstack developer: I can work both of Backend and
                Frontend from Zero to Hero
              </li>
              <li>
                Technical stacks: Node TypeScript, Go, Python, CI/CD gitlab
                github and circle ci, Frontend skill also
              </li>
              <li>Test skills: unit test, e2e test , performance test</li>
              <li>Funny, hard work, dedication</li>
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
