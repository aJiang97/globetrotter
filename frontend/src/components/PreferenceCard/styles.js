import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    preferenceCard: {
        backgroundColor: "red",
        display: "inline-block",
        position: "relative"
    },
    actionArea: {
        display: "block",
        position: "relative",
        width: "220px",
        height: "100px"
    },
    checkIcon: {
        position: "absolute",
        top: 5,
        right: 5,
        "&$selected": {
            color: "red"
        }
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
