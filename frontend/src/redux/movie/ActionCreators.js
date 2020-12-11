import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';

export const initMovie = () => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.MOVIE_CLEAR
    }));
};

export const movieLoading = () => ({
    type: ActionTypes.MOVIE_LOADING
});

export const movieFailed = (msg) => ({
    type: ActionTypes.MOVIE_FAILED,
    payload: msg
});

export const movieAdd = (data) => ({
    type: ActionTypes.MOVIE_ADD,
    payload: data
});

export const fetchMovie = (imdb) => (dispatch) => {
    dispatch(movieLoading());

    return request(`/api/movies/movie/${imdb}`)
        .then(response => response.json())
        .then(result => {
            if (result.success)
                dispatch(movieAdd(result.data))
            else
                dispatch(movieFailed(result.message))
        })
        .catch(error => dispatch(movieFailed(error.message)));
};

export const favoriteAdd = (data) => ({
    type: ActionTypes.FAVORITE_ADD,
    payload: data.result
});

export const favoriteFailed = (msg) => ({
    type: ActionTypes.FAVORITE_FAILED,
    payload: msg
});

export const fetchStatus = (me, film) => (dispatch) => {
    dispatch(movieLoading());

    const data = {
        me: me,
        film: film
    }

    return request('/api/movies/movie/favorite', data, 'POST')
        .then(response => response.json())
        .then(result => dispatch(favoriteAdd(result)))
        .catch(error => dispatch(favoriteFailed(error.message)));
};