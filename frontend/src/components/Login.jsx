import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';
import { NavLink } from 'reactstrap';
import { fetchLogin, setLogin, setPassword } from '../redux/login/ActionCreators';

import logo_42 from '../img/42_logo.svg';
import logo_git from '../img/git_logo.svg';

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    // fetchLogin: (login, password) => dispatch(fetchLogin(login, password)),
    setLogin: (login) => dispatch(setLogin(login)),
    setPassword: (password) => dispatch(setPassword(password))
});

const InputForm = (props) => {
    const { name, type, set } = props;

    return (
        <Col>
            <FormGroup>
                <Label className="font-profile-head">{name}
                    <Input
                        type={type}
                        name={name}
                        onChange={e => set(e.target.value)}
                        required
                    />
                </Label>
            </FormGroup>
        </Col>
    );
}

const Login = (props) => {
    const { setLogin, setPassword } = props;

    const handle = (e) => {
        // request(`http://localhost:5000/`)
        //     .then(res => res.json())
        //     .then((data) => console.log(data));
        window.open(`http://localhost:5000/api/auth/${e.target.name}`, "_self");
    }

    return (
        <section className="login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                <InputForm name="Login" type="text" set={setLogin} />
                                <InputForm name="Password" type="password" set={setPassword} />

                                <Col>
                                    <Button className="login-btn">Sign in</Button>
                                </Col>
                                <div className="d-flex justify-content-center align-items-center">

                                    <Button className="login-btn__aside" onClick={handle} name="github">
                                        <img src={logo_git} width="27" alt="GitHub" />
                                    </Button>
                                    <Button className="login-btn__aside" onClick={handle} name="intra">
                                        <img src={logo_42} width="35" alt="Intra 42" />
                                    </Button>
                                </div>
                                <Col className="login-btn__link">
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/register' >Newbee? Sign up</NavLink>
                                    <NavLink href='/remind' >Forgot password? Remind</NavLink>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
