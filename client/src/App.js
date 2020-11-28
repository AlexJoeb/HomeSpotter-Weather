import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Axios for data fetching.
import Axios from "axios";

// The Home page component displays the input/geolocating functionality to choose a location.
import Home from "./Pages/Home";

// The Weather page component displays all the weather forecast information for the selected location.
import Weather from "./Pages/Weather";

// Config Keys Import
import Keys from "./config";

// Geocode for location finding.
import Geocode from "react-geocode";

// Config Keys Definition
const { GOOGLE_API_KEY } = Keys;

// Geocode Config
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setLanguage("en");

const App = () => {
  // The chosen location, passed/set by the Form page element. Resets to null when user click 'Choose another location'
  const [location, setLocation] = useState(null);

  // Array of Object containing weather information. Index 0 is current.
  const [weather, setWeather] = useState(null);

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Home location={location} setLocation={setLocation} />
            )}
          />
          <Route
            path="/weather"
            render={() => (
              <Weather
                weather={weather}
                setWeather={setWeather}
                location={location}
                setLocation={setLocation}
              />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
