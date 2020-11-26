import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';
import { fetchLogin, setLogin, setPassword } from '../../redux/login/ActionCreators';

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
    )
}

const Login = (props) => {
	const { setLogin, setPassword } = props;

    const handle = (e) => {
        window.open(`http://localhost:5000/api/login/${e.target.name}`, "_self");
    }

    return (
        <section className="login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card>
                            <CardBody>
                                <InputForm name="Login" type="text" set={setLogin}/>
                                <InputForm name="Password" type="password" set={setPassword}/>
                                <Row>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info" >Sign in</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info" onClick={handle} name="github">Via github</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info" onClick={handle} name="intra">Via school42</Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
