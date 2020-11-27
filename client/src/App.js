import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from 'axios';
export default () => {
  
  useEffect(() => {
    const key = `a93989a1cbf5a54bcc9715814582acaf`;
    Axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}&units=imperial`)
      .then(({ data }) => {
        const { lat, lon } = data.coord;
        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=a93989a1cbf5a54bcc9715814582acaf&units=imperial`;
      })
      .catch (err => console.error(err));
  }, [])
  
  return (
    <div className='app'>
      <Router>
        <Switch>
          <Route exact path='/' render={() => <p>Hello</p>} />
          <Route path='/weather' render={() => <p>Weather</p>} />
        </Switch>
      </Router>
    </div>
  )
  
}