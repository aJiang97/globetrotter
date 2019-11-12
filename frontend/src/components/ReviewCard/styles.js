import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    container: {
        margin: "10px 10px 10px 1px",
        padding: "5px 10px 5px 10px",
        display: "inline-block",
        maxWidth: "380px",
        borderRadius: "8px"
    },
    topSection: {
        display: "flex",
        flexDirection: "row",
        position: "relative"
    },
    vertCenter: {
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)"
    },
    reviewContent: {
        textAlign: "justify",
        marginTop: "-15px"
    }
}));
