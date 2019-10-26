import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    preferenceCard: {
        display: "inline-block",
        position: "relative",
        margin: "10px",
        color: "white",
        backgroundColor: theme.palette.secondary.main
    },
    actionArea: {
        display: "block",
        position: "relative",
        width: "220px",
        height: "115px"
    },
    checkIcon: {
        position: "absolute",
        top: 5,
        right: 5
    },
    cardTitle: {
        fontFamily: "Raleway",
        fontSize: "24px",
        fontWeight: "bold",
        position: "absolute",
        left: 15,
        bottom: 10
    }
}));
