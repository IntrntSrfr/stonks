import { Component } from "solid-js";
import { StockInfo } from "../types";

interface Props {
    item: StockInfo
}

const TickerBox: Component<Props> = (props) => {
    const {name,market,value,currency,change} = props.item;
    return (
        <div class="flex flex-row justify-between border p-2 gap-10 rounded-md border-dark-200 cursor-pointer hover:border-dark-300 transition ease-in-out">
            <div class="flex flex-col truncate">
                <div class="truncate">{name}</div>
                {market &&
                    <div class="text-xs text-light-200">{market}</div>
                }
            </div>
            <div class="flex flex-col items-end shrink-0">
                <div>{value} <span class="text-light-200">{currency}</span></div>
                <div class={`text-xs ${change.startsWith('-') ? "text-accent-2-100" : "text-accent-100"}`}>{change}</div>
            </div>
        </div>
    )
}

export default TickerBox
