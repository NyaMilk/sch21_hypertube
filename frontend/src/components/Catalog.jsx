import React, { useEffect, useState } from 'react';
import { Card, CardBody, Container, Row, Col, FormGroup, Label, Input, Spinner, Button } from 'reactstrap';
import { request } from '../util/http';
import { Loading } from './Loading';


const Catalog = (props) => {
    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        request(`/api/auth/success`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setLogged(data.success);
            });
    }, [setLogged])

    // if (!isLogged) {
    //     return (
    //         <Loading />
    //     );
    // }
    // else if (isLogged)
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
                                    request(`/api/auth/logout`)
                                        .then(res => res.json())
                                        .then((data) => {
                                            console.log(data);
                                            // setLogged(data.success);
                                        });
                                }} />
                            </CardBody>
                            <CardBody>
                                <div>
                                    Hello
                                    </div>
                                <Button onClick={() => {
                                    request(`/api/auth/success`)
                                        .then(res => res.json())
                                        .then((data) => {
                                            console.log(data);
                                            // setLogged(data.success);
                                        });
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
