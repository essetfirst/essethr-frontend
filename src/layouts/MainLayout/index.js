import { styled } from "@mui/material/styles";
import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

const StyledRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
}));

const StyledWrapper = styled("div")(({ theme }) => ({
  display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
}));

const StyledContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
}));

const StyledContent = styled("div")(({ theme }) => ({
  flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
}));

const MainLayout = () => {

  return (
    <StyledRoot>
      <TopBar />
      <StyledWrapper>
        <StyledContentContainer>
          <StyledContent>
            <Outlet />
          </StyledContent>
        </StyledContentContainer>
      </StyledWrapper>
    </StyledRoot>
  );
};

export default MainLayout;
