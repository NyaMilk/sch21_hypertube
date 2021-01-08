import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "reactstrap";

const Info = (props) => {
    const { isSuccess, message, info } = props;
    const [isVisible, setClose] = useState(true);
    const color = isSuccess ? 'success' : 'danger';

    useEffect(() => {
        if (isVisible && info === 'alert') {
            window.setTimeout(() => {
                setClose(!isVisible);
            }, 5000);
        }
    }, [isVisible, info]);

    if (info === 'message')
        return (
            <section className="page-state">
                <Container>
                    <Row>
                        <Col>
                            <Alert className="text-center" isOpen={isVisible} color={color}>{message}</Alert>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
    else
        return (
            <Alert className="text-center" isOpen={isVisible} color={color}>{message}</Alert>
        );
}

export default Info;
