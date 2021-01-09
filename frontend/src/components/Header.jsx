import React, { useEffect } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logOut, setUser, setUserFailed } from '../redux/login/ActionCreators';
import { getNotifications, addNotification, setNew } from '../redux/notification/ActionCreators';
import { setQuality } from '../redux/movie/ActionCreators';
import { useTranslation } from "react-i18next";
import { request } from '../util/http';
import { socket } from '../util/socket';

const video = '/img/head-video.svg';
const user = '/img/head-user.svg';
const logout = '/img/head-logout.svg';
const bell = '/img/bell.svg';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        notification: state.notification
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
    setUser: (username) => dispatch(setUser(username)),
    setUserFailed: (msg) => dispatch(setUserFailed(msg)),
    getNotifications: (me, lang) => dispatch(getNotifications(me, lang)),
    addNotification: (me, imdb, quality) => dispatch(addNotification(me, imdb, quality)),
    setQuality: (quality) => dispatch(setQuality(quality)),
    setNew: (status) => dispatch(setNew(status))
});

const NotificationList = (props) => {
    const { notifications, setQuality } = props;
    let listItems;

    if (notifications.length > 0) {
        listItems = notifications.map((notification, item) => {
            const { imdb, title, quality } = notification;

            return (
                <DropdownItem key={item} className="notification-item">
                    <a href={`/movie/${imdb}`} onClick={() => setQuality(quality)}>
                        <span>{title} ({quality}) {props.t("inputMsg.download")}</span>
                    </a>
                    {/* <div>{notificaiton.message}</div> */}
                    {/* <div>{moment(notificaiton.time).fromNow()}</div> */}
                </DropdownItem>
            );
        });

        return (
            <label>{listItems}</label>
        );
    }
    return (
        <DropdownItem>
            {props.t("inputMsg.nothing")}
        </DropdownItem>
    );
}

const Notification = (props) => {
    const { hasNew, getNotifications, setNew, setQuality, notifications, t } = props;

    const handleClick = () => {
        getNotifications(props.me, props.lang);
        setNew(false);
    }

    return (
        <UncontrolledButtonDropdown>
            <DropdownToggle color="none" onClick={handleClick}>
                {
                    (hasNew)
                        ? <span className="notification" />
                        : ''
                }
                <img src={bell} width="23" height="23" alt="bell" />
            </DropdownToggle>
            <DropdownMenu modifiers={{
                setMaxHeight: {
                    enabled: true,
                    order: 890,
                    fn: (data) => {
                        return {
                            ...data,
                            styles: {
                                ...data.styles,
                                overflow: 'auto',
                                maxHeight: '350px',
                                maxWidth: '300px',
                            },
                        };
                    },
                },
            }}>
                <NotificationList
                    notifications={notifications}
                    t={t}
                    setQuality={setQuality}
                />
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
}


const Header = (props) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const { me, isLogged } = props.login;
    const { hasNew, notifications } = props.notification;
    const path = props.location.pathname;
    const history = useHistory();
    const { getNotifications, addNotification, setNew, setQuality, logOut, setUser } = props;

    useEffect(() => {
        request(`/api/auth/success`)
            .then(res => res.json())
            .then(data => {
                (data.success) ? (setUser(data.user)) : setUserFailed(data.message);
            })
            .catch((e) => setUserFailed(e.message))
    }, [path, setUser])

    useEffect(() => {
        if (isLogged) {
            socket.on('notification', (data) => {
                if (data[1].indexOf(me) > -1) {
                    const tmp = data[0].split('_');
                    addNotification(me, tmp[0], tmp[1]);
                    setNew(true);
                }
            });

            return () => socket.off('notification');
        }

        if (!isLogged && !path.includes('/register') && !path.includes('/remind'))
            history.push('/login');
    }, [isLogged, history, me, path, setNew, addNotification]);


    return (
        <header className="header">
            <Container>
                <Navbar color="light" light expand="xs">
                    <NavbarBrand href="/catalog/page/1">Hypertube</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <Navbar>
                            {
                                isLogged &&
                                <NavItem>
                                    <NavLink href="/catalog/page/1">
                                        <img src={video} width="25" height="25" alt="Films" />
                                    </NavLink>
                                </NavItem>
                            }
                            {
                                isLogged &&
                                <NavItem>
                                    <NavLink href={`/profile/${me}`}>
                                        <img src={user} width="25" height="25" alt="Profile" />
                                    </NavLink>
                                </NavItem>
                            }
                            {
                                isLogged &&
                                <NavItem>
                                    <Notification
                                        t={t}
                                        me={me}
                                        notifications={notifications}
                                        hasNew={hasNew}
                                        setNew={setNew}
                                        getNotifications={getNotifications}
                                        addNotification={addNotification}
                                        lang={i18n.language}
                                        setQuality={setQuality}
                                    />
                                </NavItem>
                            }
                            {
                                isLogged &&
                                <NavItem>
                                    <NavLink href='/login' onClick={() => { logOut(); }}>
                                        <img src={logout} width="25" height="25" alt="Logout" />
                                    </NavLink>
                                </NavItem>
                            }
                            <NavItem>
                                <button
                                    onClick={() => changeLanguage("en")}
                                    className={`btn-fst btn-lng ${i18n.language === 'en' ? 'active-lng' : ''}`}>
                                    Eng
                                </button>
                            </NavItem>
                            <NavItem>
                                <button
                                    onClick={() => changeLanguage("ru")}
                                    className={`btn-lng ${i18n.language === 'ru' ? 'active-lng' : ''}`}>
                                    Рус
                                </button>
                            </NavItem>
                        </Navbar>
                    </Nav>
                </Navbar>
            </Container>
        </header>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
