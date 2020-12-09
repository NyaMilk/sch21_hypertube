import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap'
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux';
import { fetchMovie } from '../redux/movie/ActionCreators';
import { Loading } from './Loading';
import CONFIG from '../util/const';

const mapStateToProps = (state) => {
    return {
        catalog: state.catalog,
        movie: state.movie
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchMovie: (imdb) => dispatch(fetchMovie(imdb))
});

const Movie = (props) => {
    const { imdb } = useParams();
    const { t } = useTranslation();
    const { fetchMovie, info, isLoading, infoMsg } = props;
    console.log(props);

    useEffect(() => {
        fetchMovie(imdb)
    }, [imdb, fetchMovie])

    if (isLoading) {
        return(
            <Loading />
        )
    }

    return (
        <Container>
            <Row>
                <Col>
                    {imdb}
                    Poster
                    {/* {props.movie.info} */}
                </Col>
                <Col>
                    Title
                    Rate
                </Col>
            </Row>
            <Row>
                <video id="videoPlayer" controls>
                    <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}`}
                        type="video/mp4" />
                    <track label="English" kind="subtitles" srclang="en" src="captions/vtt/sintel-en.vtt" default />
                    <track label="Deutsch" kind="subtitles" srclang="de" src="captions/vtt/sintel-de.vtt" />
                    <track label="Español" kind="subtitles" srclang="es" src="captions/vtt/sintel-es.vtt" />
                </video>
            </Row>
        </Container>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Movie));
