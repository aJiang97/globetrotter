import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    rowContainer: {
        // backgroundColor: "red"
    },
    avatarList: {
        "list-style-type": "none",
        marginLeft: "-40px"
    },
    listElem: {
        display: "inline-block",
        marginRight: "15px"
    },
    addButton: {
        marginBottom: "3px",
        marginLeft: "20px",
        backgroundColor: theme.palette.secondary.main,
        color: "#fff"
    }
}));
