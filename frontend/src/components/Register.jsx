import React from 'react';
import { useState } from 'react';
import { useHistory, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import { setLogin, setFirstName, setLastName, setEmail, setPassword, setRepassword, fetchRegister } from '../redux/register/ActionCreators';
import { NavLink, Card, CardBody, Row, Col, FormGroup, Label, Input, FormFeedback, Button, Container, Alert } from 'reactstrap';
import { isValidInput, isValidPassword } from '../util/check';
import { request } from '../util/http';
import { Loading } from './Loading';
import CONFIG from '../util/const';

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

function InputForm(props) {
    const [isValid, toggleValid] = useState('');

    const nameChange = (e) => {
        const { name, value } = e.target;

        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            props.set(value);
        }
        else
            toggleValid('is-invalid');
    };

    return (
        <Col sm="6">
            <FormGroup>
                <Label className="font-profile-head">
                    {props.labelName}
                    <Input
                        type={props.type}
                        name={props.name}
                        onChange={nameChange}
                        onBlur={props.onBlur}
                        placeholder={props.placeholder}
                        required
                        className={isValid}
                    />
                    <FormFeedback>{props.feedback}</FormFeedback>
                </Label>
            </FormGroup>
        </Col>
    )
}

function InputFormWithFetch(props) {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Oopsy');

    const checkExist = (name, value) => {
        request(`${CONFIG.API_URL}/api/register/check/${name}/${value}`)
            .then(res => res.json())
            .then(
                result => {
                    if (result.success === true) {
                        toggleValid('is-invalid');
                        // здесь второй язык in8
                        setFeedback(`${name} is taken`)
                    }
                }
            )
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (isValidInput(name, value) === true && value.length > 2) {
            toggleValid('is-valid');
            checkExist(name, value);
            props.set(value);
        }
        else {
            toggleValid('is-invalid');
            // здесь второй язык in8
            setFeedback(`${name} is invalid`)
        }
    };

    return (
        <Col sm="6">
            <FormGroup>
                <Label className="font-profile-head">
                    {props.labelName}
                    <Input
                        type="text"
                        name={props.name}
                        onChange={inputChange}
                        onBlur={() => props.onBlur()}
                        placeholder={props.placeholder}
                        required
                        feedback={feedback}
                        className={isValid}
                    />
                    <FormFeedback>{feedback}</FormFeedback>
                </Label>
            </FormGroup>
        </Col>
    )
}

function Password(props) {
    const [isValidPass, toggleValidPass] = useState('');
    const [isValidRepass, toggleValidRepass] = useState('');

    const passChange = (e) => {
        const { name, value } = e.target;

        if (name === 'password') {
            if (isValidPassword(value) === true) {
                toggleValidPass('is-valid');
                props.setPass(value);
            }
            else
                toggleValidPass('is-invalid');
        }
        else {
            const password = document.querySelector('input[name="password"]').value;

            (password === value) ? toggleValidRepass('is-valid') : toggleValidRepass('is-invalid');
        }
    };

    return (
        <Row>
            <Col sm="6">
                <FormGroup>
                    <Label className="font-profile-head">
                        {props.labelNamePass}
                        <Input
                            id="1"
                            type="password"
                            name='password'
                            onChange={passChange}
                            onBlur={() => props.onBlur()}
                            placeholder="Str0ngPa55%"
                            required
                            className={isValidPass}
                        />
                        <FormFeedback>Too weak password. 8 symbols is required</FormFeedback>
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
                            required
                            className={isValidRepass}
                        />
                        <FormFeedback>Password doesn't match</FormFeedback>
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
    else if (props.errMsg) {
        return (
            <Alert color='info'>{props.errMsg}</Alert>
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
                                        <InputFormWithFetch
                                            set={props.setLogin}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.login")}
                                            name='login'
                                            placeholder='rkina7' />
                                        <InputFormWithFetch
                                            set={props.setEmail}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.email")}
                                            name='email'
                                            placeholder='rkina@mail.ru' />
                                    </Row>
                                    <Row>
                                        <InputForm
                                            set={props.setLastName}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.lastName")}
                                            name='lastName'
                                            placeholder='Ng'
                                            type='text'
                                            // здесь второй язык in8
                                            feedback='Only symbols are required'
                                        />

                                        <InputForm
                                            set={props.setFirstName}
                                            onBlur={checkBtn}
                                            labelName={t("loginPage.firstName")}
                                            name='firstName'
                                            placeholder='Duong'
                                            type='text'
                                            // здесь второй язык in8
                                            feedback='Only symbols are required'
                                        />
                                    </Row>
                                    <Password
                                        setPass={props.setPassword}
                                        onBlur={checkBtn}
                                        labelNamePass={t("loginPage.password")}
                                        labelNameRePass={t("loginPage.repassword")} />
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
