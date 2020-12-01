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

export const fetchProfile = (nickname) => (dispatch) => {
    dispatch(profileLoading());

    return request(`${CONFIG.API_URL}/api/user/profile/${nickname}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(profileAdd(result))
        })
        .catch(error => dispatch(profileFailed(error.message)));
};
