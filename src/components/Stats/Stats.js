import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function Stats({ prices }) {
  const [rowData, setRowData] = useState([]);
  const [change, setChange] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  const columnsDef = [{
    headerName: '', field: 'name', sortable: true, filter: true
  }, {
    headerName: '', field: 'units', sortable: true, filter: true
  }];

  useEffect(() => {
    if (prices.length > 0) {
      const max = Math.max(...prices);
      const min = Math.min(...prices);
      const average = prices.reduce((a, b) => a + b, 0) / prices.length;

      //
      const firstPrice = prices[prices.length - 1];
      const lastPrice = prices[0];

      const change = firstPrice - lastPrice;

      setChange(change);

      if (change >= 0) {
        setPercentChange((change / lastPrice) * 100);
      } else {
        setPercentChange(((lastPrice - firstPrice) / lastPrice) * 100);
      }

      setRowData([{ name: 'High', units: max.toFixed(2) }, { name: 'Low', units: min.toFixed(2) }, { name: 'Average', units: average.toFixed(2) }]);
    }
  }, [prices]);
  return (
    <div>
      <div>Stats</div>
      <div>Change: &nbsp;
        {change >= 0
          ? <span style={{ color: 'green' }}>{change.toFixed(2)}&nbsp;+{percentChange.toFixed(2)}%</span>
          : <span style={{ color: 'red' }}>{change.toFixed(2)}&nbsp;-{percentChange.toFixed(2)}%</span>}
      </div>
      <div style={{ height: '400px', width: '420px' }} className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columnsDef}
          rowData={rowData}
        />
      </div>
    </div>
  );
}

export default Stats;
