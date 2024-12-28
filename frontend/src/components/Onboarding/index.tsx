import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { useSocket } from "../../context/socket-io.context";
import { QuizzesDto } from "../../domain";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const Onboarding = () => {
  const socket = useSocket();
  const [quizzes, setQuizzes] = React.useState<QuizzesDto>();
  const [selectedQuiz, setSelectedQuiz] = React.useState("");

  const handleChangeQuiz = (event: { target: { value: any } }) => {
    setSelectedQuiz(event.target.value);
  };
  React.useEffect(() => {
    socket.emit("LIST_QUIZ", {}, (ackResponse: QuizzesDto) => {
      console.log(ackResponse);
      setQuizzes(ackResponse);
    });
    return () => {
      socket.off("LIST_QUIZ");
    };
  }, [socket]);

  React.useEffect(() => {
    console.log(selectedQuiz);
  }, [selectedQuiz]);
  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        marginTop: 2,
      }}
    >
      <CssBaseline />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Box sx={{ border: "1px solid #ccc" }} padding={2} borderRadius={2}>
            <Typography component="h1" variant="h5" mb={1}>
              <br />
              Le Quoc Hung
            </Typography>

            <Typography
              component="h4"
              variant="h5"
              sx={{ color: "#ff6a3d" }}
              mb={2}
            >
              Choose your test:
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="quiz-list">Quizzes</InputLabel>
              <Select
                labelId="quiz-select"
                id="quiz-select-id"
                value={selectedQuiz}
                label="Quizzes"
                onChange={handleChangeQuiz}
              >
                {quizzes && quizzes.data
                  ? quizzes.data.map((quiz) => (
                      <MenuItem key={quiz._id} value={quiz._id}>
                        {quiz.title}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Box
            sx={{ border: "1px solid #ccc" }}
            padding={2}
            borderRadius={2}
          ></Box>
        </Grid>
      </Grid>
    </Container>
  );
};
