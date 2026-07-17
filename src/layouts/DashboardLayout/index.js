import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import TopBar from "./TopBar";
import NavBar from "./NavBar";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_MIN_WIDTH = 72;

const StyledRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const StyledWrapper = styled("div")(({ theme, ownerState }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
  transition: "padding-left 0.2s ease",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: ownerState?.minimized ? SIDEBAR_MIN_WIDTH : SIDEBAR_WIDTH,
  },
}));

const StyledContent = styled("div")({
  flex: "1 1 auto",
  width: "100%",
  height: "100%",
  overflow: "auto",
});

const DashboardLayout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [openMinimize, setOpenMinimize] = useState(false);

  return (
    <>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        openMinimize={openMinimize}
        setOpenMinimize={setOpenMinimize}
      />

      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        openMinimize={openMinimize}
        sidebarWidth={SIDEBAR_WIDTH}
        sidebarMinWidth={SIDEBAR_MIN_WIDTH}
      />

      <StyledRoot>
        <StyledWrapper ownerState={{ minimized: openMinimize }}>
          <StyledContent>
            <PerfectScrollbar>
              <Outlet />
            </PerfectScrollbar>
          </StyledContent>
        </StyledWrapper>
      </StyledRoot>
    </>
  );
};

export default DashboardLayout;
