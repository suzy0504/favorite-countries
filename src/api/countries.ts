import axios from "axios";

const countriesApi = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});

export const getAllCountries = () => {
  return countriesApi.get("/all");
};

export default countriesApi;
