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

  async perform(method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
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
