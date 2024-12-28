import React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./style.css";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { postLogoutPassword } from "../../reduxStore/logout/action";
import { ACCESS_TOKEN } from "../../utils/constants";
const pages = [
  {
    link: "onboarding",
    label: "Onboarding",
  },
  {
    link: "sign-in",
    label: "Join Quiz",
    class: "",
  },
];
const useStyles = makeStyles(() => ({
  toolBar: {
    margin: "auto",
    maxWidth: 800,
    width: "100%",
    background: " #fff",
  },
}));
const Header = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const appState = useSelector((state) => state);
  const { signInByPasswordReducer } = appState as any;
  let username = "";
  if (
    signInByPasswordReducer &&
    signInByPasswordReducer.data &&
    signInByPasswordReducer.data.username
  ) {
    username = signInByPasswordReducer.data.username;
  }
  React.useEffect(() => {
    return () => {
      localStorage.clear();
    };
  }, []);

  const handleSubmit = () => {
    dispatch(postLogoutPassword());
    window.location.href = "/sign-in";
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" className="appHeader">
        <Toolbar className={classes.toolBar}>
          <Box
            component="img"
            sx={{
              marginRight: "100px",
            }}
            alt="TestAssignment"
            src="LOGO-ELSA.svg"
          />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page: any, index: number) => (
              <Button
                key={index}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={page.link}
                  style={{
                    color: "#fff",
                    textTransform: "capitalize",
                    textDecoration: "none",
                  }}
                  className={page.class}
                >
                  {page.label}
                </Link>
              </Button>
            ))}
            {localStorage.getItem(ACCESS_TOKEN) ? (
              <>
                <Button
                  key={"logout"}
                  sx={{ my: 2, color: "white", display: "block" }}
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleSubmit()}
                >
                  <Link to="">Logout</Link>
                </Button>
                <Button
                  key={username}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  <Link to="">Welcome: {username}</Link>
                </Button>
              </>
            ) : (
              ""
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
