const url = "https://api-pub.bitfinex.com/v2";

// Available values: '5m', '15m','1h', '3h',
//                   '6h', '12h', '1D', '1M'

// query parmas limit(number of candles, max:5000)
// start(ms) end(ms) sort(if = 1 it sorts old to new)

let timeFrame = "15m";
let ticker = "tBTCUSD";
let arrayData;

const proxyUrl = "https://cors-anywhere.herokuapp.com/",
  targetUrl = `${url}/candles/trade:${timeFrame}:${ticker}/hist?limit=365`;

fetch(proxyUrl + targetUrl)
  .then(response => response.json())
  .then(data => {
    // aync await , promises but better
    arrayData = data;

    let volumeData = [];
    arrayData.map(el => {
      volumeData.push(el[5]);
    });

    const svgWidth = 4000,
      svgHeight = 2000,
      barPadding = 5;
    const barWidth = svgHeight / volumeData.length;

    const svg = d3
      .select("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(volumeData)])
      .range([0, svgHeight]);
    console.log(d3.max(volumeData));

    const yScaleAxis = d3
      .scaleLinear()
      .domain([0, d3.max(volumeData)])
      .range([svgHeight, 0]);

    const y_axis = d3.axisLeft().scale(yScaleAxis);

    svg
      .append("g")
      .attr("transform", "translate(50,10)")
      .call(y_axis);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([svgHeight, 0]);

    const x_axis = d3.axisBottom().scale(xScale);

    const xAxisTranslate = svgHeight - 20;

    svg
      .append("g")
      .attr("transform", "translate(50, " + xAxisTranslate + ")")
      .call(x_axis);

    const barChart = svg
      .selectAll("rect")
      .data(volumeData)
      .enter()
      .append("rect")
      .attr("y", function(d) {
        return svgHeight - yScale(d);
      })
      .attr("height", function(d) {
        return yScale(d);
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function(d, i) {
        const translate = [barWidth * i + 55, -20];
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
