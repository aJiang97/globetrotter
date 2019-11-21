import { createStyles } from "@material-ui/core/styles";

const baseButton = {
  width: 80,
  margin: 5
};

export const styles = createStyles(theme => ({
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%"
  },
  title: {
    fontFamily: "Roboto",
    marginBottom: "20px",
    width: "80%"
  },
  container: {
    margin: "100px 10%",
    width: "70%",
    marginLeft: "15%"
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
    ...baseButton
  },
  DeleteButton: {
    ...baseButton,
    color: "white"
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
  smallContainer: {
    display: "flex",
    flexDirection: "row"
  },
  datesContainer: {
    display: "grid",
    gridTemplateColumns: "0.5fr 1fr 0.5fr 1fr",
    width: "45%",
    alignItems: "baseline"
  },
  flexDiv: {
    flexGrow: 1
  }
}));
