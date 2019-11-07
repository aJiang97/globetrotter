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

  async perform(method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(resp => {
      return resp.data ? resp.data : [];
    });
  }
}

export default APIClient;
