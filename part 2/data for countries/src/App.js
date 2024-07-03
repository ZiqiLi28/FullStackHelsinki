import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSelectedCountry(null);  // Clear selected country when search changes
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      <Countries 
        countries={filteredCountries} 
        handleShowCountry={handleShowCountry}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

const Countries = ({ countries, handleShowCountry, selectedCountry }) => {
  if (selectedCountry) {
    return <CountryDetail country={selectedCountry} />;
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  } else {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common} 
            <button onClick={() => handleShowCountry(country)}>show</button>
          </li>
        ))}
      </ul>
    );
  }
};

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital ? country.capital[0] : 'N/A'}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {country.languages && Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
    </div>
  );
};

export default App;
