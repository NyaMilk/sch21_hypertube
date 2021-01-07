import React, { useEffect, useState } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logOut, setUser, setUserFailed } from '../redux/login/ActionCreators';
import { useTranslation } from "react-i18next";
import { request } from '../util/http';
import { socket } from '../util/socket';
import CONFIG from '../util/const';

const video = '/img/head-video.svg';
const user = '/img/head-user.svg';
const logout = '/img/head-logout.svg';

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
    setUser: (username) => dispatch(setUser(username)),
    setUserFailed: (msg) => dispatch(setUserFailed(msg))
});

const Notification = (props) => {
    const { hasNew } = props;

    const handleClick = () => {
        // props.updateNotifications(me);
        props.set(false);
    }

    return (
        <UncontrolledButtonDropdown>
            <DropdownToggle color="none" onClick={handleClick}>
                {
                    (hasNew)
                        ? <span className="notification" />
                        : ''
                }
                <i className="icon fa fa-bell"></i>
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
                <DropdownItem>
                    Nothing
        </DropdownItem>
                {/* <NotificationList notifications={notifications} /> */}
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
}


const Header = (props) => {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const isLogged = props.login.isLogged;
    const path = props.location.pathname;
    const history = useHistory();
    const { me } = props.login;
    // const { setUser, setUserFailed } = props;
    const [hasNew, setHasNew] = useState(false);

    useEffect(() => {
        request(`${CONFIG.API_URL}/api/auth/success`)
            .then(res => res.json())
            .then(data => (data.user) ? setUser(data.user) : setUserFailed(data.message))
            .catch((e) => setUserFailed(e.message))
    }, [])

    useEffect(() => {
        if (isLogged) {

            socket.on('notification', (data) => {

                if (!data[1].indexOf(me)) {
                    alert('Downloaded');
                    setHasNew(true);
                }
            });

            return () => {
                socket.off('notification');
            };
        }

        if (!isLogged && !path.includes('/register') && !path.includes('/remind'))
            history.push('/login');
    }, [isLogged, history, me, path]);


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
                                    <NavLink href={`/profile/${props.login.me}`}>
                                        <img src={user} width="25" height="25" alt="Profile" />
                                    </NavLink>
                                </NavItem>
                            }
                            {
                                isLogged &&
                                <NavItem>
                                    <NavLink href='/login' onClick={() => { props.logOut(); }}>
                                        <img src={logout} width="25" height="25" alt="Logout" />
                                    </NavLink>
                                </NavItem>
                            }
                            {
                                isLogged &&
                                <NavItem>
                                    <Notification
                                        // me={me}
                                        // notifications={props.notification.notifications}
                                        hasNew={hasNew}
                                        // updateNotifications={props.updateNotifications}
                                        set={setHasNew} />
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
