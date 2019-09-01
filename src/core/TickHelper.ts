import * as PIXI from 'pixi.js';

export default class TickHelper {

    private static tickers = [];

    public static add(fn: (dt: number) => void) {
        PIXI.Ticker.shared.add(this.createTickWrapper(fn));
    }

    public static nextTick(fn: (dt: number) => void) {
        PIXI.Ticker.shared.addOnce(this.createTickWrapper(fn));
    }

    public static remove(fn: (dt: number) => void) {
        PIXI.Ticker.shared.remove(TickHelper.tickers.find(x => x.original === fn).ticker);
    }

    private static createTickWrapper(fn: (dt: number) => void) {
        let ticker = () => {
            fn(PIXI.Ticker.shared.elapsedMS / 1000);
        };

        TickHelper.tickers.push({
            original: fn,
            ticker: ticker
        });

        return ticker;
    }
}