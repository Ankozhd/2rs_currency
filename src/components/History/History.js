import React, { useEffect, useState } from 'react';
// Components
import DatePicker from 'react-datepicker';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// Services
import { currencyService } from '../../services/currency.service';
import Utils from '../../utils/Utils';


function History({ base }) {
  const [date, setDate] = useState(new Date());
  const [rowData, setRowData] = useState([]);

  const columnsDef = [{
    headerName: 'Currency Code', field: 'currency', sortable: true, filter: true
  }, {
    headerName: 'Units', field: 'units', sortable: true, filter: true
  }];


  useEffect(() => {
    currencyService.getHistoricalRates(base, Utils.dateToEuropean(date)).then(
      (data) => {
        const rows = [];

        const symbols = Object.keys(data.rates);

        symbols.forEach((symbol) => {
          rows.push({ currency: symbol, units: data.rates[symbol].toFixed(2) });
        });

        setRowData(rows);
      }
    );
  }, [base, date]);

  return (
    <div>
      <div>
        Historical data
      </div>
      <div>
        <DatePicker
          dateFormat="yyyy/MM/dd"
          selected={date}
          onChange={(date) => setDate(date)}
          maxDate={new Date()}
        />
      </div>
      <div style={{ height: '600px', width: '420px' }} className="ag-theme-alpine mt-3">
        <AgGridReact
          columnDefs={columnsDef}
          rowData={rowData}
        />
      </div>
    </div>

  );
}


export default History;
