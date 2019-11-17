import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  section: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    boxSizing: "border-box",
    height: "100vh",
    width: "100%",
    // marginLeft: "15%",
    // margin: "100px 10%"
  },
  subSection:{
    display: "block",
    flexGrow: 1,
    overflow: "auto",
    maxHeight: "100%",
  },
  flexScroll: {
    // paddingLeft: "30px",
    // marginTop: "75px"
  },
  title: {
    fontFamily: "Roboto",
    marginBottom: "20px"
  },
  container: {
    margin: "100px 5%",
    width: "90%"
  },
  dateTabs: {
    marginTop: "500px"
  },
  itinerary: {
    // backgroundColor: "green",
    paddingTop: "30px"
  }
}));
