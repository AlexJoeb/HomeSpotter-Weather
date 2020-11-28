import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Axios for data fetching.
import Axios from 'axios';

// The Form page component displays the input/geolocating functionality to choose a location.
import Home from './Pages/Home';

// Config Keys Import
import Keys from './config';

// Geocode for location finding.
import Geocode from "react-geocode";

// Config Keys Definition
const { GOOGLE_API_KEY, WEATHER_API_KEY } = Keys;

// Geocode Config
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setLanguage("en");

const App = () => {

  // The chosen location, passed/set by the Form page element. Resets to null when user click 'Choose another location'
  const [location, setLocation] = useState(null);

  // Array of Object containing weather information. Index 0 is current.
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Function used to fetch weather data after `location` is set.
    const fetchWeather = () => {
      Axios
        // First API call is to get the coords of the chosen location.
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=imperial`)
        .then(({ data }) => {
          const { lat, lon } = data.coord;
          const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${WEATHER_API_KEY}&units=imperial`;
          // Second API call is to get the Current & 7 day forecast by coords.
          Axios.get(query)
            .then(({ data }) => {
              const { daily } = data;
              setWeather(daily);
            })
            .catch(err => console.error({
              message: 'An error occured while fetching data from the hourly seven day forecast - OpenWeatherAPI.',
              err
            }));
        })
        .catch(err => console.error({
          message: 'An error occured while fetching data from the current weather - OpenWeatherAPI.',
          err,
        }));
    }

    // Every time the location state is updated, refetch the weather for that location.
    // If location is set to null, we don't fetch.
    if (location === null) return;
    else fetchWeather();
   }, [location]);

  return (
    <div className='app'>
      <Router>
        <Switch>
          <Route exact path='/' render={() => <Home location={location} setLocation={setLocation} />} />
          <Route path='/weather' render={() => <p>Weather</p>} />
        </Switch>
      </Router>
    </div>
  )
  
}

export default App;