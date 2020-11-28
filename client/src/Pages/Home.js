import React, { useEffect, useState } from 'react'

// React Hook Form
import { useForm } from 'react-hook-form';

// React Router DOM
import { useHistory } from 'react-router-dom';

// Geocode import for location services.
import Geocode from "react-geocode";

// SVG Imports
import { ReactComponent as LocateArrow } from '../Assets/Locate.svg';
import { ReactComponent as Loading } from '../Assets/Loading.svg';
import { ReactComponent as Cancel } from '../Assets/Cancel.svg';

export default function Home({ location, setLocation }) {
  // Position will hold a string with the value of city, state information. (Ex. 'Burnsville, Minnesota')
  const [position, setPosition] = useState(null);

  // AskingPosition is set to true when loading/fetching the user's location.
  // Allows us to bypass react-hook-form errors showing right away, if loading.
  const [askingPosition, setAskingPosition] = useState(false);

  // LoadingErrors is an error of string that holds any errors that are caught outside of react-hook-forms errors.
  const [loadingErrors, setLoadingErrors] = useState([]);
  
  // React Hook Form values.
  const { register, handleSubmit, setValue, errors } = useForm();

  // Browser History for pushing.
  const history = useHistory();

  // On submit callback given to react-hook-form's `handleSubmit` in the form's jsx element.
  const onSubmit = data => {
    if (!!data && Object.keys(data).length) {
      // If data value is truthy and the truthy object has at least one key/value pair.
      // Location is derived from user input and can be accessed through react hook form's data object.  
      setLocation(data.location);
      history.push('/history');
    } else if (!!position && typeof position === 'string') {
      // If position is truth and value of position is typeof string.
      // Location was geolocated and the city/state name can be accessed through the `position` value.
      setLocation(position);
      history.push('/weather');
    } else {
      // Neither above passed && React Hook Form didn't detect an error.. something went wrong.
      // Set a loading error to display.
      setLoadingErrors([
        ...loadingErrors,
        'Something went wrong while submitting.. reseting all values to default.',
      ]);
      // Reset position to null.
      setPosition(null);
      // Reset react-hook-form value to an empty string.
      setValue('location', '', { shouldValidate: false });
      // Reset overall location to null.
      setLocation(null);
    }
  };

  const locate = () => {
    // Set AskingPosition to true so react-hook-forms knows we are trying to fetch location.
    setAskingPosition(true);
    try {
      // Prompt the browser to ask for geolocation position.
      navigator.geolocation.getCurrentPosition(function (position) {
        // Use the coord lat/lon from `position` with the Google Geocode Location API to get city/state name.
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          response => {
            // Set AskingPosition to false, since we're done fetching.
            setAskingPosition(false);

            // Extract city and state name from Google's response.
            const city = response.results[0].address_components[2].long_name;
            const state = response.results[0].address_components[4].long_name;

            // Set `position` to a string containing `City, State' value.
            setPosition(`${city}, ${state}`);
          },
          error => {
            setAskingPosition(false);
            setLoadingErrors([
              ...loadingErrors,
              'An error occured while geolocating. Please refresh and try again.'
            ])
          }
        );
        
      });
    } catch (err) {
      setAskingPosition(false);
      setLoadingErrors([
        ...loadingErrors,
        'An error occured while geolocating. Please refresh and try again.'
      ])
    }
    
  }

  return (
    <div className='home'>
      <h1 className='home__title'>Hi there! Need the weather?</h1>
      <form className='form home__form' onSubmit={handleSubmit(onSubmit)}>
        <div className="form__errors">
          {(errors.location && position === null && !askingPosition ) && <span className='form__errors--error'>You must enter a location!</span>}
          {!!loadingErrors.length && <>
            {
              loadingErrors.map((err, idx) => <li className='form__errors--error' key={idx}>{err}</li>)
            }
          </>}
        </div>
        <div className='form__flex'>
          <div className="form__location">
            {(position === null && !askingPosition) && <LocateArrow className='form__location--arrow' onClick={locate} />}
            {askingPosition && <Loading className='form__location--loading' />}
            {(!askingPosition && position !== null) && <Cancel className='form__location--cancel' onClick={() => setPosition(null)} />}
          </div>
          <div className="form__inputs">
            { !position && <input className='form__inputs--input' name="location" ref={register({ required: true })} /> }
            {(position && typeof position === 'string') && <p className='form__inputs--text'>{position}</p> }
          </div>
        </div>
        <button className='form__submit' type="submit">Go!</button>
      </form>
      <div className='home__examples'>
        <p>Examples:</p>
        <p>City (Roseville)</p>
        <p>City, State (Roseville, Minnesota)</p>
      </div>
    </div>
  )
}
