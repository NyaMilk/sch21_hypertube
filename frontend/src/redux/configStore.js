import { createStore, combineReducers, applyMiddleware } from 'redux';
import { LoginReducer } from './login/login.reducer';
import { RegisterReducer } from './register/register.reducer';
import { CatalogReducer } from './catalog/catalog.reducer';
import { ProfileReducer } from './profile/profile.reducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            login: LoginReducer,
            register: RegisterReducer,
            catalog: CatalogReducer,
            profile: ProfileReducer
        }),
        persistedState,
        applyMiddleware(thunk, logger)
    );

    return store;
}
