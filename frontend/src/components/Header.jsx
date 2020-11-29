import React from "react";
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import video from '../img/head-video.svg';
import user from '../img/profile-user.svg';
import logout from '../img/logout2.svg';


import { useTranslation } from "react-i18next";

function Header() {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    return (
        <Navbar color="light" light expand="xs">
            <Container>
                <NavbarBrand>Hypertube</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <img src={video} width="25" height="25" alt="Films" />
                    <img src={user} width="25" height="25" alt="Profile" />
                    <img src={logout} width="23" height="23" alt="Logout" />

                    <button
                        onClick={() => changeLanguage("en")}
                        className={`btn-fst btn-lng ${i18n.language === 'en' ? 'active-lng' : ''}`}>
                        Eng
                    </button>
                    <button
                        onClick={() => changeLanguage("ru")}
                        className={`btn-lng ${i18n.language === 'ru' ? 'active-lng' : ''}`}>
                        Рус
                    </button>
                    {/* {!urls.includes(path) &&
                        <NavItem>
                            <Notification
                                me={me}
                                notifications={props.notification.notifications}
                                hasNew={props.notification.hasNew}
                                updateNotifications={props.updateNotifications}
                                set={props.setHasNew} />
                        </NavItem>
                    }
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

export default Header;