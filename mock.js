import {Observable} from 'rxjs/Observable';
import Rx from 'rxjs/Rx';

const createAsset = (assetId, assetType) => {
  return {
    id: assetId,
    assetName: assetType === 'Stock' ? ['AAPL','GOOGL','FB', 'TSLA', 'MSFT'][Math.floor(Math.random() * 4)] : ['EUR','USD','GBP', 'NIS', 'AUD'][Math.floor(Math.random() * 4)],
    price: Math.random()*10,
    lastUpdate: Date.now(),
    type: assetType
  }
};

const getAllAssets = (n) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(createAsset(i, 'Stock'));
    result.push(createAsset(i+n, 'Currency'));
  }
  return result;
}

const assets = getAllAssets(200);

const timeObservable = Rx.Observable.interval(1000);
export const mock = Observable.create((ob) => {
	timeObservable.subscribe(() => {
	  Rx.Observable.from(assets)
		.map(val => {
		  const random = Math.random();
		  val.price = random >= 0.5 ? val.price + random : val.price - random;
		  val.lastUpdate = Date.now();
		  return val;
		})
		.subscribe(val => ob.next(val));
	});
	return () => null; // we don't care about unsubscribe just for a test
});