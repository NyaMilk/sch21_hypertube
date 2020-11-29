import React from 'react';
import { useState } from 'react';
import { Button, Col, Container, Input, Row, Card, CardBody, Label, NavLink } from 'reactstrap';
import Info from './Info';
import { request } from '../util/http';
import { useTranslation } from "react-i18next";

const Remind = () => {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState(null);
    const [isSuccess, setSuccess] = useState(null);

    const remind = () => {
        const data = {
            email: email
        }

        request('/api/remind', data, 'POST')
            .then(res => res.json())
            .then(res => {
                setMsg(res.message);
                setSuccess(res.success);
            })
    }

    const { t } = useTranslation();

    return (
        <section className="login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                {
                                    msg &&
                                    <Info message={msg} isSuccess={isSuccess} />
                                }
                                <Col>
                                    <Label className="font-profile-head">
                                        {t("loginPage.reset")}
                                        <Input onChange={(e) => setEmail(e.target.value)} />
                                    </Label>
                                </Col>
                                <Col>
                                    <Button
                                        className="login-btn"
                                        onClick={remind}
                                        color='secondary'>{t("loginPage.send")}</Button>
                                </Col>
                                <Col className="login-btn__link">
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/login' >{t("loginPage.back")}</NavLink>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section >
    );
}

export default Remind;