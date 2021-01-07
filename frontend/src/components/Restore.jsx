import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../util/http';
import { isValidPassword } from '../util/check';
import { Container, Button, Input, Row, Col, Label, Card, CardBody, FormFeedback, FormGroup } from 'reactstrap'
import { Info } from './Info';
import { useTranslation } from "react-i18next";

const InputForm = (props) => {
    const [isValidPass, toggleValidPass] = useState('');
    const [isValidRepass, toggleValidRepass] = useState('');

    const inputChange = (e) => {
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
        <Col>
            <FormGroup>
                <Label className="font-profile-head">
                    {props.labelNamePass}
                    <Input
                        type="password"
                        name='password'
                        onChange={inputChange}
                        onBlur={props.checkBtn}
                        placeholder="Str0ngPa55%"
                        className={isValidPass}
                        required
                    />
                    <FormFeedback>{props.feedback[0]}</FormFeedback>
                </Label>
            </FormGroup>
            <FormGroup>
                <Label className="font-profile-head">
                    {props.labelNameRePass}
                    <Input
                        type="password"
                        name='repassword'
                        onChange={inputChange}
                        onBlur={props.checkBtn}
                        placeholder="Str0ngPa55%"
                        className={isValidRepass}
                        required
                    />
                    <FormFeedback>{props.feedback[1]}</FormFeedback>
                </Label>
            </FormGroup>
        </Col>
    );
}

export const Restore = () => {
    const { email, hash } = useParams();
    const [msg, setMsg] = useState(null);
    const [newPass, setPass] = useState();
    const [isActive, toggleBtn] = useState(true);

    useEffect(() => {
        const data = {
            email: email,
            hash: hash
        }

        request('/api/remind/check', data, 'POST')
            .then((res) => res.json())
            .then((res) => {
                if (!res.success)
                    setMsg(res.message);

            })
    }, [email, hash])

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-valid").length;

        (countInvalidInputs === 2) ? toggleBtn(false) : toggleBtn(true);
    }

    const handleBtn = () => {
        const data = {
            email: email,
            password: newPass
        }

        request('/api/remind/restore', data, 'POST')
            .then((res) => res.json())
            .then((res) => setMsg(res.message));
    }

    const { t } = useTranslation();
    return (
        <section className="login">
            <Container>
                <Col md={6} className="m-auto">
                    <Card className="mb-4 shadow-sm">
                        <CardBody>
                            {
                                msg &&
                                <Info message={msg} />
                            }
                            <InputForm
                                set={setPass}
                                checkBtn={checkBtn}
                                labelNamePass={t("loginPage.password")}
                                labelNameRePass={t("loginPage.repassword")}
                                feedback={[t("inputMsg.password.weak"), t("inputMsg.password.match")]} />
                            <Col>
                                <Button
                                    className="login-btn"
                                    color='secondary'
                                    disabled={isActive}
                                    onClick={handleBtn}>
                                    {t("loginPage.send")}
                                </Button>
                            </Col>
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        </section>
    );
}
