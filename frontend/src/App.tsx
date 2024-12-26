import React from "react";
import "./App.css";
import HomeView from "./containers/HomeView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SignInView from "./containers/SignInView";
import SignUpView from "./containers/SignUpView";
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="" element={<HomeView />} />
          <Route path="/comments" element={<HomeView />} />
          <Route path="/sign-up" element={<SignUpView />} />
          <Route path="/sign-in" element={<SignInView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
