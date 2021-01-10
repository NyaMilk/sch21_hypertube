import React from "react";
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
    return (
        <div className="footer bg-light text-break">
            <Container>
                <Row>
                    <Col>
                        <span>created by <a href="https://github.com/Dindonpingpong">rkina</a> & <a href="https://github.com/NyaMilk">mgrass</a> & <a href="https://github.com/cnails">cnails</a></span>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Footer;
