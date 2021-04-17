import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';

export const notificationsLoading = () => ({
    type: ActionTypes.NOTIFICATIONS_LOADING
});

export const notificationsAdd = (data) => ({
    type: ActionTypes.NOTIFICATIONS_ADD,
    payload: data
});

export const notificationsFailed = (msg) => ({
    type: ActionTypes.NOTIFICATIONS_FAILED,
    payload: msg
});

export const setNew = (data) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.NOTIFICATIONS_NEW,
        status: data
    }));
};

export const getNotifications = (me, lang) => (dispatch) => {
    dispatch(notificationsLoading());

    return request(`/api/user/notifications/${me}/${lang}`)
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                dispatch(notificationsAdd(result.data));
            }
            else {
                dispatch(notificationsFailed(result.message));
            }
        })
        .catch(error => dispatch(notificationsFailed(error.message)));
}

export const addNotification = (me, imdb, quality) => (dispatch) => {
    dispatch(notificationsLoading());

    return request(`/api/user/notification/${me}/${imdb}/${quality}`, [], 'POST')
        .then(res => res.json())
        .then(result => {
            if (!result.success) {
                dispatch(notificationsFailed(result.message));
            }
        })
        .catch(error => dispatch(notificationsFailed(error.message)));
}