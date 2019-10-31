import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
    transparentTabs: {
        position: "-webkit-sticky",
        position: "sticky",
        top: 0,
        zIndex: 999,
        transition: "background-color 0.3s ease 0s",
        borderBottom: "1px solid black",
        backgroundColor: "transparent"
    },
    colouredTabs: {
        position: "-webkit-sticky",
        position: "sticky",
        top: 0,
        zIndex: 999,
        transition: "background-color 0.3s ease 0s",
        backgroundColor: "#FF8D77"
    }
}))