import React from "react";
import {
  Card, CardHeader, Avatar, CardContent, Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

class PureReviewCard extends React.Component {
    getInitials(name) {
        let names = name.split(" ");
        let firstInitial = names[0].charAt(0);
        let lastInitial = names[names.length - 1].charAt(0);
        return firstInitial + lastInitial;
    }
  
    render() {
    const { classes, review } = this.props;
    return (
        <Card className={classes.container}>
            <div className={classes.topSection}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="initials">
                            {this.getInitials(review.name)}
                        </Avatar>
                    }
                    title={review.name}
                    subheader={review.time}
                />
            </div>
            <CardContent>
                <Typography variant="body2" className={classes.reviewContent}>
                    {review.review}
                </Typography>
            </CardContent>
        </Card>
    );
  }
}

export const ReviewCard = withStyles(styles)(PureReviewCard);
