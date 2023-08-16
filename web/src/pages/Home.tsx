import { For, createSignal } from "solid-js";
import Section from "../components/Section";
import { StockInfo } from "../types";
import TickerBox from "../components/TickerBox";
import { A } from "@solidjs/router";
import Navbar from "../components/Navbar";

const Home = () => {
    const [recent, setRecent] = createSignal<StockInfo[]>([
        {name: "Apple Inc.", ticker: "AAPL", market: "NASDAQ: AAPL", value: 177.97, currency: "USD", change: "-0.22 (0.12%)"},
        {name: "Tesla Inc.", ticker: "TSLA", market: "NASDAQ: TSLA", value: 245.34, currency: "USD", change: "+3.15 (1.30%)"},
        {name: "Alphabet Inc.", ticker: "GOOG", market: "NASDAQ: GOOG", value: 130.17, currency: "USD", change: "-0.04 (-0.03%)"},
    ])
    
    return (
        <>
            <Navbar/>
            <Section header="Recent">
                <For each={recent()}>
                    {(ticker) => (
                        <A href={`/${ticker.ticker}`}>
                            <TickerBox item={ticker}/>
                        </A>
                    )}
                </For>
            </Section>
            <Section header="Popular">
                <For each={recent()}>
                    {(ticker) => (
                        <A href={`/${ticker.ticker}`}>
                            <TickerBox item={ticker}/>
                        </A>
                    )}
                </For>
            </Section>
        </>
    )
}

export default Home;
