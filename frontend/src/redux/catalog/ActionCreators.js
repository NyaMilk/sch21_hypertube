import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';
import CONFIG from '../../util/const';

export const initCatalog = () => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_CLEAR
    }));
};

export const catalogLoading = () => ({
    type: ActionTypes.CATALOG_LOADING
});

export const catalogFailed = (msg) => ({
    type: ActionTypes.CATALOG_FAILED,
    payload: msg
});

export const setCatalogSort = (sort) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.CATALOG_SORT_ADD,
        sort: sort
    }));
};

export const setCatalogFilterStatus = (status) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_FILTER_ADD,
        status: status
    }));
}

export const setRateFrom = (rateFrom) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_RATE_FROM_ADD,
        rateFrom: rateFrom
    }));
};

export const setRateTo = (rateTo) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_RATE_TO_ADD,
        rateTo: rateTo
    }));
};

export const setYearFrom = (yearFrom) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_YEAR_FROM_ADD,
        yearFrom: yearFrom
    }));
};

export const setYearTo = (yearTo) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_YEAR_TO_ADD,
        yearTo: yearTo
    }));
};

export const setGenres = (genres) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_GENRES_ADD,
        genres: genres
    }));
};

export const setSearch = (search) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_SEARCH_ADD,
        search: search
    }));
};

export const addRuGenres = (genres) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_RU_ALL_GENRES_ADD,
        genres: genres
    }))
};

export const addEnGenres = (genres) => (dispatch) => {
    dispatch(({
        type: ActionTypes.CATALOG_EN_ALL_GENRES_ADD,
        genres: genres
    }))
};

export const catalogCardAdd = (info) => ({
    type: ActionTypes.CATALOG_CARD_ADD,
    payload: info.result
});

export const fetchCatalogCard = (data) => (dispatch) => {
    dispatch(catalogLoading());
    dispatch(setCatalogFilterStatus(null));

    return request('/api/movies/catalog/page', data, 'POST')
        .then(response => response.json())
        .then(result => dispatch(catalogCardAdd(result)))
        .catch(error => dispatch(catalogFailed(error.message)));
};

export const countCardAdd = (count) => ({
    type: ActionTypes.COUNT_CARD_ADD,
    payload: count.result
});

export const fetchAllCatalog = (data) => (dispatch) => {
    // dispatch(catalogLoading());

    return request('/api/movies/catalog/count', data, 'POST')
        .then(response => response.json())
        .then(result => dispatch(countCardAdd(result)))
        .catch(error => dispatch(catalogFailed('geg1' + error.message)));
};

export const fetchEnAllGenres = () => async (dispatch) => {

    return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${CONFIG.API_TMDB_KEY}&language=en-US`)
        .then(response => response.json())
        .then(result => {
            const formatted = result.genres.map((item) => {
                return item.name;
            })
            dispatch(addEnGenres(formatted));
        })
        .catch(error => dispatch(catalogFailed(error.message)))
};

export const fetchRuAllGenres = (data) => async (dispatch) => {
    // dispatch(catalogLoading());

    return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${CONFIG.API_TMDB_KEY}&language=ru-RU`)
        .then(response => response.json())
        .then(result => {
            const formatted = result.genres.map((item) => {
                return item.name;
            })
            dispatch(addRuGenres(formatted));
        })
        .catch(error => dispatch(catalogFailed('geg' + error.message)))
};
