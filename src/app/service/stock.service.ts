import { Injectable } from '@angular/core';
import { Asset } from '../models/assets';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor() {
   }

  public createAsset = (assetId, assetType) => {
    let asset : Asset = {
      id : assetId,
      assetName: assetType === 'Stock' ? ['AAPL','GOOGL','FB', 'TSLA', 'MSFT'][Math.floor(Math.random() * 4)] : ['EUR','USD','GBP', 'NIS', 'AUD'][Math.floor(Math.random() * 4)],
      price: Math.random()*10,
      lastUpdate: Date.now(),
      type: assetType
    };
    return asset; 
  };
  
  public getAllAssets = (n) => {
    const result = [];
    for (let i = 1; i < n + 1; i++) {
      result.push(this.createAsset(i, 'Stock'));
      result.push(this.createAsset(i+n, 'Currency'));
    }       
    return result;
  }

}
