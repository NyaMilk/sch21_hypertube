import React from 'react';
import { Button, Container, Row } from 'reactstrap';
import { request } from './../util/http'; 

const NotFound = () => {
    return (
        <section className="page-state">
            <Container>
                <Row>
                    <Button onClick={() => {
                        console.log('ht');
                        window.open(`http://localhost:5000/api/login/logout`, "_self");
                    }}/>
                    <span className="font-profile-head font-message">Oops! Page not found.</span>
                </Row>
            </Container>
        </section>
    )
}

export default NotFound;