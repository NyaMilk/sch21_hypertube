import React from 'react';
import { Container, Spinner } from 'reactstrap';

const Loading = () => {
    return (
        <section className="page-state">
            <Container>
                <Spinner animation="border" />
            </Container>
        </section>
    );
};

export default Loading;
