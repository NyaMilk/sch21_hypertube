import React, { useEffect } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { logOut, setUser, setUserFailed } from '../redux/login/ActionCreators';
import { useTranslation } from "react-i18next";
import { request } from '../util/http';
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

const Header = (props) => {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const isLogged = props.login.isLogged;
    const path = props.location.pathname;
    const history = useHistory();
    const { setUser, setUserFailed } = props;

    useEffect(() => {
        if (!isLogged && !path.includes('/register') && !path.includes('/remind'))
            history.push('/login');
    }, [isLogged, history]);

    useEffect(() => {
        request(`${CONFIG.API_URL}/api/auth/success`)
            .then(res => res.json())
            .then(data => (data.user) ? setUser(data.user) : setUserFailed(data.message))
            .catch((e) => setUserFailed(e.message))
    }, [request, setUser, setUserFailed])

    return (
        <header className="header">
            <Container>
                <Navbar color="light" light expand="xs">
                    <NavbarBrand href="/catalog">Hypertube</NavbarBrand>
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
