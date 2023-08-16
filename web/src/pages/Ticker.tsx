import { useParams } from "@solidjs/router";
import { Component, For, Match, ParentComponent, Show, Switch, createEffect, createResource, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import Section from "../components/Section";
import Navbar from "../components/Navbar";
import { numberToHumanReadable, subtractDate } from "../utils/utils";
import Loader from "../components/Loader";
import { Chart, Tooltip } from "chart.js";
import { Line } from "solid-chartjs";
import { TickerGraphOption } from "../types";

const fetchTickerData = async (name: string) => {
    const resp = await fetch(`http://localhost:8080/api/tickers/${name}`)
    return resp.json()
}

const Ticker = () => {
    const params = useParams()
    const [data] = createResource(
        () => params.name,
        () => fetchTickerData(params.name)
    )

    const address = () => {
        if(!data()) return "";
        let {address1, city, postal_code, state} = data().address
        city = city.at(0) + city.slice(1).toLowerCase()
        address1 = address1.split(' ').map((w: string) => w.at(0) + w.slice(1).toLowerCase()).join(' ')
        return [address1, city, postal_code, state].join(', ')
    }
    
    return (
        <>
            <Navbar showHome/>
            <Switch>
                <Match when={data.loading}>
                    <Loader />
                </Match>
                <Match when={data.error}>
                    <div class="text-center p-5">{data.error}</div>
                </Match>
                <Match when={data()}>
                    <Section header={data().name}>
                        <DescriptionBox>{data().description}</DescriptionBox>
                    </Section>
                    <Section header="Info">
                        <div class="flex flex-wrap gap-1 text-light-200">
                            <div>
                                {data().name}. 
                                {address()}. 
                                Employees: {numberToHumanReadable(data().total_employees)}.
                                Currency in {data().currency_name.toUpperCase()}.
                            </div>
                            <Show when={data().homepage_url}>
                                {(url) => (
                                    <a href={url()} target="_blank" class="text-accent-200 hover:text-accent-200 transition ease-in-out">{url()}</a>
                                )}
                            </Show>
                        </div>
                    </Section>
                    <Section header="Summary">
                        <div class="flex flex-wrap gap-1 text-light-200">
                            <Show when={data().market_cap}><SummaryItem name="Market Cap" value={data().market_cap}/></Show>
                            <SummaryItem name="Market Cap" value={data().market_cap}/>
                            <SummaryItem name="Market Cap" value={data().market_cap}/>
                            <SummaryItem name="Market Cap" value={data().market_cap}/>
                        </div>
                    </Section>
                    <Section header="Chart">
                        <StockChart ticker={params.name}/>
                    </Section>
                    {/* JSON.stringify(data()) */}
                </Match>
            </Switch>
        </>
    )
}

export default Ticker;

const DescriptionBox: ParentComponent = (props) => {
    const [showFull, setShowFull] = createSignal(false);
    const [height, setHeight] = createSignal('3rem');
    let contentRef: HTMLDivElement | undefined;

    const calculateHeight = () => {
        if(!contentRef) return;
        const fullHeight = `${contentRef.scrollHeight}px`;
        setHeight(showFull() ? fullHeight : '3rem');
    };

    createEffect(() => {
        calculateHeight();
    });

    window.addEventListener('resize', calculateHeight);
    onCleanup(() => {
        window.removeEventListener('resize', calculateHeight);
    });

    return (
        <div>
            <div 
                ref={contentRef}
                class={`text-light-200 text-sm transition-height duration-300 overflow-hidden relative ${showFull() ? "shadow-none" : "shadow-text"}`}
                style={`height: ${height()}`}
            >
                {props.children}
            </div>
            <button class="text-sm mt-2 text-accent-100 hover:text-accent-200 transition" onClick={() => setShowFull(p => !p)}>
                Show {showFull() ? "less" : "more"}
            </button>
        </div>
    )
}

interface SummaryItemProps {
    name: string;
    value: string | number;
}

const SummaryItem: Component<SummaryItemProps> = (props) => {
    const valueStr = () => {
        if(typeof props.value === "number")
            return numberToHumanReadable(props.value)
        return props.value
    }
    
    return (
        <div class="flex-1 whitespace-nowrap flex flex-row justify-between border p-2 gap-10 rounded-md border-dark-200 hover:border-dark-300 transition ease-in-out">
            <div>
                {props.name}
            </div>
            <div>
                {valueStr()}
            </div>
        </div>
    )
}


const fetchTickerHistoryData = async (name: string, from: Date) => {
    const url = new URL(`http://localhost:8080/api/tickers/${name}/history`)
    url.searchParams.append("from", from.toISOString().substring(0, 10))
    url.searchParams.append("to", new Date().toISOString().substring(0, 10))
    
    const resp = await fetch(url)
    return resp.json()
}

const StockChart: Component<{ticker: string}> = (props) => {
    onMount(() => {
        Chart.register(Tooltip)
    })
    
    const [options, setOptions] = createStore<TickerGraphOption[]>([
        { title: "1D", from: subtractDate(1), selected: false },
        { title: "5D", from: subtractDate(5), selected: false },
        { title: "1M", from: subtractDate(0, 1), selected: true },
    ]);

    const setSelected = (idx: number) => {
        setOptions({from:0, to: options.length-1}, 'selected', (_, i) => i[1] === idx)
    }
    
    const [history] = createResource(
        () => [...options],
        () => fetchTickerHistoryData(props.ticker, options.find(o => o.selected)!.from)
    )

    const labels = () => history() ? history().map((m: any) => new Date( m.t).toLocaleDateString()) : [];
    const values = () => history() ? history().map((m: any) => m.c) : [];

    const [chartData, setChartData] = createStore({
        lol: {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        }
    })

    createEffect(()=> {
        setChartData({
            lol: {
                labels: labels(), 
                datasets: [
                    {
                        data: values()
                    }
                ]
            }
        })
    })

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        borderColor: '#00C9A4',
    }

    return (
        <div class="flex flex-col">
            <div class="flex justify-between align-middle border-b border-dark-200">
                <p class="px-5 py-1 text-light-200">Range</p>    
                <div class="flex flex-row self-end idvide-x">
                    <For each={options}>
                        {(opt, i) => (
                            <button 
                                onClick={() => setSelected(i())} 
                                class={`px-5 py-1 transition ease-in-out ${opt.selected?"text-accent-200":"text-light-300"} hover:text-accent-200`}>
                                {opt.title}
                            </button>
                        )}
                    </For>
                </div>
            </div>
            <div>
                <Show when={history()}>
                    <Line data={chartData.lol} options={chartOptions} height={200} />
                </Show>
            </div>
        </div>
    )
}
