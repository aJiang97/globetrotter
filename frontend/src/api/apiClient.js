import axios from "axios";

const BASE_URI = "http://localhost:5000";

const client = axios.create({
  baseURL: BASE_URI,
  json: true
});

class APIClient {
  getLocations(city, preferences) {
    return this.perform("get", `/suggest/fs_google/prefs?city=${city}&types=${preferences}`);
  }

  registerUser(name, email, password) {
    const data = { email: email, hashedpw: password, displayname: name };
    return this.perform("post", `/auth/signup`, data);
  }

  loginUser(email, password) {
    const data = { email: email, hashedpw: password };
    return this.perform("post", `/auth/login`, data);
  }

  logoutUser(email, token) {
    const data = { email: email, token: token };
    return this.perform("post", `/auth/logout`, data);
  }

  getUser(email, token) {
    const data = { email: email };
    return this.perform("post", `/user/search`, data, token);
  }

  generateItinerary(places) {
    return this.perform("post", `routing/itinerary`, { place_id: places });
  }

  saveItinerary(token, description, city, start, end, places, orderedPlaces) {
    const data = {
      info: {
        description: description,
        city: city,
        tripstart: start,
        tripend: end
      },
      blob: {
        places: places, // original places passed to routing endpoint
        orderedPlaces: orderedPlaces // the orderedPlaces from routing endpoint
      }
    };
    return this.perform("post", `trip`, data, token);
  }

  deleteTrip(token, uuid) {
    return this.perform("delete", `trip?uuid=${uuid}`, "", token);
  }

  updateItinerary(
    token,
    uuid,
    description,
    city,
    start,
    end,
    places,
    orderedPlaces
  ) {
    const data = {
      info: {
        description: description,
        city: city,
        tripstart: start,
        tripend: end
      },
      blob: {
        places: places, // original places passed to routing endpoint
        orderedPlaces: orderedPlaces // the orderedPlaces from routing endpoint
      }
    };
    return this.perform("patch", `trip?uuid=${uuid}`, data, token);
  }

  getAllTrips(token) {
    return this.perform("get", `trip/all`, "", token);
  }

  getItineraryDetail(token, uuid) {
    return this.perform("get", `trip?uuid=${uuid}`, "", token);
  }

  searchLocation(city, query) {
    return this.perform("get", `suggest/search?city=${city}&query=${query}`);
  }

  getUsersOnTrip(token, uuid) {
    return this.perform("get", `trip/user?uuid=${uuid}`, "", token);
  }

  addUserToTrip(token, user, uuid) {
    const data = {
      displayname: user.displayname,
      email: user.email,
      permission: 2 // Add the new user as an editor
    };
    return this.perform("post", `trip/user?uuid=${uuid}`, data, token);
  }

  deleteUserFromTrip(token, email, uuid) {
    const data = { email: email };
    return this.perform("delete", `trip/user?uuid=${uuid}`, data, token);
  }

  exportTrip(data) {
    return this.perform("post", `export`, { itinerary: data });
  }

  async perform(method, resource, data, token) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        "AUTH-TOKEN": token
      }
    })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        return error.response.status;
      });
  }
}

export default APIClient;
