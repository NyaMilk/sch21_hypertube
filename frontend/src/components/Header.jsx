import React, { useEffect } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { logOut } from '../redux/login/ActionCreators';
import { useTranslation } from "react-i18next";

const video = '/img/head-video.svg';
const user = '/img/head-user.svg';
const logout = '/img/head-logout.svg';

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut())
});

const Header = (props) => {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const isLogged = props.login.isLogged;
    const path = props.location.pathname;
    const history = useHistory();

    useEffect(() => {
        if (!isLogged && !path.includes('/register') && !path.includes('/remind'))
            history.push('/login');
    }, [isLogged]);

    return (
        <Navbar color="light" light expand="xs">
            <Container>
                <NavbarBrand href="/catalog">Hypertube</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    {/* <img src={video} width="25" height="25" alt="Films" />
                    <img src={user} width="25" height="25" alt="Profile" />
                    <img src={logout} width="23" height="23" alt="Logout" /> */}

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
                    {/* 
                    {!urls.includes(path) &&
                        <NavItem>
                            <NavLink href="/chats">
                                <i className="fa fa-comments"></i>
                            </NavLink>
                        </NavItem>
                    }
                    {(!urls.includes(path) || path !== '/edit') && path.includes('/users/page') &&
                        <NavItem>
                            <NavLink href={`/users/${props.login.me.nickname}`}>
                                <i className="fa fa-user"></i>
                            </NavLink>
                        </NavItem>
                    }
                    {(!urls.includes(path) || path === '/edit') && !path.includes('/users/page') &&
                        <NavItem>
                            <NavLink href="/users/page/1">
                                <i className="fa fa-users"></i>
                            </NavLink>
                        </NavItem>
                    }
                    {!urls.includes(path) &&
                        <NavItem>
                            <NavLink href='/login' onClick={() => {
                                props.clearFilter();
                                props.clearChat();
                                props.clearNotification();
                                props.logOut();
                            }}>
                                {name}
                            </NavLink>
                        </NavItem>
                    } */}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
