import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    container: {
        width: "70%"
    },
    contentColumn: {
        borderLeft: "3px solid grey",
        height: "120px",
        position: "relative",
        paddingLeft: "30px"
    },
    etaRow: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        borderRadius: "50px",
        backgroundColor: theme.palette.secondary.main
    },
    etaRowContents: {
        padding: "7px 20px",
        position: "relative"
    },
    etaRowLink: {
        textDecoration: "none",
        color: "white"
    },
    etaVertCenter: {
        position: "absolute",
        top: 50,
        transform: "translateY(-50%)"
    },
    etaIcon: {
        position: "relative",
        marginRight: "5px",
        top: 2
    },
    etaText: {
        position: "relative",
        bottom: 5
    }
}));