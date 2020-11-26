import React from 'react';
import { Main } from './components/Main';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configStore';

const store = ConfigureStore();

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

function App() {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
}

export default App;
