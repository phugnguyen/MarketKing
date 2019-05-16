const url = "https://api-pub.bitfinex.com/v2";

// Available values: '5m', '15m','1h', '3h',
//                   '6h', '12h', '1D', '1M'

// query parmas limit(number of candles, max:5000)
// start(ms) end(ms) sort(if = 1 it sorts old to new)

let timeFrame = "15m";
let ticker = "tBTCUSD";

const proxyUrl = "https://cors-anywhere.herokuapp.com/",
  targetUrl = `${url}/candles/trade:${timeFrame}:${ticker}/hist?limit=365`;
fetch(proxyUrl + targetUrl)
  .then(response => response.json())
  .then(data => {
    console.table(data);
    return data;
  })
  .catch(e => {
    console.log(e);
    return e;
  });
