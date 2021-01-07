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
import 'moment/locale/ru';
import classnames from 'classnames';
import { request } from '../util/http';
import { socket } from "../util/socket";

const like = '/img/like.svg';
const dislike = '/img/dislike.svg';
const book = '/img/book.svg';
const bookfull = '/img/bookfull.svg';
const share = '/img/share.svg';
const movie = '/img/movie.svg';
const gear = '/img/gear.svg';
const imdb_logo = '/img/imdbc.png';
const twitter = '/img/twitter.svg';
const facebook = '/img/facebook.svg';
const vk = '/img/vk.svg';

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

const QualitiesList = (props) => {
    let listItems, last;

    useEffect(() => {
        if (last)
            props.setQuality(last[0]);
    }, []);

    if (props.qualities) {
        last = props.qualities[props.qualities.length - 1];

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

            <button className="aside-button-trailer" onClick={toggleTrailer}>
                <img src={movie} width="30" alt="movie" />
                {props.t("moviePage.playTrailer")}
            </button>
            <Modal className='modalTrailer' isOpen={modalTrailer} toggle={toggleTrailer}>
                <ModalHeader toggle={toggleTrailer}>
                    <p>{props.t("moviePage.trailer")}</p>
                </ModalHeader>
                <ModalBody className="text-center">
                    <iframe id="videoPlayer" className="embed-responsive" height="420" controls
                        src={`https://www.youtube.com/embed/${props.trailer}`}>
                    </iframe>
                </ModalBody>
            </Modal>

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
                    <p>{props.t("moviePage.share")}</p>
                </ModalHeader>
                <ModalBody className="aside-button-share">
                    <a target="_blank" title="facebook" href={`http://www.facebook.com/sharer.php?u=http://localhost:3000/movie/${props.film}&text=True%20story`}>
                        <img src={facebook} alt="fb" />
                        Facebook
                    </a>
                    <a target="_blank" title="twitter" href={`http://twitter.com/share?url=http://localhost:3000/movie/${props.film}&text=True%20story`}>
                        <img src={twitter} alt="tw" />
                        Twitter
                    </a>
                    <a target="_blank" title="vk" href={`http://vk.com/share.php?url=http://localhost:3000/movie/${props.film}&text=True%20story`}>
                        <img src={vk} alt="vk" />
                        VKontakte
                    </a>
                </ModalBody>
            </Modal>
        </Col>
    );
}

const Comments = (props) => {
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

    if (props.comments && props.comments.length > 0) {
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
                        <p className="movie-title">{props.t("moviePage.comment")}</p>
                        <InputGroup>
                            <Input name='comment' value={textComment} onChange={e => setComment(e.target.value)} />
                            <Button color='secondary' onClick={addComments}>{props.t("moviePage.send")}</Button>
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
                        <p className="movie-title">{props.t("moviePage.comment")}</p>
                        <InputGroup>
                            <Input name='comment' value={textComment} onChange={e => setComment(e.target.value)} />
                            <Button color='secondary' onClick={addComments}>{props.t("moviePage.send")}</Button>
                        </InputGroup>
                    </Col>
                </Row>
                <span className="movie-comments-list font-profile-head font-message">{props.t("moviePage.nobody")}</span>
            </div>
        );
}

const CountriesList = (props) => {
    let listItems;

    if (props.countries) {
        listItems = props.countries.map((country, item) =>
            <ListGroupItem className="movie-list" key={item}>
                <Link to="#">{country}</Link>
            </ListGroupItem>
        );
    }
    return (
        <ListGroup horizontal>{listItems}</ListGroup>
    );
}

const GenreList = (props) => {
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

const VideoPlayer = (props) => {
    const { logs, torrents, quality, url, poster, imdb, me, ensubtitle, rusubtitle } = props;
    const [isSub, setSub] = useState(false);
    let index;
    let status;

    torrents.find((item, key) => {
        if (item[0] === quality) {
            index = key;
            return item;
        }
        return false;
    });

    if (logs) {
        status = logs.find((item) => (item.indexOf(quality) > -1) ? item : false);
    }

    const ws = () => socket.emit('movie', [imdb, quality, index, me]);

    useEffect(() => {
        socket.emit('waiters', imdb + quality);

        socket.on('wait_list', (data) => {
            (data[0] === imdb + quality && data[1].indexOf(me) !== -1) ? setSub(true) : setSub(false);
        })

        return () => socket.off('wait_list');

    }, [quality]);

    if (!logs || !status || status.indexOf(quality) === -1) {
        return (
            <Col>
                <p>Movie is not downloaded on server.</p>
                {
                    !isSub &&
                    <button onClick={ws}>Click start to download. Notify when movie will be downloaded</button>
                }
            </Col>
        )
    }
    else if (status.indexOf('downloaded') > 0) {
        return (
            <Col>
                <video key={quality} id="videoPlayer" className="embed-responsive" poster={poster} controls>
                    <source src={`${url}/api/stream/movie/${imdb}/${quality}`} type="video/mp4" />

                    {
                        ensubtitle &&
                        <track label="English" kind="subtitles"
                            srclang="en" src={`${url}/api/stream/subtitle/en/${imdb}`} default />
                    }
                    {
                        rusubtitle &&
                        <track label="Russian" kind="subtitles"
                            srclang="ru" src={`${url}/api/stream/subtitle/ru/${imdb}`} />
                    }
                </video>
            </Col>
        )
    }
    else if (status.indexOf('downloading') > 0) {
        return (
            <Col>
                <p>Movie is downloading on server right now.</p>
                {
                    !isSub &&
                    <button onClick={ws}>Notify when movie will be downloaded</button>
                }
            </Col>
        )
    }


}

const Movie = (props) => {
    const { t, i18n } = useTranslation();
    const { imdb } = useParams();
    const { fetchMovie, fetchFavoriteFilm, fetchComments, setQuality } = props;
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

    if (props.movie.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.movie.info != null) {
        const { entitle, rutitle, endescription, rudescription, torrents, encountries, rucountries,
            engenres, rugenres, entrailer, rutrailer, rate, daterelease, runtime,
            enposter, ruposter, ensubtitle, rusubtitle, logs } = props.movie.info;

        const title = (i18n.language === 'en') ? entitle : rutitle;
        const description = (i18n.language === 'en') ? endescription : rudescription;
        const genres = (i18n.language === 'en') ? engenres : rugenres;
        const trailer = (i18n.language === 'en') ? entrailer : rutrailer;
        const countries = (i18n.language === 'en') ? encountries : rucountries;
        const poster = (i18n.language === 'en') ? enposter : ruposter;

        (i18n.language === 'en') ? moment.locale('en') : moment.locale('ru');

        return (
            <section className="movie text-break">
                <Container>
                    {
                        (message || props.movie.favoriteMsg) &&
                        <Info info='alert' message={message || props.movie.favoriteMsg} />
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
                        <VideoPlayer
                            quality={props.movie.quality}
                            logs={logs}
                            torrents={torrents}
                            imdb={imdb}
                            poster={`https://image.tmdb.org/t/p/original/${poster}`}
                            url={CONFIG.API_URL}
                            me={me}
                            ensubtitle={ensubtitle}
                            rusubtitle={ensubtitle}
                        />
                    </Row>
                    <Row className="aside-button">
                        {/* <Row > */}
                        <Options
                            favorite={props.movie.favorite}
                            me={me}
                            film={imdb}
                            trailer={trailer}
                            quality={props.movie.quality}
                            qualities={torrents}
                            t={t}
                            fetchUpdateFavoriteFilm={props.fetchUpdateFavoriteFilm}
                            setQuality={setQuality}
                        />
                    </Row>

                    <Row className="page-tabs">
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>
                                        {t("moviePage.tabOne")}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>
                                        {t("moviePage.tabTwo")}
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <Col>
                                            <p className="movie-title">
                                                {t("moviePage.release")}
                                                <span className="movie-description">{moment(daterelease).format('LL')}</span>
                                            </p>

                                            <p className="movie-title">
                                                {t("moviePage.runtime")}
                                                <span className="movie-description">{runtime} {t("moviePage.min")}</span>
                                            </p>

                                            <p className="movie-title">
                                                {t("moviePage.genres")}
                                            </p>
                                            <GenreList genres={genres} />

                                            <p className="movie-title">
                                                {t("moviePage.country")}
                                            </p>
                                            <CountriesList countries={countries} />

                                            <p className="movie-title">
                                                {t("moviePage.story")}
                                            </p>
                                            <p className="movie-description">{description}</p>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Comments
                                        me={me}
                                        imdb={imdb}
                                        comments={props.movie.comments}
                                        t={t}
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
