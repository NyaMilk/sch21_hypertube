import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    sort: 'yearAsc',
    filterStatus: null,
    rateFrom: 0,
    rateTo: 10,
    yearFrom: 1900,
    yearTo: 2020,
    genres: [],
    search: "",
    cardCount: null,
    info: {}
}

export const CatalogReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.CATALOG_CLEAR:
            const tmp = { ...state };
            return { ...initialState, ruAllGenres: tmp.ruAllGenres, enAllGenres: tmp.enAllGenres };

        case ActionTypes.CATALOG_LOADING:
            return { ...state, isLoading: true, infoMsg: null };

        case ActionTypes.CATALOG_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload };

        case ActionTypes.CATALOG_SORT_ADD:
            return { ...state, isLoading: false, sort: action.sort };

        case ActionTypes.CATALOG_FILTER_ADD:
            return { ...state, isLoading: false, filterStatus: action.status };

        case ActionTypes.CATALOG_RATE_FROM_ADD:
            return { ...state, isLoading: false, rateFrom: action.rateFrom };

        case ActionTypes.CATALOG_RATE_TO_ADD:
            return { ...state, isLoading: false, rateTo: action.rateTo };

        case ActionTypes.CATALOG_YEAR_FROM_ADD:
            return { ...state, isLoading: false, yearFrom: action.yearFrom };

        case ActionTypes.CATALOG_YEAR_TO_ADD:
            return { ...state, isLoading: false, yearTo: action.yearTo };

        case ActionTypes.CATALOG_GENRES_ADD:
            return { ...state, isLoading: false, genres: action.genres };

        case ActionTypes.CATALOG_SEARCH_ADD:
            return { ...state, isLoading: false, search: action.search };

        case ActionTypes.CATALOG_CARD_ADD:
            return { ...state, isLoading: false, infoMsg: null, info: action.payload };

        case ActionTypes.COUNT_CARD_ADD:
            return { ...state, isLoading: false, infoMsg: null, cardCount: action.payload };

        default:
            return state;
    }
}