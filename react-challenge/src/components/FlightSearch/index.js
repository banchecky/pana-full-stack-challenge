import React, { useState } from 'react';
import Select from 'react-select';
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
  const [paginatedFlights, setPaginatedFlights] = useState(data);
  const [selectedTime, setSelectedTime] = useState('')

  const options = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'red-eye', label: 'Red-eye' },
  ];

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
      let result = flights.sort((a, b) => {
        const firstFlight = new Date(a.segmentsArray[0].departsAt);
        const secondFlight = new Date(b.segmentsArray[0].departsAt);
        return firstFlight < secondFlight ? -1 : 1;
      }).slice(0,8);
      setPaginatedFlights(result);
    }
  }

  let handleTimeChange = selectedTime => {
    setSelectedTime(selectedTime.label);

    if(selectedTime.label === 'Morning') {
      let result  = flights.filter((a) => {
        let { segmentsArray } = a
        let event = new Date(segmentsArray[0].departsAt).toLocaleTimeString('en-US')
        let hour = event.slice(0, event.indexOf(':')) 
        if(event.indexOf('AM') > 0 && hour >= 6 && hour < 12 ) {
          return segmentsArray
        }
      }).slice(0,8);
      setPaginatedFlights(result);
    }

    if(selectedTime.label === 'Afternoon') {
      let result  = flights.filter((a) => {
        let { segmentsArray } = a
        let event = new Date(segmentsArray[0].departsAt).toLocaleTimeString('en-US')
        let hour = event.slice(0, event.indexOf(':')) 
        console.log('hour', hour)
        if(event.indexOf('PM') > 0 && (hour === 12 || hour < 6 )) {
          return segmentsArray
        }
      }).slice(0,8);
      setPaginatedFlights(result);
    }
    if(selectedTime.label === 'Evening') {
      let result  = flights.filter((a) => {
        let { segmentsArray } = a
        let event = new Date(segmentsArray[0].departsAt).toLocaleTimeString('en-US')
        let hour = event.slice(0, event.indexOf(':')) 
        if(event.indexOf('PM') > 0 && hour >= 6 && hour < 12 ) {
          return segmentsArray
        }
      }).slice(0,8);
      setPaginatedFlights(result);
    }
    if(selectedTime.label === 'Red-eye') {
      let result  = flights.filter((a) => {
        let { segmentsArray } = a
        let event = new Date(segmentsArray[0].departsAt).toLocaleTimeString('en-US')
        let hour = event.slice(0, event.indexOf(':')) 
        if(event.indexOf('AM') > 0 && (hour === 12 || hour < 6 )) {
          return segmentsArray
        }
      })
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
          <div className="row">
            <div className="col-xs-offset-3 col-xs-9">
              <SortBy 
              value={sortBy.value} 
              onChange={(e) => handleOnChange(e)}
              />
            </div>
            <div className="col-xs-offset-3 col-xs-9">
              Departs at
              <Select 
                value={selectedTime.label}
                onChange={e => handleTimeChange(e)}
                options={options}
                styles={{ input: () => ({ width: 150 }) }}
              />
            </div>
          </div>
        </div>
        <div className="pane-header search-results__header">
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
