import React, { useState } from 'react';
import './index.style.css';
import FlightSearchItem from './FlightSearchItem';
import FlightSearchFooter from './FlightSearchFooter';
import useFetchFlightResults from './useFetchFlightResults';
import SortBy from './filters/SortBy';
import { SortByDefaultOption, SortByOptions } from './filters/SortBy/enums';

export default function FlightSearch() {
  const [sortBy, setSortBy] = useState(SortByDefaultOption);

  // Fetch Flights
  const { flights } = useFetchFlightResults();

  // Only show 10 flight results per page
  // let paginatedFlights = flights.slice(0, 8);
  let data = flights.slice(0, 8)
  const [paginatedFlights, setPaginatedFlights] = useState(data)

  let handleOnChange = (event) => {
    setSortBy(event.value)

    if (event.label === SortByOptions[0].label) {
      let result = [...flights].sort((a, b) => a.score - b.score).slice(0,8)
      setPaginatedFlights(result);
    }
    if (event.label === SortByOptions[1].label) {
      let result = [...flights].sort((a, b) => a.price - b.price).slice(0,8);
      setPaginatedFlights(result);
    }
    if (event.label === SortByOptions[2].label) {
      let result  = [...flights].sort((a, b) => {
        const firstFlight = new Date(a.departsAt);
        const secondFlight = new Date(b.departsAt);
        return firstFlight < secondFlight ? 1 : -1;
      }).slice(0,8);
      setPaginatedFlights(result);
    }
  }

  return (
    <div className="row">
      <div className="pane m-t-1">
        <div>SORT BY ${JSON.stringify(sortBy)}</div>
        <div className="pane-header search-results__header">
          <div className="search-results__title">
            <b>Select an outbound flight</b>
            <p className="m-v-0 fade small">DEN → CHI</p>
          </div>
          <SortBy value={sortBy.value} onChange={(e) => handleOnChange(e)} />
        </div>
        {/* Display Flight Results */}
        <div className="pane-content">
          {Array.isArray(paginatedFlights) &&
            paginatedFlights.map(flight => (
              <FlightSearchItem key={flight.id} flight={flight} />
            ))}
        </div>
      </div>
      {/* Pagination */}
      <FlightSearchFooter />
    </div>
  );
}
