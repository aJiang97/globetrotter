import { createStyles } from "@material-ui/core/styles";

const arrowButton = {
  position: "fixed",
  top: "50%",
  height: 100,
  padding: "0 50 0 50",
  minWidth: 35,
  transition: "right 0.5s",
  zIndex: 2
};

const viewButton = {
  position: "fixed",
  width: 400,
  bottom: 0,
  zIndex: 5000,
  transition: "right 0.5s"
};

const flexScroll = {
  flexGrow: 1,
  overflow: "auto",
  maxHeight: "100%",
  marginTop: "64px"
}

export const styles = createStyles(theme => ({
  section: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    height: '100vh',
    width: '100%'
  },
  flexScroll: {
    ...flexScroll,
    paddingLeft: "40px",
    paddingRight: "80px"
  },
  locationPane: {
    ...flexScroll,
    boxShadow: "-10px 0px 5px 0px rgba(0,0,0,0.4)"
  },
  locationCardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
  },
  title: {
    fontWeight: "bold",
    marginTop: "20px",
    fontSize: "30px",
    width: "100%",
    textAlign: "center"
  },
  arrowButtonIn: {
    ...arrowButton,
    right: 0
  },
  arrowButtonOut: {
    ...arrowButton,
    right: 400
  },
  plan_button: {
    marginTop: 100,
    marginRight: 60,
    float: "right"
  },
  button_text: {
    color: "white",
    fontStyle: "inherit"
  }
}));
