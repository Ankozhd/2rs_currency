import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

// Dropdown
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// Service
import { currencyService } from '../../services/currency.service';
// Components
import History from '../History/History';
import Chart from '../Chart/Chart';


function Home() {
  const [symbols, setSymbols] = useState([]);
  const [base, setBase] = useState('USD');
  const [symbol, setSymbol] = useState('EUR');

  useEffect(() => {
    currencyService.getCurrencySymbols().then((currencySymbols) => setSymbols(currencySymbols));
  }, []);

  function setCompareSymbol(currency) {
    setSymbol(currency);
  }

  return (
    <div>
      <div>Base: { base }</div>
      <div>
        <ReactDropdown
          options={symbols.filter((currency) => currency !== symbol)}
          onChange={(e) => setBase(e.value)}
          value={base}
          placeholder="Select base currency"
        />
      </div>
      <Switch>
        <Route path="/history">
          <History base={base} />
        </Route>
        <Route path="/">
          <Chart
            base={base}
            symbol={symbol}
            symbols={symbols}
            setCompareSymbol={setCompareSymbol}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default Home;
