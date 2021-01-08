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

    const data = {
        me: me,
        lang: lang
    };

    return request(`/api/user/notifications`, data, 'POST')
        .then(res => res.json())
        .then(result => {
            if (result.success === true) {
                dispatch(notificationsAdd(result.data));
            }
            else {
                dispatch(notificationsFailed(result.message));
            }
        })
        .catch(error => dispatch(notificationsFailed(error.message)));
}
