import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input, NavLink } from 'reactstrap';
import { request } from '../util/http';
import { Loading } from './Loading';
import { Info } from './Info';
import { localAuth, oAuth } from '../redux/login/ActionCreators';
import logo_42 from '../img/42_logo.svg';
import logo_git from '../img/git_logo.svg';
import { useTranslation } from "react-i18next";
import CONFIG from '../util/const';

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    localAuth: (username, password) => dispatch(localAuth(username, password)),
});

const InputForm = (props) => {
    const { name, text, type, set } = props;

    return (
        <Col>
            <FormGroup>
                <Label className="font-profile-head">
                    {text}
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
    const { t } = useTranslation();
    const { username, hash } = useParams();
    const [msg, setMsg] = useState(null);
    const names = ["github", "intra"];
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();

    const handleOauth = (e) => {
        if (names.includes(e.target.name)) {
            window.open(`${CONFIG.API_URL}/api/auth/${e.target.name}`, "_self");
        }
    }

    const submit = () => { props.localAuth(login, password) };

    if (username && hash) {
        const data = {
            username: username,
            hash: hash
        };

        request('/api/register/confirm', data, "POST")
            .then(res => res.json())
            .then((result) => setMsg(result.msg))
            .catch((e) => setMsg(e.message))
    }

    return (
        <section className="login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                {
                                    msg &&
                                    <Info message={msg} />
                                }
                                <InputForm name="Login" text={t("loginPage.login")} type="text" set={setLogin} />
                                <InputForm name="Password" text={t("loginPage.password")} type="password" set={setPassword} />

                                <Col>
                                    <Button className="login-btn" onClick={submit}>{t("loginPage.signIn")}</Button>
                                </Col>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button className="login-btn__aside" onClick={handleOauth} name="github">
                                        <img src={logo_git} width="27" alt="GitHub" name={names[0]} />
                                    </Button>
                                    <Button className="login-btn__aside" onClick={handleOauth} name="intra">
                                        <img src={logo_42} width="35" alt="Intra 42" name={names[1]} />
                                    </Button>
                                </div>
                                <Col className="login-btn__link">
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/register'>{t("loginPage.register")}</NavLink>
                                    <NavLink href='/remind'>{t("loginPage.remind")}</NavLink>
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
