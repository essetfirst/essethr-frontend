import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Container, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography, Link, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Star as StarIcon } from "@mui/icons-material";

import Page from "components/Page";
import { ChevronRight as ArrowRightIcon } from "react-feather";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        etHR
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const StyledHeroButtons = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledCardGrid = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const StyledCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "56.25%",
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[200]
      : theme.palette.grey[700],
}));

const StyledCardPricing = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "baseline",
  marginBottom: theme.spacing(2),
}));

const StyledFooter = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const cards = [
  {
    title: "Employee Data Management",
    media: "https://source.unsplash.com/random",
    description: `Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum `,
  },
  {
    title: "Time and Attendance",
    media: "https://source.unsplash.com/random",
    description: `Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum `,
  },
  {
    title: "Leave and Time-Off Management",
    media: "https://source.unsplash.com/random",
    description: `Manage different leave types of leaves for employees such as sick leave, annual, paid, maternity leave, etc. Our HRM and Payroll software keeps track of the number of days and available leave days (balance).`,
  },
  {
    title: "Payroll",
    media: "https://source.unsplash.com/random",
    description: `Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum `,
  },
  {
    title: "Reports",
    media: "https://source.unsplash.com/random",
    description: `Generate different types of reports ranging from employee, employee turnover, leave, attendance, previous payrolls, payroll slip, and more.`,
  },
  {
    title: "ECRA document template",
    media: "",
    description:
      "Extension module to print payroll, income tax and pension on documents which are compatible with the manual templates of Ethiopian Revenues and Customs authority (ERCA).",
  },
  {
    title: "Biometric attendance system integration",
    media: "",
    description:
      "Extension to integrate with various types of biometric attendance systems. Our system can import monthly attendance and overtime from various types of data exported from attendance system.",
  },
];

const tiers = [
  {
    title: "Standard",
    price: "40",
    description: [
      "Up to 6,000 users included",
      "2 GB of storage",
      "Help center access",
      "Email support",
    ],
    buttonText: "Sign up",
    buttonVariant: "outlined",
  },
  {
    title: "Edge",
    subheader: "Most popular",
    price: "80",
    description: [
      "> 8,000 users",
      "On-Demand features extension",
      "Unlimited data storage",
      "Priority email support",
      "Trainings and Seminars",
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  // {
  //   title: "Enterprise",
  //   price: "30",
  //   description: [
  //     "50 users included",
  //     "30 GB of storage",
  //     "Help center access",
  //     "Phone & email support",
  //   ],
  //   buttonText: "Contact us",
  //   buttonVariant: "outlined",
  // },
];
const footers = [
  {
    title: "Company",
    description: ["Team", "History", "Contact us", "Locations"],
  },
  {
    title: "Features",
    description: [
      "Employee Data Management",
      "Time and Attendance",
      "Leaves",
      "Payroll",
      "Analytics and Reports",
    ],
  },
  {
    title: "Resources",
    description: ["Trainings", "Blogs", "FAQs"],
  },
  {
    title: "Legal",
    description: ["Privacy policy", "Terms of use"],
  },
];

const HomeView = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Page title="Home">
      {/* Hero unit */}
      <div
        style={{
          padding: theme.spacing(10),
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h1"
            align="center"
            gutterBottom
            style={{ fontSize: "48px" }}
          >
            etHR
          </Typography>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            A system to help you get the best out of your astitute resources --
            your employees'!
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Hop on! Increase your organization's overall business success by
            optimizing your HR workflows and enhancing employees' performances.
          </Typography>

          <StyledHeroButtons>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button variant="contained" color="secondary">
                  Request a demo
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}
                >
                  Sign up
                </Button>
              </Grid>
            </Grid>
          </StyledHeroButtons>
        </Container>
      </div>
      <StyledCardGrid maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card.title} xs={12} sm={6} md={4}>
              <StyledCard>
                <StyledCardMedia image={card.media} title="Image title" />
                <StyledCardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {card.title}
                  </Typography>
                  <Typography>
                    {card.description ||
                      ` This is a module description. You can use this section to
                    describe the features and functionalities of the module.`}
                  </Typography>
                </StyledCardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ArrowRightIcon size="16" />}
                  >
                    Discover more
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledCardGrid>
      <Container>
        <Typography variant="h1">Why etHR?</Typography>
      </Container>
      {/* Hero unit */}
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Pricing
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Quickly build an effective pricing table for your potential customers
          with this layout. It&apos;s built with default Material-UI components
          with little customization.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card>
                <StyledCardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
                />
                <CardContent>
                  <StyledCardPricing>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ETB {tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /mo
                    </Typography>
                  </StyledCardPricing>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color="primary"
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Footer */}
      <StyledFooter maxWidth="md">
        <Grid container spacing={4} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="textSecondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </StyledFooter>
    </Page>
  );
};

export default HomeView;
