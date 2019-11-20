import axios from "axios";

const BASE_URI = "http://localhost:5000";

const client = axios.create({
  baseURL: BASE_URI,
  json: true
});

class APIClient {
  getLocations(city, preferences) {
    return this.perform(
      "get",
      `/suggest/fs_google/prefs?city=${city}&types=${preferences}`
    );
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
    const data = { email: email, token: token };
    return this.perform("get", `/auth/getuser`, data);
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

  getAllTrips(token) {
    return this.perform("get", `trip/all`, "", token);
  }

  getItineraryDetail(token, uuid) {
    return this.perform("get", `trip?uuid=${uuid}`, "", token);
  }

  getUsersOnTrip(token, uuid) {
    return this.perform("get", `trip/user?uuid=${uuid}`, "", token);
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
