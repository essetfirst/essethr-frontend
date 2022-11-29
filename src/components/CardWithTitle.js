import React from "react";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
} from "@material-ui/core";

const CardWithTitle = React.forwardRef(
  (props, ref) =>
    ({ title, footer, children }) => {
      return (
        <Card ref={ref}>
          <CardHeader title={{ title }} subheader={title} />
          <Divider />
          <CardContent>{children}</CardContent>
          <Divider />
          {footer && <CardActions>{footer}</CardActions>}
        </Card>
      );
    }
);

export default CardWithTitle;
