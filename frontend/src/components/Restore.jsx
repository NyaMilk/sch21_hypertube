import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../util/http';
import { isValidInput } from '../util/check';
import { Container, Button, Input, Col, Label, Card, CardBody } from 'reactstrap';
// import Button from 'reactstrap/lib/Button';
import FormFeedback from 'reactstrap/lib/FormFeedback';
import Info from './Info';

function InputForm(props) {
    const [isValid, toggleValid] = useState('');
    const [newFeedback, setFeedback] = useState(null);

    const inputChange = (e) => {
        const { name, value } = e.target;

        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            if (name === 'rePass' && props.new !== value) {
                toggleValid('is-invalid');
                setFeedback('Password does not match');
            }
            if (name === 'newPass')
                props.set(value);
        }
        else {
            toggleValid('is-invalid');
        }
    };

    return (
        <Col>
            <Label className="font-profile-head">{props.label}
                <Input
                    type='password'
                    name={props.name}
                    onChange={inputChange}
                    onBlur={props.checkBtn}
                    className={isValid}
                />
                <FormFeedback>{newFeedback || props.feedback}</FormFeedback>
            </Label>
        </Col>
    );
}

const Restore = () => {
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
                            <InputForm name='newPass' label='New password' feedback='Too weak pass' set={setPass} checkBtn={checkBtn} />
                            <InputForm name='rePass' label='Repeat password' feedback='Too weak pass' new={newPass} checkBtn={checkBtn} />
                            <Col>
                                <Button className="login-btn" color='secondary' disabled={isActive} onClick={handleBtn} >Change</Button>
                            </Col>
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        </section>
    );
}

export default Restore;
