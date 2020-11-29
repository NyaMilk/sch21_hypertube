import React, { useState } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect } from 'react-redux';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input, Form } from 'reactstrap';
import { NavLink } from 'reactstrap';
import { request } from '../util/http';
// import { fetchLogin, setLogin, setPassword } from '../redux/login/ActionCreators';
import axios from 'axios';
import logo_42 from '../img/42_logo.svg';
import logo_git from '../img/git_logo.svg';

// const mapStateToProps = (state) => {
//     return {
//         login: state.login
//     }
// }

// const mapDispatchToProps = (dispatch) => ({
//     // fetchLogin: (login, password) => dispatch(fetchLogin(login, password)),
//     setLogin: (login) => dispatch(setLogin(login)),
//     setPassword: (password) => dispatch(setPassword(password))
// });

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

const Login = () => {
    const names = ["github", "intra"];
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();

    const handle = (e) => {
        console.log(e.target.name);
        if (names.includes(e.target.name))
            window.open(`http://localhost:5000/api/auth/${e.target.name}`, "_self");
    }

    const submit = () => {
        const data = new URLSearchParams({
            'username': login,
            'password': password
          })

        console.log(data);

        // request(`http://localhost:5000/api/auth/test/`, data, 'POST');

        // axios.post(`http://localhost:5000/api/auth/test?username=${login}&password=${password}`)
        fetch('/api/auth/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'username': login,
                'password': password
              })
        }).then(res => {console.log(res);});
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
                                    <Button className="login-btn" onClick={submit}>Sign in</Button>
                                </Col>

                                <div className="d-flex justify-content-center align-items-center">
                                    <Button className="login-btn__aside" onClick={handle}>
                                        <img src={logo_git} width="27" alt="GitHub" name={names[0]} />
                                    </Button>
                                    <Button className="login-btn__aside" onClick={handle}>
                                        <img src={logo_42} width="35" alt="Intra 42" name={names[1]} />
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

export default Login;
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
