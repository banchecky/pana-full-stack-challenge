import React from 'react';

const FLIGHTS_URL = 'http://localhost:4000/flights';
// Q: how do we know it will be localhost 4000? 
// use template strings - `${PORT}/flights`?
// and have a constants file to help manage

const useFetchFlightResults = () => {
  const [flights, setFlights] = React.useState([]);
  const [error, setError] = React.useState(null);

  const fetchFlights = async () => {
    try {
      const flightResults = await fetch(FLIGHTS_URL);
      const flights = await flightResults.json();
      /**
       * Results come back as an array of [outbound, return] flights and
       * we just need the outbound flights for the purpose of this challenge
       */
      const outboundSegmentFlights = flights.map(flight => flight[0]);

      setFlights(outboundSegmentFlights);
    } catch (error) {
      setError(error);
      // display error component with error message 
    }
  };

  React.useEffect(() => {
    fetchFlights();
  }, []);

  return {
    error,
    flights,
  };
};

export default useFetchFlightResults;
