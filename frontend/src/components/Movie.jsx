import React, { useState, useEffect } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import {
    Container, Row, Col, ListGroup, ListGroupItem, Button,
    DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown, Input, Nav, NavItem, NavLink, TabContent, TabPane, InputGroup, Media
} from 'reactstrap'
import { connect } from 'react-redux';
import { fetchMovie, fetchFavoriteFilm, fetchUpdateFavoriteFilm, fetchComments } from '../redux/movie/ActionCreators';
import CONFIG from '../util/const';
import { useTranslation } from "react-i18next";
import { Loading } from './Loading';
import { Info } from './Info';
import NotFound from './NotFound';
import moment from 'moment';
import classnames from 'classnames';
import { request } from '../util/http';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        catalog: state.catalog,
        movie: state.movie
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchMovie: (imdb) => dispatch(fetchMovie(imdb)),
    fetchFavoriteFilm: (user, film) => dispatch(fetchFavoriteFilm(user, film)),
    fetchUpdateFavoriteFilm: (user, film, status, newStatus) => dispatch(fetchUpdateFavoriteFilm(user, film, status, newStatus)),
    fetchComments: (film) => dispatch(fetchComments(film))
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
        if (e.target.value === 'add' || e.target.value === 'none') {
            props.fetchUpdateFavoriteFilm(props.me, props.film, props.favorite, e.target.value);
        }
    }

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Col className="aside-button">
            <Button color="danger"
                value={props.favorite === 'add' ? 'none' : 'add'}
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

function Comments(props) {
    if (props.comments.length > 0) {
        const listItems = props.comments.map((comment, item) =>
            <Media className="mt-2  " key={item}>
                <Media left middle>
                    <Media object src={`${CONFIG.API_URL}/api/image/${comment.displayname}/1`} alt={`Profile photo ${comment.displayname}`} />
                </Media>
                <Media body className="ml-4">

                    <Media heading>
                        <Link to={`/profile/${comment.displayname}`}>
                            {comment.displayname} 
                        </Link>
                        {' '}
                        <span className="movie-tabs-item">{moment(comment.createdat).fromNow()}</span></Media>
                    <p>{comment.comment}</p>
                </Media>
            </Media>
        );
        return (
            <Col className="movie-comments-list">
                {listItems}
            </Col>
        );
    }
    else
        return (
            <span className="font-profile-head font-message">Нет ни одного комментария Nobody had commented</span>
        );
}

const Movie = (props) => {
    const { t, i18n } = useTranslation();
    const { imdb } = useParams();
    const [moviePlayer, togglePlayer] = useState(true);
    const [quality, setQuality] = useState('720');
    const { fetchMovie, fetchFavoriteFilm, fetchComments } = props;
    const { entitle, rutitle, endescription, rudescription,
        engenres, rugenres, entrailer, rutrailer, rate, daterelease, runtime } = props.movie.info;
    const me = props.login.me;

    useEffect(() => {
        fetchMovie(imdb);
        fetchComments(imdb);
        fetchFavoriteFilm(me, imdb);
    }, [fetchMovie, fetchComments, fetchFavoriteFilm, imdb, me]);

    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const [textComment, setComment] = useState('');
    const [message, setMsg] = useState();

    const addComments = () => {
        const data = {
            me: me,
            film: imdb,
            comment: textComment
        }

        setComment('');
        request('/api/movies/movie/comment', data, 'POST')
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    fetchComments(imdb);
                }
            })
            .catch(error => setMsg(error.message));
    }

    const title = (i18n.language === 'en') ? entitle : rutitle;
    const description = (i18n.language === 'en') ? endescription : rudescription;
    const genres = (i18n.language === 'en') ? engenres : rugenres;
    const trailer = (i18n.language === 'en') ? entrailer : rutrailer;

    if (props.movie.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.movie.infoMsg || message) {
        return (
            <Info message={props.movie.infoMsg || message} />
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
                    {/* <Row>
                        <Col>
                            {
                                moviePlayer &&
                                <video key={quality} id="videoPlayer" className="embed-responsive" controls>
                                    <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}/${quality}`} type="video/mp4" />

                                    <track label="English" kind="subtitles" srcLang="en" src="captions/vtt/sintel-en.vtt" default />
                                    <track label="Deutsch" kind="subtitles" srcLang="de" src="captions/vtt/sintel-de.vtt" />
                                    <track label="Español" kind="subtitles" srcLang="es" src="captions/vtt/sintel-es.vtt" />
                                </video>
                            }
                            {
                                !moviePlayer &&
                                <iframe id="videoPlayer" className="embed-responsive" height="420" controls
                                    src={`https://www.youtube.com/embed/${trailer}`}>
                                </iframe>
                            }
                        </Col>
                    </Row> */}
                    <Row className="aside-button">
                        <Options
                            favorite={props.movie.favorite}
                            me={me}
                            film={imdb}
                            fetchUpdateFavoriteFilm={props.fetchUpdateFavoriteFilm}
                            togglePlayer={togglePlayer}
                            setQuality={setQuality}
                        />
                    </Row>

                    <Row className="page-tabs">
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>
                                        {/* {t("profilePage.tabOne")} */}
                                        Описание
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>
                                        {/* {t("profilePage.tabTwo")} */}
                                        Комментарий
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <Col>
                                            <p className="movie-title">Жанр:</p>
                                            <GenreList genres={genres} />
                                            <p className="movie-title">Сюжет:</p>
                                            <p className="movie-description">{description}</p>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row>
                                        <Col className="movie-comment">
                                            <p className="movie-title">Оставьте свой комментарий:</p>
                                            <InputGroup>
                                                <Input name='comment' value={textComment} onChange={e => setComment(e.target.value)} />
                                                <Button color='secondary' onClick={addComments}>Send</Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Comments
                                        me={me}
                                        imdb={imdb}
                                        comments={props.movie.comments} />
                                </TabPane>
                            </TabContent>
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
