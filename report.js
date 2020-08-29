const Axios = require('axios');

let listOfPetroleumProducts;
let maxYear;
let minYear;

const calculateMax = arrayOfData => Math.max(...arrayOfData);

const calculateMin = arrayOfData => Math.min(...arrayOfData);

const calculateAverage = arrayOfData =>
  (arrayOfData.reduce((acc, cur) => acc + cur) / arrayOfData.length).toFixed(2);

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

const calculateReport = (data, years) => {
  const report = [];

  listOfPetroleumProducts.forEach(item => {
    const filteredByProduct = data.filter(
      product => product.petroleum_product === item
    );
    for (let currIndex = years.length - 1; currIndex > 0; currIndex -= 2) {
      const filteredByDate = filteredByProduct.filter(
        product =>
          product.year >= years[currIndex - 1] &&
          product.year <= years[currIndex]
      );
      const payload = {
        Product: item,
        Year: `${years[currIndex - 1]}-${years[currIndex]}`,
        Min: calculateMin(filteredByDate.map(product => product.sale)),
        Max: calculateMax(filteredByDate.map(product => product.sale)),
        Avg: calculateAverage(filteredByDate.map(product => product.sale)),
      };

      report.push(payload);
    }
  });

  console.log(report);
};

const getData = async () => {
  try {
    const res = await Axios.get(
      'https://raw.githubusercontent.com/younginnovations/internship-challenges/master/programming/petroleum-report/data.json'
    );

    const listOfYears = [...new Set(res.data.map(product => product.year))];
    maxYear = Math.max(...listOfYears);
    minYear = Math.min(...listOfYears);
    listOfPetroleumProducts = [
      ...new Set(res.data.map(product => product.petroleum_product)),
    ];

    const intervalOfYears = calculateInterval(5);

    calculateReport(res.data, intervalOfYears);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

getData();
