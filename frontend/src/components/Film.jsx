import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../redux/login/ActionCreators';

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => ({
    setUser: (username) => dispatch(setUser(username))
});

const Film = (props) => {

    console.log("props ", props);


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
            <section className="film">
                <Container>

                </Container>
            </section>
        );
    // }
    // else
    //     return (
    //         <NotFound />
    //     );
}