import { Route, Routes } from '@solidjs/router';
import Home from './pages/Home';
import Ticker from './pages/Ticker';

const App = () => {
    return (
        <div class="p-5 max-w-lg mx-auto">
            <Routes>
                <Route path="/" component={Home} />
                <Route path="/:name" component={Ticker} />
            </Routes>
        </div>
    );
};

export default App;
