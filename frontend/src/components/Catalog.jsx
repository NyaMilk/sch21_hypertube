import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row, Col, FormGroup, Label, Input, Spinner, Button } from 'reactstrap';
import { request } from '../util/http';
import { Loading } from './Loading';
import { setUser } from '../redux/login/ActionCreators';
import { useHistory } from "react-router-dom";

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    setUser: (username) => dispatch(setUser(username))
});

const Catalog = (props) => {
    const history = useHistory();
    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        console.log(props);
        if (!isLogged && !props.login.isLogged)
            request(`/api/auth/success`)
                .then(res => res.json())
                .then((data) => {
                    console.log(data);
                    if (!data.success)
                        history.push('/login');
                    else {
                        console.log('test');
                        setLogged(data.success);
                        props.setUser(data.user)
                    }
                });
    }, [])

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
                                            //clear store
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Catalog));
