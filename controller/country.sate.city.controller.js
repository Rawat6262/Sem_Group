// const { Country, State, City } = require("country-state-city");
const express = require("express");
const countryrouter = express.Router();
const { Country, State, City } = require("country-state-city");

// Countries
countryrouter.get("/countries", (req, res) => {
  res.json(Country.getAllCountries());
});

// States
countryrouter.get("/states/:countryCode", (req, res) => {
  const states = State.getStatesOfCountry(req.params.countryCode);
  res.json(states);
});

// Cities
countryrouter.get("/cities/:countryCode/:stateCode", (req, res) => {
  const cities = City.getCitiesOfState(
    req.params.countryCode,
    req.params.stateCode
  );
  res.json(cities);
});

module.exports = countryrouter;
