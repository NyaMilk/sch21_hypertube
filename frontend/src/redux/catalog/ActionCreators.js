import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';


export const catalogClear = () => ({
    type: ActionTypes.CATALOG_CLEAR
});

export const initCatalog = () => (dispatch) => {
    dispatch(catalogClear());
};

export const catalogLoading = () => ({
    type: ActionTypes.CATALOG_LOADING
});

export const catalogFailed = (msg) => ({
    type: ActionTypes.CATALOG_FAILED,
    payload: msg
});

export const catalogSortAdd = (sort) => ({
    type: ActionTypes.CATALOG_SORT_ADD,
    sort: sort
});

export const setCatalogSort = (sort) => (dispatch) => {
    dispatch(catalogSortAdd(sort));
};

export const catalogFilterStatus = (status) => ({
    type: ActionTypes.CATALOG_FILTER_ADD,
    status: status
});

export const setCatalogFilterStatus = (status) => (dispatch) => {
    dispatch(catalogFilterStatus(status));
}

export const catalogRateFromAdd = (rateFrom) => ({
    type: ActionTypes.CATALOG_RATE_FROM_ADD,
    rateFrom: rateFrom
});

export const setRateFrom = (rateFrom) => (dispatch) => {
    dispatch(catalogRateFromAdd(rateFrom));
};

export const catalogRateToAdd = (rateTo) => ({
    type: ActionTypes.CATALOG_RATE_TO_ADD,
    rateTo: rateTo
});

export const setRateTo = (rateTo) => (dispatch) => {
    dispatch(catalogRateToAdd(rateTo));
};

export const catalogYearFromAdd = (yearFrom) => ({
    type: ActionTypes.CATALOG_YEAR_FROM_ADD,
    yearFrom: yearFrom
});

export const setYearFrom = (yearFrom) => (dispatch) => {
    dispatch(catalogYearFromAdd(yearFrom));
};

export const catalogYearToAdd = (yearTo) => ({
    type: ActionTypes.CATALOG_YEAR_TO_ADD,
    yearTo: yearTo
});

export const setYearTo = (yearTo) => (dispatch) => {
    dispatch(catalogYearToAdd(yearTo));
};

export const catalogGenresAdd = (genres) => ({
    type: ActionTypes.CATALOG_GENRES_ADD,
    genres: genres
});

export const setGenres = (genres) => (dispatch) => {
    dispatch(catalogGenresAdd(genres));
};

export const catalogSearchAdd = (search) => ({
    type: ActionTypes.CATALOG_SEARCH_ADD,
    search: search
});

export const setSearch = (search) => (dispatch) => {
    dispatch(catalogSearchAdd(search));
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

    console.log('data', data);
    return request('/api/movies/catalog/count', data, 'POST')
        .then(response => response.json())
        .then(result => dispatch(countCardAdd(result)))
        .catch(error => dispatch(catalogFailed(error.message)));
};
