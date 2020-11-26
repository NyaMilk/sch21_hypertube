import React, { useEffect, useState } from 'react';
import { Card, CardBody, Container, Row, Col, FormGroup, Label, Input, Spinner, Button } from 'reactstrap';
import { request } from '../util/http';


const Catalog = (props) => {
    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        request(`http://localhost:5000/api/auth/success`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setLogged(true);
            });
    }, [setLogged])

    if (!isLogged)
        return (
            <section className="login">
                <Container>
                    <Row>
                        <Col md={6} className="m-auto">
                            <Card>
                                <CardBody>
                                    <Spinner />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
    else if (isLogged)
        return (
            <section className="login">
                <Container>
                    <Row>
                        <Col md={6} className="m-auto">
                            <Card>
                                <CardBody>
                                    <div>
                                        Hello
                                    </div>
                                    <Button onClick={() => {
                                        console.log('ht');
                                        request(`http://localhost:5000/api/auth/logout`);
                                    }} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
}

export default Catalog;
