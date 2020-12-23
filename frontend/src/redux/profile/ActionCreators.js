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

export const viewsLoading = () => ({
    type: ActionTypes.VIEWS_LOADING
});

export const viewsAdd = (info) => ({
    type: ActionTypes.VIEWS_ADD,
    payload: info.result
});

export const viewsFailed = (msg) => ({
    type: ActionTypes.VIEWS_FAILED,
    payload: msg
});

export const fetchViews = (nickname) => (dispatch) => {
    dispatch(viewsLoading());

    return request(`${CONFIG.API_URL}/api/user/profile/favorites/movies/${nickname}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(viewsAdd(result))
        })
        .catch(error => dispatch(viewsFailed(error.message)));
}
;
export const commentsLoading = () => ({
    type: ActionTypes.COMMENTS_LOADING
});

export const commentsAdd = (info) => ({
    type: ActionTypes.COMMENTS_ADD,
    payload: info.result
});

export const commentsFailed = (msg) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: msg
});

export const fetchComments = (nickname) => (dispatch) => {
    dispatch(commentsLoading());

    return request(`${CONFIG.API_URL}/api/user/profile/get_comments/comments/${nickname}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(commentsAdd(result))
        })
        .catch(error => dispatch(commentsFailed(error.message)));
};
