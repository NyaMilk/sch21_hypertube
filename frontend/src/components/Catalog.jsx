import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row, Col, FormGroup, Label, Input, Spinner, Button } from 'reactstrap';
import { Loading } from './Loading';
import { setUser } from '../redux/login/ActionCreators';
import { Info } from './Info';

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    setUser: (username) => dispatch(setUser(username))
});

const Catalog = (props) => {

    // if (props.catalog.isLoading) {
    //     return (
    //         <Loading />
    //     );
    // }
    // else if (props.catalog.infoMsg) {
    //     return (
    //         <Info />
    //     );
    // }
    // else if (props.catalog.info != null) {
        return (
            <section className="users">
                <Container>
                    {/* <Filter filter={props} /> */}
                    {/* <UserCards cards={props.catalog.info} /> */}
                    {/* <CardsPagination getPage={props.match.params.page} allUsers={props.filter.allUsersCount} /> */}
                </Container>
            </section>
        );
    // }
    // else
    //     return (
    //         <section className="users">
    //             <Container>
    //                 {/* <Filter filter={props} /> */}
    //                 <span className="font-profile-head font-message">Not found :C</span>
    //             </Container>
    //         </section>
    //     );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Catalog));
