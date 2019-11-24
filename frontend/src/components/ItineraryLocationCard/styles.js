import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  card: {
    display: "flex",
    borderRadius: "15px"
  },

  // Time Section
  timeColumn: {
    backgroundColor: "#007EFC",
    height: "100%",
    textAlign: "center",
    color: "white",
    position: "relative"
  },
  timeDetails: {
    fontSize: "40px"
  },
  time: {
    fontSize: "16px"
  },
  verticalLine: {
    borderRight: "3px solid white",
    height: "20px",
    width: "50%"
  },
  suggestion: {
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: "50%",
    color: "white"
  },
  suggested: {
    fontSize: "12px"
  },
  suggestedTime: {
    fontWeight: "bold",
    fontSize: "20px"
  },

  // Media Section
  media: {
    height: "100%"
  },

  // Content Section
  cardContent: {
    marginLeft: "10px",
    position: "relative"
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5
  },
  venueName: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "10px",
    marginTop: "5px",
    maxWidth: "90%"
  },
  venueType: {
    fontStyle: "italic",
    fontSize: "15px",
    maxWidth: "90%"
  },
  venueDescription: {
    marginBottom: 0,
    marginTop: "5px",
    overflow: "hidden",
    height: "80px"
  }
}));
