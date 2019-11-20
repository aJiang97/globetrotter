import { createStyles } from "@material-ui/core/styles";

const baseButton = {
  width: 80,
  margin: 5
};

export const styles = createStyles(theme => ({
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
  }
}));
