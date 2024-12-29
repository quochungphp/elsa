import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { useSocket } from "../../context/socket-io.context";
import {
  QuizzesDto,
  QuestionListDto,
  QuizDto,
  LeaderboadUpdateDto,
} from "../../domain";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { socketEmitSigInJoinSelector } from "../../reduxStore/signin-join/sliceReducer";

export const Onboarding = () => {
  const socket = useSocket();
  const [quizzes, setQuizzes] = React.useState<QuizzesDto>();
  const [submitResult, setSubmitResult] = React.useState();
  const [quiz, setQuiz] = React.useState<QuizDto>();
  const [questions, setQuestions] = React.useState<QuestionListDto>();
  const [selectedQuiz, setSelectedQuiz] = React.useState("");
  const [answers, setAnswers] = React.useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [joined, setJoined] = React.useState<boolean>(false);

  const joinedUser = useSelector(socketEmitSigInJoinSelector);
  const handleChangeQuiz = (event: { target: { value: any } }) => {
    setSelectedQuiz(event.target.value);
  };
  const [leaderboard, setLeaderboard] = React.useState<LeaderboadUpdateDto>();

  React.useEffect(() => {
    // Listen for leaderboard updates
    socket.on("LEADERBOARD_SCORE_UPDATE", (res) => {
      console.log(res);
      setLeaderboard(res);
    });

    // Cleanup on unmount
    return () => {
      socket.off("LEADERBOARD_SCORE_UPDATE");
    };
  }, [socket]);
  React.useEffect(() => {
    socket.emit("QUIZ_LIST", {}, (ackResponse: QuizzesDto) => {
      setQuizzes(ackResponse);
    });
    return () => {
      socket.off("QUIZ_LIST");
    };
  }, [socket]);
  // Join to quiz
  React.useEffect(() => {
    if (selectedQuiz && joined && joinedUser && joinedUser?.data?.data?._id) {
      const input = { quizId: selectedQuiz, userId: joinedUser.data.data._id };
      socket.emit("JOIN_QUIZ", input, (ackResponse: QuizDto) => {
        setQuiz(ackResponse);
      });
      return () => {
        socket.off("JOIN_QUIZ");
      };
    }
  }, [joined, joinedUser, selectedQuiz, socket]);

  // Handle answer selection
  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleJoin = () => {
    setJoined(true);
  };
  // Submit result
  React.useEffect(() => {
    if (submitted && joined && joinedUser?.data?.data?._id && answers) {
      const input = {
        quizId: selectedQuiz,
        userId: joinedUser?.data?.data?._id,
        answers: answers,
      };
      socket.emit("QUIZ_SUBMIT", input, (ackResponse: any) => {
        setSubmitResult(ackResponse);
      });
      return () => {
        socket.off("QUIZ_SUBMIT");
      };
    }
  }, [submitted, socket, joinedUser, selectedQuiz, answers, joined]);

  // Submit to join quiz and render list questions
  React.useEffect(() => {
    if (quiz && joined && joinedUser?.data?.data?._id) {
      const input = {
        quizId: selectedQuiz,
        userId: joinedUser?.data?.data?._id,
      };
      socket.emit("QUESTION_LIST", input, (ackResponse: QuestionListDto) => {
        setQuestions(ackResponse);
      });
      return () => {
        socket.off("QUESTION_LIST");
      };
    }
  }, [joined, socket, joinedUser, selectedQuiz, quiz]);

  const calculateScore = () => {
    if (questions && questions.data.length) {
      return questions.data.reduce(
        (score, question) =>
          answers[question._id] === question.correctAnswer ? score + 1 : score,
        0
      );
    }
    return "";
  };
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
        <Grid item xs={12}>
          <Box sx={{ border: "1px solid #ccc" }} padding={2} borderRadius={2}>
            <Typography component="h1" variant="h5" mb={1}>
              <br />
              Leaderboard Score
            </Typography>
          </Box>
          <Box sx={{ border: "1px solid #ccc" }} padding={2} borderRadius={2}>
            {leaderboard && (
              <TableContainer
                component={Paper}
                style={{ marginTop: 20, maxWidth: 600, margin: "0 auto" }}
              >
                <Typography variant="h5" align="center" style={{ padding: 16 }}>
                  Quiz Leaderboard
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Rank</strong>
                      </TableCell>
                      <TableCell>
                        <strong>User</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Score</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.data.quizzes
                      .sort((a, b) => b.score - a.score) // Sort by score descending
                      .map((record, index) => (
                        <TableRow key={record._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{record.user}</TableCell>
                          <TableCell>{record.score}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Grid>
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
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoin}
                disabled={joined}
                fullWidth
              >
                Join to test
              </Button>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ border: "1px solid #ccc" }} padding={2} borderRadius={2}>
            <form onSubmit={(e) => e.preventDefault()}>
              {submitted && (
                <Box sx={{ marginTop: 3 }}>
                  <Typography variant="h6">
                    Your Score: {calculateScore()} / {questions?.data.length}
                  </Typography>
                  <CssBaseline />
                </Box>
              )}
              {questions && questions.data.length
                ? questions.data.map((question) => (
                    <Box key={question._id} sx={{ marginBottom: 3 }}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">
                          {question.questionText}
                        </FormLabel>
                        <RadioGroup
                          aria-label={question._id}
                          name={question._id}
                          value={answers[question._id]?.toString() ?? ""}
                          onChange={(e) =>
                            handleAnswerChange(
                              question._id,
                              parseInt(e.target.value)
                            )
                          }
                        >
                          {question.options.map((option: any, index: any) => (
                            <FormControlLabel
                              key={index}
                              value={index.toString()}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  ))
                : ""}

              {joined && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={submitted}
                  fullWidth
                >
                  Submit
                </Button>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
