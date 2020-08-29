const Axios = require('axios');

let listOfPetroleumProducts;
let maxYear;
let minYear;

/**
 * Get data from the server
 */
const getData = async () => {
  try {
    const res = await Axios.get(
      'https://raw.githubusercontent.com/younginnovations/internship-challenges/master/programming/petroleum-report/data.json'
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Calculates inverval of years .i.e. length
 * @param {Number} length Inverval of years
 */
const calculateInterval = length => {
  const intervals = [];
  let isCalculated = false;
  let currYear = minYear;

  while (!isCalculated) {
    intervals.push(currYear);
    currYear += length;
    intervals.push(currYear > maxYear ? maxYear : currYear - 1);

    if (currYear >= maxYear) isCalculated = true;
  }

  return intervals;
};

/**
 * Calculates Maximum value
 * @param {Array} arrayOfData Array of Data
 */
const calculateMax = arrayOfData =>
  Math.max(...arrayOfData) === -Infinity ? 0 : Math.max(...arrayOfData);

/**
 * Caclulates Minimum Value
 * @param {Array} arrayOfData Array of Data
 */
const calculateMin = arrayOfData =>
  Math.min(...arrayOfData) === Infinity ? 0 : Math.min(...arrayOfData);

/**
 * Calculates Average value from given array
 * @param {Array} arrayOfData Array of Data
 */
const calculateAverage = arrayOfData => {
  try {
    return (
      arrayOfData.reduce((acc, cur) => acc + cur) /
      arrayOfData.length.toFixed(2)
    );
  } catch (error) {
    return 0;
  }
};

/**
 * Calculates Report
 * @param {Array} data Array of Data from server
 * @param {Array} intervalYears Array of Interval Years
 */
const calculateReport = (data, intervalYears) => {
  const report = [];

  listOfPetroleumProducts.forEach(item => {
    const filteredByProduct = data.filter(
      product => product.petroleum_product === item
    );
    for (
      let currIndex = intervalYears.length - 1;
      currIndex > 0;
      currIndex -= 2
    ) {
      const filteredByDate = filteredByProduct.filter(
        product =>
          product.year >= intervalYears[currIndex - 1] &&
          product.year <= intervalYears[currIndex]
      );

      const omitedZeroValue = filteredByDate.filter(
        product => product.sale !== 0
      );

      const payload = {
        Product: item,
        Year: `${intervalYears[currIndex - 1]}-${intervalYears[currIndex]}`,
        Min: calculateMin(omitedZeroValue.map(product => product.sale)),
        Max: calculateMax(omitedZeroValue.map(product => product.sale)),
        Avg: calculateAverage(omitedZeroValue.map(product => product.sale)),
      };

      report.push(payload);
    }
  });

  return report;
};

/**
 * Generates Report
 */
const generateReport = async () => {
  const dataFromServer = await getData();

  const listOfYears = [...new Set(dataFromServer.map(product => product.year))];
  maxYear = Math.max(...listOfYears);
  minYear = Math.min(...listOfYears);

  listOfPetroleumProducts = [
    ...new Set(dataFromServer.map(product => product.petroleum_product)),
  ];

  const intervalOfYears = calculateInterval(5); // Pass years interval as an argument

  const report = calculateReport(dataFromServer, intervalOfYears);

  console.log(report);
};

generateReport(); // Main
