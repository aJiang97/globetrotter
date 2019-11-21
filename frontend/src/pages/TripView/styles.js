import { createStyles } from "@material-ui/core/styles";

const baseButton = {
  width: 80,
  margin: 5,
  zIndex: 2
};

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
    paddingRight: "30px"
  },
  flexScroll: {
    // paddingLeft: "30px",
    // marginTop: "75px"
  },
  title: {
    fontFamily: "Roboto",
    marginBottom: "20px",
    marginTop: "30px"
  },
  container: {
    margin: "63px 5%",
    width: "90%"
  },
  dateTabs: {
    marginTop: "500px"
  },
  itinerary: {
    paddingTop: "30px"
  },
  buttonsContainer: {
    position: "absolute",
    top: 110,
    right: "15%",
    display: "flex",
    flexDirection: "row"
  },
  SaveButton: {
    ...baseButton,
  },
  DeleteButton: {
    ...baseButton,
    color: "white",
  },
  resize: {
    fontSize: 57,
    fontWeight: "bold"
  },
  green: {
    color: "green"
  },
  underline: {
    "&:before": {
      borderBottom: "1px solid white !important"
    },
    "&:after": {
      borderBottom: `2px solid white !important`
    },
    "&:hover:not($disabled):not($focused):not($error):before": {
      borderBottom: `2px solid white !important`
    }
  },
  datesContainer: {
    display: "grid",
    gridTemplateColumns: "0.5fr 1fr 0.5fr 1fr",
    width: "45%",
    alignItems: "baseline"
  },
  mapContainer: {
    zIndex: 1
  }
}));
