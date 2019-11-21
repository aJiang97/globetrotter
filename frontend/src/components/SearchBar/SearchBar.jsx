import * as React from "react";
import { Button, InputBase } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";

import { styles } from "./styles";
import APIClient from "../../api/apiClient";

class PureSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ""
    };
  }

  handleSearch = event => {
    this.apiClient = new APIClient();
    this.apiClient
      .searchLocation(this.props.city, this.state.searchInput)
      .then(data => {
        if (data.locations.length === 0) {
          this.props.handleSearchResult(null);
        } else {
          this.props.handleSearchResult(data.locations);
        }
      });
  };

  handleInputChange = event => {
    this.setState({
      searchInput: event.target.value
    });
    if (event.target.value === "") {
      this.props.handleSearchResult([]);
    }
  };

  handleEnterKey = event => {
    if (event.key === "Enter") this.handleSearch();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.search}>
        <InputBase
          placeholder={`Search in ${this.props.city}...`}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          onKeyPress={this.handleEnterKey}
          onChange={this.handleInputChange}
        />
        <Button className={classes.searchIcon} onClick={this.handleSearch}>
          <Search />
        </Button>
      </div>
    );
  }
}

export const SearchBar = withStyles(styles)(PureSearchBar);
