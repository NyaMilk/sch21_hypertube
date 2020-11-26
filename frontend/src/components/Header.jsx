import React from "react";
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

function Header() {
    return (
        <Navbar color="light" light expand="xs">
            <Container>
                <NavbarBrand>Hypertube</NavbarBrand>
                <Nav className="ml-auto" navbar>
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