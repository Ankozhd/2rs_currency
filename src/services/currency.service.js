function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('401');
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function cachedFetch(url, options, cacheKey) {
  const cached = sessionStorage.getItem(cacheKey);
  if (cached !== null) {
    const response = new Response(new Blob([cached]));
    return Promise.resolve(response);
  }

  return fetch(url, options).then((response) => {
    // Only store in cache json or something non-binary
    if (response.status === 200) {
      const ct = response.headers.get('Content-Type');
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // If we don't clone the response, it will be consumed by the time it's returned
        response.clone().text().then((content) => {
          sessionStorage.setItem(cacheKey, content);
        });
      }
    }
    return response;
  });
}

function getHistoricalRates(base, date) {
  const requestOptions = {
    method: 'GET',
  };

  return cachedFetch(`https://api.exchangeratesapi.io/${date}?base=${base}`, requestOptions, base + date).then(handleResponse);
}

function getHistoricalRatesForPeriod(base, symbols, start, end) {
  const requestOptions = {
    method: 'GET',
  };

  return cachedFetch(`https://api.exchangeratesapi.io/history?base=${base}&symbols=${symbols}&start_at=${start}&end_at=${end}`, requestOptions, base + symbols + start + end)
    .then((response) => handleResponse(response, base, symbols, start, end));
}

function getCurrencySymbols() {
  const requestOptions = {
    method: 'GET',
  };

  return fetch('https://api.exchangeratesapi.io/latest', requestOptions).then(handleResponse).then((data) => Object.keys(data.rates));
}

export const currencyService = {
  getHistoricalRates,
  getHistoricalRatesForPeriod,
  getCurrencySymbols
};
