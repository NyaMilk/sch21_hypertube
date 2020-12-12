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

    const changeFilmList = (e) => {
        if (e.target.value === 'like' || e.target.value === 'unlike') {
            props.fetchUpdateStatus(props.me, props.film, e.target.value);
        }
    }

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Col className="aside-button">
            <Button color="danger"
                value={props.favorite === 'add' ? 'remove' : 'add'}
                onClick={changeFilmList}>
                {props.favorite === 'add' ? 'Remove from favorite' : 'Add to favorite'}
            </Button>
            <Button color="danger">Share</Button>
            <Button color="danger" onClick={() => props.togglePlayer(false)}>Trailer</Button>
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret color="danger">Movie</DropdownToggle>
                <DropdownMenu >
                    <DropdownItem active onClick={() => {
                        props.togglePlayer(true)
                        props.setQuality('480')
                    }}>
                        360</DropdownItem>
                    <DropdownItem onClick={() => {
                        props.togglePlayer(true)
                        props.setQuality('720')
                    }}>720</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        </Col>
    );
}

const Movie = (props) => {
    const { t, i18n } = useTranslation();
    const { imdb } = useParams();
    const [moviePlayer, togglePlayer] = useState(true);
    const [quality, setQuality] = useState('720');
    const { fetchMovie } = props;
    const { entitle, rutitle, endescription, rudescription,
        engenres, rugenres, entrailer, rutrailer, rate, daterelease, runtime } = props.movie.info;

    useEffect(() => {
        fetchMovie(imdb)
    }, [fetchMovie, imdb])

    const title = (i18n.language === 'en') ? entitle : rutitle;
    const description = (i18n.language === 'en') ? endescription : rudescription;
    const genres = (i18n.language === 'en') ? engenres : rugenres;
    const trailer = (i18n.language === 'en') ? entrailer : rutrailer;

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
                                {`IMDb ${rate} `}
                                &bull;
                                {` ${moment(daterelease).year()} `}
                                &bull;
                                {` ${runtime} min`}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                moviePlayer &&
                                <video key={quality} id="videoPlayer" className="embed-responsive" controls>
                                    <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}/${quality}`} type="video/mp4" />

                                    <track label="English" kind="subtitles" srclang="en" src="captions/vtt/sintel-en.vtt" default />
                                    <track label="Deutsch" kind="subtitles" srclang="de" src="captions/vtt/sintel-de.vtt" />
                                    <track label="Español" kind="subtitles" srclang="es" src="captions/vtt/sintel-es.vtt" />
                                </video>
                            }
                            {
                                !moviePlayer &&
                                <iframe id="videoPlayer" className="embed-responsive" height="420" controls
                                    src={`https://www.youtube.com/embed/${trailer}`}>
                                </iframe>
                            }
                        </Col>
                    </Row>
                    <Row className="aside-button">
                        <Options
                            favorite={props.movie.favorite}
                            togglePlayer={togglePlayer}
                            setQuality={setQuality}
                        />
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
            </section >
        );
    }
    else
        return (
            <NotFound />
        );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Movie));
