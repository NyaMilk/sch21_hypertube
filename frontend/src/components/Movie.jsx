import React, { useState, useEffect } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import {
    Container, Row, Col, ListGroup, ListGroupItem, Button,
    DropdownToggle, DropdownMenu, DropdownItem, ButtonGroup, ButtonDropdown
} from 'reactstrap'
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
            <ListGroupItem className="movie-list" key={item}>
                <Link to="#">{genre}</Link>
            </ListGroupItem>
        );
    }
    return (
        <ListGroup horizontal>{listItems}</ListGroup>
    );
}

const Options = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Col>
            <ButtonGroup>
                <Button color="primary" >Trailer</Button>
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle caret>Movie</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem active>360</DropdownItem>
                        <DropdownItem>720</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </ButtonGroup>
        </Col >
    );
}

const Movie = (props) => {
    const { t, i18n } = useTranslation();
    const { imdb } = useParams();
    const { fetchMovie } = props;
    const changeFilmList = (e) => {
        if (e.target.value === 'like' || e.target.value === 'unlike') {
            props.fetchUpdateStatus(props.me, props.film, e.target.value);
        }
    }

    useEffect(() => {
        fetchMovie(imdb)
    }, [fetchMovie, imdb])

    const title = (i18n.language === 'en') ? props.movie.info.entitle : props.movie.info.rutitle;
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
                            <p>
                                {`IMDb ${props.movie.info.rate} `}
                                &bull;
                                {` ${moment(props.movie.info.daterelease).year()} `}
                                &bull;
                                {` ${props.movie.info.runtime} min`}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Options />
                    </Row>
                    <Row>
                        <Col>
                            <video id="videoPlayer" className="embed-responsive" controls>
                                <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}`} type="video/mp4" />

                                <track label="English" kind="subtitles" srclang="en" src="captions/vtt/sintel-en.vtt" default />
                                <track label="Deutsch" kind="subtitles" srclang="de" src="captions/vtt/sintel-de.vtt" />
                                <track label="Español" kind="subtitles" srclang="es" src="captions/vtt/sintel-es.vtt" />
                            </video>
                        </Col>
                    </Row>
                    <Row className="aside-button">
                        <Col className="aside-button">
                            <Button color="danger"
                                value={props.movie.favorite === 'add' ? 'remove' : 'add'}
                                onClick={changeFilmList}>
                                {props.movie.favorite === 'add' ? 'Remove from favorite' : 'Add to favorite'}
                            </Button>
                            <Button color="danger">
                                Share
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className="movie-title">Жанр:</p>
                            <GenreList genres={genres} />
                            <p className="movie-title">Описание:</p>
                            <p className="movie-description">{description}</p>
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
