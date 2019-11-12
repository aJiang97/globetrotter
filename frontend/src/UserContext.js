import * as React from "react";

export const UserContext = React.createContext({
  user: null,
  logIn: () => {},
  logOut: () => {}
});
