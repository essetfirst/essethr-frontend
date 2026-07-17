import React from "react";

import { Container, Card, CardContent, Grid, Typography, Button, CardMedia, CardActions, CardHeader } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Star as StarIcon } from "@mui/icons-material";

import Page from "components/Page";

const StyledHeroContent = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(8, 0, 6),
}));

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

const cards = [];
const tiers = [];

const Home = () => {
  return (
    <Page title="Home">
      <StyledHeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
          >
            PayrollET
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            A slogan about product quality
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Something short and leading about the application below—its
            contents, the creator, etc. Make it short and sweet, but not too
            short so folks don&apos;t simply skip over it entirely.
          </Typography>

          <StyledHeroButtons>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button variant="contained" color="primary">
                  Request demo
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  Register
                </Button>
              </Grid>
            </Grid>
          </StyledHeroButtons>
        </Container>
      </StyledHeroContent>
      <StyledCardGrid maxWidth="md">
        <Grid container spacing={4}>
          {cards.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <StyledCard>
                <StyledCardMedia
                  image="https://source.unsplash.com/random"
                  title="Image title"
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Module
                  </Typography>
                  <Typography>
                    This is a module description. You can use this section to
                    describe the features and functionalities of the module.
                  </Typography>
                </StyledCardContent>

                <CardActions>
                  <Button size="small" color="primary">
                    View
                  </Button>
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledCardGrid>
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
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
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
                      ${tier.price}
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
                </StyledCardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color="primary"
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
};

export default Home;
