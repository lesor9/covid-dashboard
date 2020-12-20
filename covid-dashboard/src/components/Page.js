import ApiCall from './ApiCall';
import Table from './Table';
import List from './List';
import Graph from './Graph';
import Map from './Map';

class Page {
  constructor() {
    this.displayPage();
    this.apiData = new ApiCall();
  }

  displayPage() {
    const fragment = document.createDocumentFragment();

    this.listComponent = document.createElement('div');
    this.search = document.createElement('input');
    const main = document.createElement('div');
    this.mapComponent = document.createElement('div');
    const tableAndChart = document.createElement('div');
    this.tableComponent = document.createElement('div');
    this.periodButton = document.createElement('button');
    this.valueTypeElement = document.createElement('select');
    this.chartComponent = document.createElement('div');

    this.listComponent.classList.add('list-component');
    this.search.classList.add('search');
    this.search.placeholder = 'search';
    main.classList.add('main');
    this.mapComponent.classList.add('map-component');
    tableAndChart.classList.add('table-and-chart');
    this.tableComponent.classList.add('table-component');
    this.periodButton.classList.add('period-button');
    this.valueTypeElement.classList.add('value-type');
    this.chartComponent.classList.add('chart-component');

    fragment.appendChild(this.listComponent);
    this.listComponent.appendChild(this.search);
    fragment.appendChild(main);
    main.appendChild(this.mapComponent);
    main.appendChild(tableAndChart);
    this.tableComponent.append(this.periodButton);
    this.tableComponent.append(this.valueTypeElement);
    tableAndChart.appendChild(this.tableComponent);
    tableAndChart.appendChild(this.chartComponent);
    document.body.appendChild(fragment);
  }

  async waitForApi() {
    await this.apiData.getPopulation();
    await this.apiData.requestSummary();

    this.countriesList = new List(this.apiData.map);
    const list = this.countriesList.displayList();
    list.addEventListener('click', this.clickHandler.bind(this));
    this.search.addEventListener('input', this.inputHandler.bind(this));
    this.listComponent.appendChild(list);

    this.tableData = new Table(this.apiData.summaryData.Global);
    this.periodButton.textContent = this.tableData.getAnotherPeriod();
    this.periodButton.addEventListener('click', this.clickPeriodBtn.bind(this));
    const valueArray = ['absolute values', 'relative values, per 100000', 'percentage values, %'];
    valueArray.forEach((item) => {
      const el = document.createElement('option');
      el.value = item;
      el.textContent = item;
      if (item.includes('absolute')) {
        el.selected = true;
      }
      this.valueTypeElement.append(el);
    });
    this.valueTypeElement.addEventListener('click', this.clickTypeValueOption.bind(this));
    this.tableComponent.appendChild(this.tableData.displayTable());

    await this.apiData.requestWorldData();

    this.chartData = new Graph(this.apiData.worldData);
    this.chartComponent.appendChild(this.chartData.displayChart());

    this.awesomeMap = new Map();
  }

  async clickHandler(event) {
    if (event.target !== event.currentTarget) {
      this.countryCode = event.target.closest('li').getAttribute('data-country');
      this.tableData.renderTable(this.apiData.map.get(this.countryCode));
      if (!this.apiData[`${this.countryCode}chart`]) {
        await this.apiData.requestCountryTimeline(this.countryCode);
      }
      const status = 'cases';
      this.chartData.renderChart(this.apiData[`${this.countryCode}chart`], status);
    }
  }

  inputHandler() {
    const look = this.search.value.toLowerCase();
    [...this.countriesList.list.children].forEach((item) => {
      if (!item.getAttribute('data-search').includes(look)) {
        item.classList.add('hide');
      } else {
        item.classList.remove('hide');
      }
    });
  }

  clickPeriodBtn() {
    this.tableData.setAnotherPeriod();
    this.periodButton.textContent = this.tableData.getAnotherPeriod();
    this.tableData.renderTable(this.apiData.map.get(this.countryCode));
  }

  clickTypeValueOption(e) {
    if (e.target.value !== this.tableData.valueType) {
      this.tableData.setValueType(e.target.value);
      this.tableData.renderTable(this.apiData.map.get(this.countryCode));
    }
  }
}

export default Page;
