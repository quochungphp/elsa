import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./style.css";
import { useSocket } from "../../context/socket-io.context";
import { QuizzesDto, QuestionListDto } from "../../domain";
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
} from "@mui/material";

export const Onboarding = () => {
  const socket = useSocket();
  const [quizzes, setQuizzes] = React.useState<QuizzesDto>();
  const [questions, setQuestions] = React.useState<QuestionListDto>();
  const [selectedQuiz, setSelectedQuiz] = React.useState("");

  const handleChangeQuiz = (event: { target: { value: any } }) => {
    setSelectedQuiz(event.target.value);
  };
  React.useEffect(() => {
    socket.emit("QUIZ_LIST", {}, (ackResponse: QuizzesDto) => {
      setQuizzes(ackResponse);
    });
    return () => {
      socket.off("QUIZ_LIST");
    };
  }, [socket]);

  React.useEffect(() => {
    if (selectedQuiz) {
      const input = { quizId: selectedQuiz };
      socket.emit("QUESTION_LIST", input, (ackResponse: QuestionListDto) => {
        console.log(ackResponse);
        setQuestions(ackResponse);
      });
      return () => {
        socket.off("QUESTION_LIST");
      };
    }
  }, [selectedQuiz, socket]);
  // State to track the selected answers
  const [answers, setAnswers] = React.useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  // Handle answer selection
  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Calculate score after submission
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

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitted}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
