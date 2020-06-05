import React, { useEffect, useState } from 'react';
import { currencyService } from '../../services/currency.service';
// Dropdown
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// Date Picker
import DatePicker from 'react-datepicker';

// Workaround for JavaScript heap out of memory error with plotly
// https://github.com/plotly/react-plotly.js/issues/135

import Plotly from 'plotly.js-basic-dist';

import createPlotlyComponent from 'react-plotly.js/factory';
// Components
import Utils from '../../utils/Utils';
import Stats from '../Stats/Stats';

const Plot = createPlotlyComponent(Plotly);

function Chart({
  base, symbol, symbols, setCompareSymbol
}) {
  const [state, setState] = useState({
    xAxis: [],
    yAxis: []
  });

  const [startDate, setStartDate] = useState(new Date().setDate(new Date().getDate() - 7));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    updateChart(base, symbol, Utils.dateToEuropean(startDate), Utils.dateToEuropean(endDate));
  }, [base, symbol, startDate, endDate]);

  function updateChart(base, symbol, start, end) {
    currencyService.getHistoricalRatesForPeriod(base, symbol, start, end).then(
      (data) => {
        // In ideal world all these mutations have to be done on server side
        // Front should just receive xAxis and yAxis arrays

        // Get property names as x axis values
        const xAxis = Object.keys(data.rates);
        const yAxis = [];

        // Object keys do not guarantee correct order
        // Sorting manually
        xAxis.sort();

        // Find corresponding value for each x axis
        xAxis.forEach((date) => {
          yAxis.push(data.rates[date][symbol]);
        });

        setState({ xAxis, yAxis });
      }
    );
  }

  return (
    <div>
      <div>Compare to: {symbol}</div>
      <div>
        <ReactDropdown
          options={symbols.filter((smb) => smb !== base)}
          onChange={(e) => setCompareSymbol(e.value)}
          value={symbol}
          placeholder="Select symbol to compare against"
        />
      </div>
      <div>Time Span: {Utils.dateToEuropean(startDate)} -> {Utils.dateToEuropean(endDate)}</div>
      <div className="d-flex">
        <div className="d-flex flex-column justify-content-between mr-3">
          <div className="d-flex justify-content-between">
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
            />
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
                            // minDate={startDate}
              maxDate={new Date()}
            />
          </div>
          <Plot
            data={[
              {
                x: state.xAxis,
                y: state.yAxis,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' }
              }
            ]}
            layout={{ width: 640, height: 480, title: `${base} to ${symbol}` }}
          />
        </div>

        <Stats prices={state.yAxis} />
      </div>
    </div>
  );
}

export default Chart;
