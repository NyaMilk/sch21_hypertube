import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Container, Row, Col, ListGroupItem, ListGroup } from 'reactstrap'
import { connect } from 'react-redux';
import { fetchMovie } from '../redux/movie/ActionCreators';
import CONFIG from '../util/const';
import { useTranslation } from "react-i18next";
import { Loading } from './Loading';
import { Info } from './Info';
import NotFound from './NotFound';
import moment from 'moment';

const mapStateToProps = (state) => {
    return {
        catalog: state.catalog,
        movie: state.movie
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchMovie: (imdb) => dispatch(fetchMovie(imdb))
});

function GenreList(props) {
    let listItems;
    if (props.genres) {
        listItems = props.genres.map((genre, item) =>
            <span className="movie-list" key={item}>{genre}</span>
        );
    }
    return (
        <p>
            Жанр:
            {listItems}
        </p>
    );
}

const Movie = (props) => {
    const { t, i18n } = useTranslation();
    const { imdb } = useParams();
    const { fetchMovie } = props;
    console.log(props);

    useEffect(() => {
        fetchMovie(imdb)
    }, [fetchMovie, imdb])

    const title = (i18n.language === 'en') ? props.movie.info.entitle : props.movie.info.rutitle;
    const subtitle = (i18n.language === 'en') ? '' : props.movie.info.entitle;
    const description = (i18n.language === 'en') ? props.movie.info.endescription : props.movie.info.rudescription;
    const genres = (i18n.language === 'en') ? props.movie.info.engenres : props.movie.info.rugenres;

    if (props.movie.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.movie.infoMsg) {
        return (
            <Info />
        );
    }
    else if (props.movie.info != null) {
        return (
            <section className="movie text-break">
                <Container>
                    <Row className="movie-header">
                        <Col className="font-movie-head">
                            <h2>{title}</h2>
                            <p>{subtitle}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <video id="videoPlayer" className="embed-responsive" controls>
                                <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}`}
                                    type="video/mp4" />
                                <track label="English" kind="subtitles" srclang="en" src="captions/vtt/sintel-en.vtt" default />
                                <track label="Deutsch" kind="subtitles" srclang="de" src="captions/vtt/sintel-de.vtt" />
                                <track label="Español" kind="subtitles" srclang="es" src="captions/vtt/sintel-es.vtt" />
                            </video>
                        </Col>
                    </Row>
                    {/* <AsideButton
                        check={isMe}
                        // info={props.login.info}
                        status={[t("moviePage.status.add"), t("moviePage.status.remove")]} /> */}
                    <Row>
                        <Col>
                            <p>
                                {moment(props.movie.info.daterelease).year()},
                                COUNTRY,
                                TIME??
                            </p>
                            <GenreList genres={genres} />
                            <p>{description}</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
    else
        return (
            <NotFound />
        );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Movie));
