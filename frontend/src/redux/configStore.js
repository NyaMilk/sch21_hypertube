import { createStore, combineReducers, applyMiddleware } from 'redux';
import { LoginReducer } from './login/login.reducer';
import { RegisterReducer } from './register/register.reducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            login: LoginReducer,
            register: RegisterReducer
        }),
        persistedState,
        applyMiddleware(thunk, logger)
    );

    return store;
}
