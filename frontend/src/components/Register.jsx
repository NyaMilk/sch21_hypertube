import React from 'react';
import { useState } from 'react';
import { useHistory, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import { setLogin, setFirstName, setLastName, setEmail, setPassword, setRepassword, fetchRegister } from '../redux/register/ActionCreators';
import { NavLink, Card, CardBody, Row, Col, FormGroup, Label, Input, FormFeedback, Button, Container, Alert } from 'reactstrap';
import { isValidInput, isValidPassword } from '../util/check';
import { request } from '../util/http';
import Loading from './Loading';

const mapStateToProps = (state) => {
    return {
        register: state.register
    }
}

const mapDispatchToProps = (dispatch) => ({
    setLogin: (login) => dispatch(setLogin(login)),
    setFirstName: (FirstName) => dispatch(setFirstName(FirstName)),
    setLastName: (LastName) => dispatch(setLastName(LastName)),
    setEmail: (Email) => dispatch(setEmail(Email)),
    setPassword: (Password) => dispatch(setPassword(Password)),
    setRepassword: (Repassword) => dispatch(setRepassword(Repassword)),
    fetchRegister: (data) => dispatch(fetchRegister(data))
});

const InputForm = (props) => {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Oopsy!');

    const checkExist = (name, value) => {
        request(`/api/register/check/${name}/${value}`)
            .then(res => res.json())
            .then(
                result => {
                    if (result.success === true) {
                        toggleValid('is-invalid');
                        setFeedback(props.feedback[0]);
                    }
                }
            )
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username' || name === 'email' || name === 'lastName' || name === 'firstName') {
            if (isValidInput(name, value) === true) {
                toggleValid('is-valid');
                if (name === 'username' || name === 'email')
                    checkExist(name, value);
                props.set(value);
            }
            else {
                toggleValid('is-invalid');
                (name === 'username' || name === 'email') ? setFeedback(props.feedback[1]) : setFeedback(props.feedback);
            }
        }
    };

    return (
        <Col sm="6">
            <FormGroup>
                <Label className="font-profile-head">
                    {props.labelName}
                    <Input
                        type={props.type}
                        name={props.name}
                        onChange={inputChange}
                        onBlur={() => props.onBlur()}
                        placeholder={props.placeholder}
                        className={isValid}
                        required
                    />
                    <FormFeedback>{feedback}</FormFeedback>
                </Label>
            </FormGroup>
        </Col>
    )
}

const Password = (props) => {
    const [isValidPass, toggleValidPass] = useState('');
    const [isValidRepass, toggleValidRepass] = useState('');

    const passChange = (e) => {
        const { name, value } = e.target;

        if (name === 'password' || name === 'repassword') {
            if (isValidPassword(value) === true) {
                toggleValidPass('is-valid');
                if (name === 'password')
                    props.set(value);
            }
            else
                toggleValidPass('is-invalid');

            const password = document.querySelector('input[name="password"]').value;
            const repassword = document.querySelector('input[name="repassword"]').value;
            (password === repassword) ? toggleValidRepass('is-valid') : toggleValidRepass('is-invalid');
        }
    };

    return (
        <Row>
            <Col sm="6">
                <FormGroup>
                    <Label className="font-profile-head">
                        {props.labelNamePass}
                        <Input
                            type="password"
                            name='password'
                            onChange={passChange}
                            onBlur={() => props.onBlur()}
                            placeholder="Str0ngPa55%"
                            className={isValidPass}
                            required
                        />
                        <FormFeedback>{props.feedback[0]}</FormFeedback>
                    </Label>
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <Label className="font-profile-head">
                        {props.labelNameRePass}
                        <Input
                            type="password"
                            name='repassword'
                            onChange={passChange}
                            onBlur={() => props.onBlur()}
                            placeholder="Str0ngPa55%"
                            className={isValidRepass}
                            required
                        />
                        <FormFeedback>{props.feedback[1]}</FormFeedback>
                    </Label>
                </FormGroup>
            </Col>
        </Row>
    )
}

const Register = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [isActiveBtn, toggleBtn] = useState(false);

    const handleSubmit = () => {
        const { userName, lastName, firstName, email, password } = props.register;

        let data = {
            userName: userName,
            lastName: lastName,
            firstName: firstName,
            email: email,
            password: password,
        }

        props.fetchRegister(data)
            .then(() => {
                history.push('/login');
            })
    }

    const checkBtn = () => {
        const countValidInputs = document.querySelectorAll(".is-valid").length;
        const countInvalidInputs = document.querySelectorAll(".is-invalid").length;

        (countValidInputs === 6 && countInvalidInputs === 0) ? toggleBtn(false) : toggleBtn(true);
    }

    if (props.register.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.register.infoMsg) {
        return (
            <Alert color='info'>{props.register.infoMsg}</Alert>
        );
    }
    else
        return (
            <section className="login">
                <Container>
                    <Row>
                        <Col md={10} className="m-auto">
                            <Card className="mb-4 shadow-sm">
                                <CardBody>
                                    <Row>
                                        <InputForm
                                            set={props.setLogin}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.login")}
                                            feedback={[t("inputMsg.login.taken"), t("inputMsg.login.invalid")]}
                                            name='username'
                                            placeholder='rkina7'
                                            type='text' />
                                        <InputForm
                                            set={props.setEmail}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.email")}
                                            feedback={[t("inputMsg.email.taken"), t("inputMsg.email.invalid")]}
                                            name='email'
                                            placeholder='rkina@mail.ru'
                                            type='email' />
                                    </Row>
                                    <Row>
                                        <InputForm
                                            set={props.setFirstName}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.firstName")}
                                            feedback={t("inputMsg.text")}
                                            name='firstName'
                                            placeholder='Duong'
                                            type='text' />
                                        <InputForm
                                            set={props.setLastName}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.lastName")}
                                            feedback={t("inputMsg.text")}
                                            name='lastName'
                                            placeholder='Ng'
                                            type='text' />
                                    </Row>
                                    <Password
                                        set={props.setPassword}
                                        onBlur={checkBtn}
                                        labelNamePass={t("loginPage.password")}
                                        labelNameRePass={t("loginPage.repassword")}
                                        feedback={[t("inputMsg.password.weak"), t("inputMsg.password.match")]} />
                                    <Button
                                        className="login-btn"
                                        color="secondary"
                                        type="submit"
                                        disabled={isActiveBtn}
                                        onClick={handleSubmit}
                                        onBlur={checkBtn}
                                        block>
                                        {t("loginPage.signUp")}
                                    </Button>
                                    <Col className="login-btn__link">
                                        <div className="dropdown-divider"></div>
                                        <NavLink href='/login'>{t("loginPage.back")}</NavLink>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
