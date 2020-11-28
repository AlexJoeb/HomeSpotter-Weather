import React, { useEffect, useState } from "react";

import { useHistory, Redirect } from "react-router-dom";

import Axios from "axios";

import { ReactComponent as Loading } from "../Assets/Loading.svg";
import { ReactComponent as Rain } from "../Assets/Rain.svg";
import { ReactComponent as Wind } from "../Assets/Wind.svg";
import { ReactComponent as Up } from "../Assets/Up.svg";
import { ReactComponent as Down } from "../Assets/Down.svg";

import Keys from "../config";
import { isFor } from "@babel/types";
const { WEATHER_API_KEY } = Keys;

export default function Weather({
  weather,
  location,
  setLocation,
  setWeather,
}) {
  // Current Day's forecast
  const [current, setCurrent] = useState(null);
  // List of all days (except current) to be displayed in body.
  const [toDisplay, setToDisplay] = useState([]);
  // FirstLoad variable, helps with conditional logic in a UseEffect below.
  const [firstLoad, setFirstLoad] = useState(true);
  // Holds a boolean, whether the WeatherAPI errors for any reason (most likely: location could not be found.)
  const [notFound, setNotFound] = useState(false);

  // Broswer History
  const history = useHistory();

  const returnHome = () => {
    // User has selected 'Change Location'
    // Set location back to default (null);
    setLocation(null);
    // Set weather data back to default(null);
    setWeather(null);
    // Push their history back home.
    history.push("/");
  };

  const addDay = (list = []) => {
    // --
    // Weather data is taken/removed from `weather` list and added to the `toDisplay` list (to be displayed).
    // When `weather` list is empty, we know that we don't have any more days to add from the 7 day forecast.
    // --
    // Take in a index (`idx`) and adds the weather information for that day at weather[idx]
    if (!weather.length) return; // Don't allow appending if we've reached/displayed all elements in list.
    // Add the weather data from `weather` to the `toDisplay` list, so our component knows to render the new day's data.
    setToDisplay([
      ...toDisplay,
      ...weather.filter((w, idx) =>
        list.length ? list.includes(idx) : idx === 0
      ),
    ]);
    // Remove the just appended weather data from weather.
    setWeather(
      weather.filter((w, idx) =>
        list.length ? !list.includes(idx) : idx !== 0
      )
    );
  };

  useEffect(() => {
    if (weather && firstLoad) {
      // Weather object is now truthy and able to be accessed.
      setFirstLoad(false);
      setCurrent(weather[0]);
      setWeather(weather.filter((w, idx) => idx !== 0));

      // Add three forecast days, first one will be 'Tomorrow'.
      addDay([0, 1, 2]);
    }
  }, [weather]);

  useEffect(() => {
    // When location is changed and/or component is loaded -> Fetch weather forecast data.
    Axios
      // First API call is to get the coords of the chosen location.
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=imperial`
      )
      .then(({ data }) => {
        const { lat, lon } = data.coord;
        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${WEATHER_API_KEY}&units=imperial`;
        // Second API call is to get the Current & 7 day forecast by coords.
        Axios.get(query)
          .then(({ data }) => {
            const { daily } = data;
            setWeather(daily);
          })
          .catch((err) =>
            console.error({
              message:
                "An error occured while fetching data from the hourly seven day forecast - OpenWeatherAPI.",
              err,
            })
          );
      })
      .catch((err) => {
        setNotFound(true);
        console.error({
          message:
            "An error occured while fetching data from the current weather - OpenWeatherAPI.",
          err,
        });
      });
  }, [location]);

  // If the user navigates to `/weather` endpoint without coming from home page, send to home.
  if (!location) return <Redirect to="/" />;
  else {
    return (
      <div className="weather">
        <div className="weather__header">
          {!weather && !notFound ? (
            <Loading className="weather__header--loading" />
          ) : (
            <>
              <p className="weather__header--change" onClick={returnHome}>
                {"< Change Location"}
              </p>
              <div className="weather__header__content">
                {notFound ? (
                  <p>Location not found! Try again.</p>
                ) : (
                  <div>
                    <p className="weather__header__content--today">Today</p>
                    <p className="weather__header__content--location">
                      {location}
                    </p>
                    <div className="weather__header__content__temps">
                      <p className="weather__header__content__temps--current">
                        {`${Math.round(current?.temp.day)}°` || ""}
                      </p>
                      <div className="weather__header__content__temps__highlow">
                        <p>{`High: ${Math.round(current?.temp.max)}°` || ""}</p>
                        <p>{`Low: ${Math.round(current?.temp.min)}°` || ""}</p>
                      </div>
                    </div>
                    <div className="weather__header__content__details">
                      <p className="weather__header__content__details--rain">
                        <Rain />
                        {`${current?.humidity}%` || ""}
                      </p>
                      <p className="weather__header__content__details--wind">
                        <Wind />
                        {`${Math.round(current?.wind_speed)} MPH @ ${
                          current?.wind_deg
                        }°` || ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {!notFound && (
          <div className="weather__body">
            {
              // While weather data is null/still fetching, don't display anything.
              !toDisplay.length
                ? null
                : toDisplay.map((day, idx) => (
                    <div key={idx} className="weather__card">
                      <p className="weather__card--date">
                        {idx === 0
                          ? "Tomorrow"
                          : new Date(day.dt * 1000)
                              .toString()
                              .split(" ")
                              .splice(0, 4)
                              .join(" ")}
                      </p>
                      <div className="weather__card__temps">
                        <p className="weather__card__temps--current">
                          {Math.round(day.temp.day)}°
                        </p>
                        <div className="weather__card__temps__highlow">
                          <p className="weather__card__temps__highlow--high">
                            <Up />
                            {day.temp.max}°
                          </p>
                          <p className="weather__card__temps__highlow--low">
                            <Down />
                            {day.temp.min}°
                          </p>
                        </div>
                      </div>
                      <div className="weather__card__info">
                        <p className="weather__card__info--details">
                          <Rain />
                          {day.humidity}% <Wind />
                          {Math.round(day.wind_speed)} MPH @ {day.wind_deg}°
                        </p>
                      </div>
                    </div>
                  ))
            }
            {!weather?.length ? null : (
              <button
                className="weather__card weather__card__add"
                onClick={() => addDay()}
              >
                <p>+</p>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
