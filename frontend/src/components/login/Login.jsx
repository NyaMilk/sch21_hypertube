import React from 'react';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';

const LoginInput = () => {

    return (
        <Col>
            <FormGroup>
                <Label className="font-profile-head">Login
                <Input
                        type="text"
                        name="Login"
                        placeholder="rkina7"
                        required
                    />
                </Label>
            </FormGroup>
        </Col>
    )
}

const Password = () => {

    return (
        <Col>
            <FormGroup>
                <Label className="font-profile-head">Password
                <Input
                        type="password"
                        name='password'
                        placeholder="Str0ngPa55%"
                        required
                    />
                </Label>
            </FormGroup>
        </Col>
    )
}

const Login = () => {
    const handle = () => {
        console.log('here');
        window.open("http://localhost:5000/api/login/facebook", "_self");
    }

    return (
        <section className="login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card>
                            <CardBody>
                                <form >
                                    <LoginInput />
                                    <Password />
                                    <Row>
                                        <Col xs={3}>
                                            <Button className="login-btn" color="info" onClick={handle()}>Sign in</Button>
                                        </Col>
                                        <Col xs={3}>
                                            <Button className="login-btn" color="info">Via FB</Button>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Login;
