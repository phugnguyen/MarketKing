const url = "https://api-pub.bitfinex.com/v2";

// Available values: '5m', '15m','1h', '3h',
//                   '6h', '12h', '1D', '1M'

// query parmas limit(number of candles, max:5000)
// start(ms) end(ms) sort(if = 1 it sorts old to new)

let timeFrame = "3h";
let ticker = "tBTCUSD";
let arrayData;

const proxyUrl = "https://cors-anywhere.herokuapp.com/",
  targetUrl = `${url}/candles/trade:${timeFrame}:${ticker}/hist?limit=100`;

function findRelativeStrength(arr) {
  let lossSum = 0;
  let gainSum = 0;

  let i = 0;
  let length = arr.length;

  for (i; i < length; i++) {
    lossSum += arr[0];
    gainSum += arr[1];
  }
  const avgLoss = lossSum / length;
  const avgGain = gainSum / length;

  return [avgLoss, avgGain];
}

function findChange(arr) {
  let result = [[0, 0]];
  let i = 0;
  let length = arr.length;

  for (i; i < length - 1; i++) {
    const change = arr[i + 1] - arr[i];
    change > 0 ? result.push([0, change]) : result.push([-1 * change, 0]);
  }

  return result;
}

fetch(proxyUrl + targetUrl)
  .then(response => response.json())
  .then(data => {
    // aync await , promises but better
    arrayData = data;

    let volumeData = [];
    let priceData = [];
    arrayData.map(el => {
      volumeData.push(el[5]);
      priceData.push([el[0], el[2]]);
    });

    const svgWidth = window.innerWidth / 2,
      svgHeight = window.innerHeight / 6,
      barPadding = 0;

    const barWidth = svgWidth / volumeData.length;

    const svg = d3
      .select("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const yScaleVolume = d3
      .scaleLinear()
      .domain([0, d3.max(volumeData)])
      .range([0, svgHeight]);

    const rectContainer = svg.append("svg");

    rectContainer
      .selectAll("rect")
      .data(volumeData)
      .enter()
      .append("rect")
      .attr("y", function(d) {
        return svgHeight - yScaleVolume(d);
      })
      .attr("height", function(d) {
        return yScaleVolume(d);
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function(d, i) {
        const translate = [barWidth * i, -20];
        return "translate(" + translate + ")";
      });
  })
  .catch(e => {
    console.log(e);
    return e;
  });

//Response Details
// Fields	Type	           Description
// MTS	  int	             millisecond time stamp
// OPEN	  float	           First execution during the time frame
// CLOSE	float	           Last execution during the time frame
// HIGH	  float	           Highest execution during the time frame
// LOW	  float	           Lowest execution during the timeframe
// VOLUME	float	           Quantity of symbol traded within the timeframe
