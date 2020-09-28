import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { Asset } from './models/assets';
import { StockService } from './service/stock.service';
import { map } from 'rxjs/operators';

export interface Vegetable {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private gridApi;
  private gridColumnApi;
  private timeObservable = interval(1000);
  private dataSubscription;
  displayAssets: Asset[];
  columnDefs;
  paginationPageSize = 100;
  pageSizeList = [20, 50, 100];
  filterList;
  removable=true;
  multiSortKey='ctrl' 
  constructor(private dataService: StockService) {

  }

  ngOnInit(): void {
    this.dataSubscription = this.dataObs.subscribe();
    this.displayAssets = this.dataService.getAllAssets(200);
    this.columnDefs = [
      { field: 'id',  filter: 'agNumberColumnFilter', resizable: true, sortable: true},
      { field: 'assetName',  filter: true, sortable: true, resizable: true},
      { field: 'price',  filter: 'agNumberColumnFilter', resizable: true, sortable: true, sort: 'desc', valueFormatter: param => param.value.toFixed(6)},
      { field: 'lastUpdate', filter: 'agDateColumnFilter', resizable: true, sortable: true, valueFormatter: this.dateConversion},
      { field: 'type',  filter: true, sortable: true, resizable: true }
    ];
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  dateConversion(params) {
    let d = new Date(params.value);
    return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  }

  dataObs = new Observable(observer => {
    this.timeObservable.subscribe(() => {
      from(this.displayAssets).pipe(map(val => {
        const random = Math.random();
        val.price = random >= 0.5 ? val.price + random : val.price - random;
        val.lastUpdate = Date.now();
        return val;
      }))
        .subscribe(val => {
          this.gridApi.applyTransactionAsync({update: [val]})
        });
    });
  });

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit()
    this.gridApi.setRowData(this.displayAssets);
    this.gridApi.eventService.addEventListener('filterChanged', (e) => {
      this.filterList = [];
      let filters = e.api.getFilterModel();
      Object.keys(filters).forEach(key => {
          let filter = filters[key];
          filter["key"] = key; 
          this.filterList.push(filter);
      });
    })
  }

  clearFilter() {
    this.gridApi.setFilterModel(null);
  }

  clearSort(){
    this.gridApi.setSortModel(null);
  }

  onPageSizeChanged(size) {
    this.paginationPageSize = size;
    this.gridApi.paginationSetPageSize(this.paginationPageSize);
  }


  onAsset(value) {
    this.gridColumnApi.setColumnVisible('assetName', value);
    this.gridApi.sizeColumnsToFit()

  }

  onDate(value) {
    this.gridColumnApi.setColumnVisible('price', value);
    this.gridApi.sizeColumnsToFit()
  }

  onPrice(value) {
    this.gridColumnApi.setColumnVisible('lastUpdate', value);
    this.gridApi.sizeColumnsToFit()
  }

  onCurrency(value) {
    this.gridColumnApi.setColumnVisible('type', value);
    this.gridApi.sizeColumnsToFit()
  }

  getFilters(){
    this.filterList.push(Object.keys(this.gridApi.getFilterModel()));
  }

}