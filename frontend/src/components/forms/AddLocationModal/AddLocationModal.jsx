import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Collapse,
  ExpansionPanel,
  ExpansionPanelSummary,
  IconButton,
  Paper,
  Typography
} from "@material-ui/core";
import { Close, ExpandMore } from "@material-ui/icons";

import { LocationCard } from "./LocationCard";
import { SearchBar } from "../../SearchBar";
import { styles } from "./styles";

class PureAddLocationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addedLocations: [],
      locations: [],
      disableAdd: true,
      allExpanded: false,
      selectedExpanded: false
    };
  }

  isAdded = id => {
    const { addedLocations } = this.state;
    for (var key in addedLocations) {
      if (addedLocations[key].google.place_id === id) return true;
    }
    return false;
  };

  isMember(newID) {
    const arr = this.props.existingLocations.filter(location => {
      return location.google.place_id === newID;
    });
    return arr.length === 0 ? false : true;
  }

  handleResult = locations => {
    if (locations) {
      const filteredLocations = locations.filter(
        location => !this.isMember(location.google.place_id)
      );
      this.setState({ locations: filteredLocations });
    } else this.setState({ locations: [] });
  };

  handleChangeAllPanel = e => {
    this.setState({ allExpanded: !this.state.allExpanded });
  };

  handleChangeSelectedPanel = e => {
    this.setState({ selectedExpanded: !this.state.selectedExpanded });
  };

  handleSelectLocation = key => {
    this.setState(state => {
      const addedLocations = state.addedLocations.concat(state.locations[key]);
      return {
        ...state,
        addedLocations,
        disableAdd: false
      };
    });
  };

  handleDeselectLocation = id => {
    this.setState(state => {
      const addedLocations = state.addedLocations.filter(
        location => location.google.place_id !== id
      );
      return {
        ...state,
        addedLocations
      };
    });
  };

  handleSubmit = () => {
    if (this.state.addedLocations.length !== 0) {
      this.props.onSubmit(this.state.addedLocations);
    }
  };

  render() {
    const { classes, onClose, city } = this.props;
    return (
      <React.Fragment>
        <div className={classes.darkBackdrop} onClick={onClose} />
        <Paper className={classes.modal}>
          <Typography variant="h4" className={classes.title}>
            Add New Location
          </Typography>
          <IconButton className={classes.closeButton} onClick={onClose}>
            <Close />
          </IconButton>
          <div className={classes.searchBar}>
            <SearchBar city={city} handleSearchResult={this.handleResult} />
          </div>
          <div className={classes.locationsContainer}>
            <ExpansionPanel
              className={classes.expansionPanel}
              expanded={this.state.selectedExpanded}
              onChange={this.handleChangeSelectedPanel}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">
                  {`Selected Locations (${this.state.addedLocations.length})`}
                </Typography>
              </ExpansionPanelSummary>
              <Collapse in={this.state.selectedExpanded}>
                {this.state.addedLocations.map((location, key) => (
                  <LocationCard
                    id={key}
                    key={key}
                    isAdded={this.isAdded(location.google.place_id)}
                    location={location}
                    onRemove={this.handleDeselectLocation}
                    onAdd={this.handleSelectLocation}
                  />
                ))}
              </Collapse>
            </ExpansionPanel>
            <ExpansionPanel
              className={classes.expansionPanel}
              expanded={this.state.allExpanded}
              onChange={this.handleChangeAllPanel}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">
                  {`Locations (${this.state.locations.length})`}
                </Typography>
              </ExpansionPanelSummary>
              <Collapse in={this.state.allExpanded}>
                {this.state.locations &&
                  this.state.locations.map((location, key) => (
                    <LocationCard
                      id={key}
                      key={key}
                      isAdded={this.isAdded(location.google.place_id)}
                      location={location}
                      onRemove={this.handleDeselectLocation}
                      onAdd={this.handleSelectLocation}
                    />
                  ))}
              </Collapse>
            </ExpansionPanel>
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              color="primary"
              variant="contained"
              disabled={this.state.disableAdd}
            >
              <Typography
                className={classes.loginText}
                variant="button"
                onClick={this.handleSubmit}
              >
                Add
              </Typography>
            </Button>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

export const AddLocationModal = withStyles(styles)(PureAddLocationModal);
