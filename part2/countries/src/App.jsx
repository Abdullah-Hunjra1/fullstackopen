import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const capital = country.capital?.[0]
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (!capital) {
      setError('Capital city information is unavailable')
      return
    }

    if (!apiKey) {
      setError('Weather API key is missing')
      return
    }

    setLoading(true)
    setError(null)
    setWeather(null)

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(() => {
        setError('Weather information could not be loaded')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [capital, apiKey])

  return (
    <div>
      <h2>{country.name.common}</h2>

      <div>capital {capital}</div>
      <div>area {country.area}</div>

      <h3>Languages</h3>

      <ul>
        {Object.values(country.languages || {}).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="150"
      />

      <h3>Weather in {capital}</h3>

      {loading && <p>Loading weather...</p>}

      {error && <p>{error}</p>}

      {weather && (
        <div>
          <div>
            Temperature: {weather.main.temp} °C
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <div>
            {weather.weather[0].description}
          </div>

          <div>
            Wind: {weather.wind.speed} m/s
          </div>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Find Countries</h2>

      <input
        value={search}
        onChange={handleSearchChange}
      />

      {selectedCountry ? (
        <Country country={selectedCountry} />
      ) : countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length > 1 ? (
        countriesToShow.map(country =>
          <p key={country.cca3}>
            {country.name.common}
            <button onClick={() => showCountry(country)}>
              Show
            </button>
          </p>
        )
      ) : countriesToShow.length === 1 ? (
        <Country country={countriesToShow[0]} />
      ) : (
        <p>No countries found</p>
      )}
    </div>
  )
}

export default App