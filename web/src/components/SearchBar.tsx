import { useNavigate } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";

const SearchBar = () => {
    const [text, setText] = createSignal('')
    const [results, setResults] = createSignal<string[]>([])
    const textUpper = () => text().toUpperCase()

    const nav = useNavigate()

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        if(!isValidTicker(text())) return;
        nav(`/${textUpper()}`, {replace: true})
    }

    const isValidTicker = (ticker: string) => {
        if(ticker.length > 5 || ticker.length < 1) return false
        return true
    }
    
    return (
        <>
            <form class="flex-1 flex p-3 border border-dark-200 rounded-full focus-within:border-dark-300 hover:border-dark-300 transition ease-in-out" onSubmit={handleSubmit}>
                <button class="icon">
                    <svg class="h-5 fill-accent-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                </button>
                <input class="flex-1 text-lg bg-transparent outline-none mx-3" type="text" value={text()} onChange={e => setText(e.target.value)} placeholder="AAPL"/>
                <button type="button" class="icon" onClick={() => setText("")}>
                    <svg class="h-5 fill-light-100" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </button>
            </form>
            <Show when={results().length}>
                <div class="search-results">
                    <For each={results()}>{(res, i) => 
                        <li class="search-result">{res}</li>
                    }</For>
                </div>
            </Show>
        </>
    )
}

export default SearchBar;
