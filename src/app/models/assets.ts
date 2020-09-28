export interface Asset {
    id: number;
    assetName: string;
    price: number;
    lastUpdate: number;
    type: "Currency" | "Stock";
}