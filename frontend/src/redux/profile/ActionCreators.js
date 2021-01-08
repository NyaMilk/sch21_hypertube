import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';
import CONFIG from '../../util/const';

export const profileLoading = () => ({
    type: ActionTypes.PROFILE_LOADING
});

export const profileAdd = (info) => ({
    type: ActionTypes.PROFILE_ADD,
    payload: info.result
});

export const profileFailed = (msg) => ({
    type: ActionTypes.PROFILE_FAILED,
    payload: msg
});

export const fetchProfile = (you, me) => (dispatch) => {
    dispatch(profileLoading());

    return request(`${CONFIG.API_URL}/api/user/profile/${you}/${me}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(profileAdd(result))
        })
        .catch(error => dispatch(profileFailed(error.message)));
};

export const viewsAdd = (info) => ({
    type: ActionTypes.VIEWS_ADD,
    payload: info.result
});

export const viewsFailed = (msg) => ({
    type: ActionTypes.VIEWS_FAILED,
    payload: msg
});

export const fetchViews = (nickname) => (dispatch) => {
    return request(`${CONFIG.API_URL}/api/user/movies/${nickname}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(viewsAdd(result))
        })
        .catch(error => dispatch(viewsFailed(error.message)));
};

export const commentsAdd = (info) => ({
    type: ActionTypes.COMMENTS_ADD,
    payload: info.result
});

export const commentsFailed = (msg) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: msg
});

export const fetchComments = (username) => (dispatch) => {
    return request(`${CONFIG.API_URL}/api/user/comments/${username}`)
        .then(response => response.json())
        .then(result => {
            dispatch(commentsAdd(result))
        })
        .catch(error => dispatch(commentsFailed(error.message)));
};

export const friendsAdd = (info) => ({
    type: ActionTypes.FRIENDS_ADD,
    payload: info.result
});

export const friendsFailed = (msg) => ({
    type: ActionTypes.FRIENDS_FAILED,
    payload: msg
});

export const fetchFriends = (username) => (dispatch) => {
    return request(`${CONFIG.API_URL}/api/user/friends/${username}`)
        .then(response => response.json())
        .then(result => {
            dispatch(friendsAdd(result))
        })
        .catch(error => dispatch(friendsFailed(error.message)));
};