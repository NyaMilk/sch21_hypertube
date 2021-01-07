import React from 'react';
import { Container, Row } from 'reactstrap';

export const NotFound = () => {
    return (
        <section className="page-state">
            <Container>
                <Row>
                    <span className="font-profile-head font-message">Oops! Page not found.</span>
                </Row>
            </Container>
        </section>
    )
}
