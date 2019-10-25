import * as React from "react";
import { Card, CardContent, Typography, CardActionArea } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

class PurePreferenceCard extends React.Component {
    handleClick = (e) => {
        this.props.update(this.props.name);
    }

    render() {
        const { classes, name, checked } = this.props;
        return (
            <Card className={classes.preferenceCard}>
                <CardActionArea onClick={this.handleClick}>
                    <div className={classes.actionArea}>
                        {checked && <CheckCircleOutlineIcon className={classes.checkIcon} />}
                        <CardContent>
                            <Typography variant="h5" className={classes.cardTitle}>
                                {name}
                            </Typography>
                        </CardContent>
                    </div>
                </CardActionArea>
            </Card>
        );
    }
}

export const PreferenceCard = withStyles(styles)(PurePreferenceCard);
