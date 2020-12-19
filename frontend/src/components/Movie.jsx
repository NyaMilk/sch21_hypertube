import React, { useState, useEffect } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import {
    Container, Row, Col, ListGroup, ListGroupItem, Button,
    DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown, Input, Nav, NavItem, NavLink, TabContent, TabPane, InputGroup, Media, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { connect } from 'react-redux';
import { fetchMovie, fetchFavoriteFilm, fetchUpdateFavoriteFilm, fetchComments, setQuality } from '../redux/movie/ActionCreators';
import CONFIG from '../util/const';
import { useTranslation } from "react-i18next";
import { Loading } from './Loading';
import { Info } from './Info';
import NotFound from './NotFound';
import moment from 'moment';
import classnames from 'classnames';
import { request } from '../util/http';

const like = '/img/like.svg';
const dislike = '/img/dislike.svg';
const book = '/img/book.svg';
const bookfull = '/img/bookfull.svg';
const share = '/img/share.svg';
const movie = '/img/movie.svg';
const gear = '/img/gear.svg';
const imdb_logo = '/img/imdbc.png';

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
    fetchComments: (me, film) => dispatch(fetchComments(me, film)),
    setQuality: (quality) => dispatch(setQuality(quality))
});


function QualitiesList(props) {
    let listItems;
    let last = props.qualities[props.qualities.length - 1];

    useEffect(() => {
        props.setQuality(last[0]);
    }, []);

    if (props.qualities) {
        listItems = props.qualities.map((quality, item) =>
            <DropdownItem key={item} onClick={() => props.setQuality(quality[0])}>
                {quality[0]}
            </DropdownItem>
        )
    }
    return (
        <DropdownMenu >
            {listItems}
        </DropdownMenu>
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
    const [modalShare, setShare] = useState(false);
    const [modalTrailer, setTrailer] = useState(false);
    const toggleShare = () => setShare(!modalShare);
    const toggleTrailer = () => setTrailer(!modalTrailer);
    return (

        <Col className="aside-button">
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle id="btn-quality">
                    <img src={gear} width='30' alt="Quality" />
                    {props.quality}
                </DropdownToggle>
                <QualitiesList qualities={props.qualities} setQuality={props.setQuality} />
            </ButtonDropdown>

            <input
                type="image"
                value={props.favorite === 'add' ? 'none' : 'add'}
                onClick={changeFilmList}
                src={props.favorite === 'add' ? bookfull : book}
                width='30'
                alt="favorite" />

            <input
                type="image"
                onClick={toggleShare}
                src={share}
                width='30'
                alt="share" />
            <Modal isOpen={modalShare} toggle={toggleShare} >
                <ModalHeader toggle={toggleShare}>
                    <p>Share</p>
                </ModalHeader>
                <ModalBody className="text-center">
                </ModalBody>
            </Modal>

            <input
                type="image"
                onClick={toggleTrailer}
                src={movie}
                width='30'
                alt="movie" />
            <Modal className='modalTrailer' isOpen={modalTrailer} toggle={toggleTrailer}>
                <ModalHeader toggle={toggleTrailer}>
                    <p>Trailer</p>
                </ModalHeader>
                <ModalBody className="text-center">
                    <iframe id="videoPlayer" className="embed-responsive" height="420" controls
                        src={`https://www.youtube.com/embed/${props.trailer}`}>
                    </iframe>
                </ModalBody>
            </Modal>
        </Col>
    );
}

function Comments(props) {
    const { me, imdb, setMsg, fetchComments } = props;
    const [textComment, setComment] = useState('');

    const addComments = () => {
        let comment = textComment.trim();

        const data = {
            me: me,
            film: imdb,
            comment: comment
        }

        setComment('');
        if (comment !== '') {
            request('/api/movies/movie/comment', data, 'POST')
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        fetchComments(me, imdb);
                    }
                })
                .catch(error => setMsg(error.message));
        }
    }

    const setLike = (e, idComment) => {
        const data = {
            me: me,
            idComment: idComment,
            status: e.target.name
        }

        request('/api/movies/movie/comment/like', data, 'POST')
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    fetchComments(me, imdb);
                }
            })
            .catch(error => setMsg(error.message));
    }
    if (props.comments.length > 0) {
        const listItems = props.comments.map((comment, item) =>
            <Media className="mt-2" key={item}>
                <Media left middle>
                    <Media object src={`${CONFIG.API_URL}/api/image/${comment.displayname}/1`} alt={`Profile photo ${comment.displayname}`} />
                </Media>
                <Media body className="ml-4">
                    <Media heading>
                        <div className="movie-comment-header">
                            <Link to={`/profile/${comment.displayname}`}>
                                {comment.displayname}
                            </Link>
                            {' '}
                            <span className="movie-tabs-item">{moment(comment.createdat).fromNow()}</span>
                        </div>
                        <div className="movie-comment-footer">
                            <input
                                type="image"
                                className={comment.status === 'like' ? 'opacity-button' : ''}
                                name='like'
                                onClick={e => setLike(e, comment.id)}
                                src={like} alt="like" />
                            <span>{comment.count}</span>
                            <input
                                type="image"
                                className={comment.status === 'dislike' ? 'opacity-button' : ''}
                                name='dislike'
                                onClick={e => setLike(e, comment.id)}
                                src={dislike} alt="dislike" />
                        </div>
                    </Media>
                    <p>{comment.comment}</p>
                </Media>
            </Media>
        );
        return (
            <div>
                <Row>
                    <Col className="movie-comment">
                        <p className="movie-title">Оставьте свой комментарий:</p>
                        <InputGroup>
                            <Input name='comment' value={textComment} onChange={e => setComment(e.target.value)} />
                            <Button color='secondary' onClick={addComments}>Send</Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Col className="movie-comments-list">
                    {listItems}
                </Col>
            </div>
        );
    }
    else
        return (
            <div>

                <Row>
                    <Col className="movie-comment">
                        <p className="movie-title">Оставьте свой комментарий:</p>
                        <InputGroup>
                            <Input name='comment' value={textComment} onChange={e => setComment(e.target.value)} />
                            <Button color='secondary' onClick={addComments}>Send</Button>
                        </InputGroup>
                    </Col>
                </Row>
                <span className="movie-comments-list font-profile-head font-message">Нет ни одного комментария Nobody had commented</span>
            </div>
        );
}

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

const Movie = (props) => {
    const { t, i18n } = useTranslation();
    const { imdb } = useParams();
    const { fetchMovie, fetchFavoriteFilm, fetchComments, setQuality } = props;
    const { entitle, rutitle, endescription, rudescription, torrents,
        engenres, rugenres, entrailer, rutrailer, rate, daterelease, runtime, enposter, ruposter } = props.movie.info;
    const me = props.login.me;

    const [message, setMsg] = useState();

    useEffect(() => {
        fetchMovie(imdb);
        fetchComments(me, imdb);
        fetchFavoriteFilm(me, imdb);
    }, [fetchMovie, fetchComments, fetchFavoriteFilm, imdb, me]);

    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const title = (i18n.language === 'en') ? entitle : rutitle;
    const description = (i18n.language === 'en') ? endescription : rudescription;
    const genres = (i18n.language === 'en') ? engenres : rugenres;
    const trailer = (i18n.language === 'en') ? entrailer : rutrailer;
    const poster = (i18n.language === 'en') ? enposter : ruposter;

    if (props.movie.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.movie.infoMsg) {
        return (
            <Info info='message' message={props.movie.infoMsg} />
        );
    }
    else if (props.movie.info != null) {
        return (
            <section className="movie text-break">
                <Container>
                    {
                        message &&
                        <Info info='alert' message={message} />
                    }
                    <Row className="movie-header">
                        <Col>
                            <div className="font-movie-head">
                                <h2>
                                    {title}
                                </h2>
                                <div>
                                    <img src={imdb_logo} height="40" alt="IMDb logo" />
                                    <p> {rate}</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <video key={props.movie.quality} id="videoPlayer" className="embed-responsive" poster={`https://image.tmdb.org/t/p/original/${poster}`} controls>
                                <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}/${props.movie.quality}`} type="video/mp4" />

                                {/* <track label="English" kind="subtitles" srcLang="en" src="captions/vtt/sintel-en.vtt" default />
                                <track label="Deutsch" kind="subtitles" srcLang="de" src="captions/vtt/sintel-de.vtt" />
                                <track label="Español" kind="subtitles" srcLang="es" src="captions/vtt/sintel-es.vtt" /> */}
                            </video>

                        </Col>
                    </Row>
                    <Row className="aside-button">
                        <Options
                            favorite={props.movie.favorite}
                            me={me}
                            film={imdb}
                            trailer={trailer}
                            quality={props.movie.quality}
                            qualities={torrents}
                            fetchUpdateFavoriteFilm={props.fetchUpdateFavoriteFilm}
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
                                            <p className="movie-title">
                                                Год:
                                                <span className="movie-description">{moment(daterelease).year()}</span>
                                            </p>

                                            <p className="movie-title">
                                                Продолжительность:
                                                <span className="movie-description">{runtime} min</span>
                                            </p>

                                            <p className="movie-title">Жанр:</p>
                                            <GenreList genres={genres} />


                                            <p className="movie-title">Сюжет:</p>
                                            <p className="movie-description">{description}</p>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Comments
                                        me={me}
                                        imdb={imdb}
                                        comments={props.movie.comments}
                                        setMsg={setMsg}
                                        fetchComments={fetchComments} />
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
