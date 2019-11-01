import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    transparentTabs: {
        position: "sticky",
        top: 64,
        zIndex: 999,
        transition: "background-color 0.3s ease 0s",
        borderBottom: "1px solid black",
        backgroundColor: "transparent"
    },
    colouredTabs: {
        position: "sticky",
        top: 64,
        zIndex: 999,
        transition: "background-color 0.3s ease 0s",
        backgroundColor: theme.palette.tertiary.main
    }
}))