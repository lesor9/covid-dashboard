class Table {
  constructor(summary) {
    this.summary = summary;
    this.period = 'Total';
    this.valueType = 'absolute values';
  }

  setValueType(type) {
    this.valueType = type;
  }

  getAnotherPeriod() {
    if (this.period === 'Total') {
      return 'new day';
    }
    return 'total period';
  }

  setAnotherPeriod() {
    this.period = this.period === 'Total' ? 'New' : 'Total';
  }

  displayTable() {
    this.table = document.createElement('div');
    this.table.classList.add('table');
    this.renderTable();
    return this.table;
  }

  renderTable(countryData = this.summary) {
    const worldPopulation = 7827000000;
    const currentPeriod = this.period === 'Total' ? `${this.period.toLowerCase()} period` : `${this.period.toLowerCase()} day`;
    const countryName = countryData.Country ? countryData.Country : 'World';
    const population = countryData.population ? countryData.population : worldPopulation;
    let confirmed;
    let deaths;
    let recovered;
    if (this.valueType.includes('relative')) {
      confirmed = this.calculateRelativeData(countryData, population, 'Confirmed');
      deaths = this.calculateRelativeData(countryData, population, 'Deaths');
      recovered = this.calculateRelativeData(countryData, population, 'Recovered');
    }
    if (this.valueType.includes('absolute')) {
      confirmed = countryData[`${this.period}Confirmed`];
      deaths = countryData[`${this.period}Deaths`];
      recovered = countryData[`${this.period}Recovered`];
    }
    if (this.valueType.includes('percentage')) {
      confirmed = this.calculatePercentageData(countryData, population, 'Confirmed');
      deaths = this.calculatePercentageData(countryData, population, 'Deaths');
      recovered = this.calculatePercentageData(countryData, population, 'Recovered');
    }
    this.table.innerHTML = `<span>${countryName} statistic for ${currentPeriod} with ${this.valueType}</span>
      <span>Confirmed: ${confirmed}</span>
      <span>Deaths: ${deaths}</span>
      <span>Recovered: ${recovered}</span>`;
  }

  calculateRelativeData(countryData, population, status) {
    return Math.round((countryData[`${this.period}${status}`] * 100000) / population);
  }

  calculatePercentageData(countryData, population, status) {
    return ((countryData[`${this.period}${status}`] * 100) / population).toFixed(2);
  }
}

export default Table;
