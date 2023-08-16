export interface StockInfo {
    name: string;
    ticker: string;
    market?: string;
    value: number;
    currency?: string;
    change: string;
}

export interface TickerGraphOption {
    title: string; 
    from: Date; 
    selected: boolean;
}
