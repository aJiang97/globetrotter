import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  container: {
    background: theme.palette.tertiary.main,
    position: "relative",
    transition: "height 200ms ease"
  },
  item: {
    transition: "all 200ms ease",
    transitionProperty: "left, top",
    "&:cssTransforms": {
      transitionProperty: "transform"
    },
    "&:resizing": {
      zIndex: 1,
      willChange: "width, height"
    },
    "&:react-draggable-dragging": {
      transition: "none",
      zIndex: 3,
      willChange: "transform"
    },
    "&:dropping": {
      visibility: "hidden"
    },
    "&:react-grid-placeholder": {
      background: "red",
      opacity: 0.2,
      transitionDuration: "100ms",
      zIndex: 2,
      userSelect: "none"
    },
    "&:react-resizable-handle": {
      position: "absolute",
      width: 20,
      height: 20,
      bottom: 0,
      right: 0,
      cursor: "se-resize"
    },
    "&:react-resizable-handle::after": {
      content: "",
      position: "absolute",
      right: 3,
      bottom: 3,
      width: 5,
      height: 5,
      borderRight: "2px solid rgba(0, 0, 0, 0.4)",
      borderBottom: "2px solid rgba(0, 0, 0, 0.4)"
    }
  }
}));
