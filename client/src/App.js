import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Axios for data fetching.
import Axios from 'axios';

// The form that takes in a location.
import Form from './Pages/Form';

// Geocode for location finding.
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyBSyHsFLNL2iBz_els1GjvsRjLJSlTU2D0");
// set response language. Defaults to english.
Geocode.setLanguage("en");
 
// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");
 
// Enable or disable logs. Its optional.
Geocode.enableDebug();

export default () => {
  // Array of Object containing weather information. Index 0 is current.
  const [weather, setWeather] = useState(null);

  const fetchWeather = () => {
    const key = `a93989a1cbf5a54bcc9715814582acaf`;
    Axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}&units=imperial`)
      .then(({ data }) => {
        const { lat, lon } = data.coord;
        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=a93989a1cbf5a54bcc9715814582acaf&units=imperial`;
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

  return (
    <div className='app'>
      <Router>
        <Switch>
          <Route exact path='/' component={Form} />
          <Route path='/weather' render={() => <p>Weather</p>} />
        </Switch>
      </Router>
    </div>
  )
  
}