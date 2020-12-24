import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Nav, Container, Row, Col, FormGroup, Input, Button, Card, CardBody,
    CardImg, CardTitle, Badge, ListGroup, ListGroupItem, Pagination, PaginationItem,
    PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter,
    FormFeedback
} from 'reactstrap';
import { setUser } from '../redux/login/ActionCreators';
import {
    fetchAllCatalog, fetchCatalogCard,
    initCatalog, setCatalogSort, setYearFrom, setYearTo,
    setRateFrom, setRateTo, setGenres, setSearch
} from '../redux/catalog/ActionCreators';
import { useTranslation } from "react-i18next";
import { Loading } from './Loading';
import { Info } from './Info';


const mapStateToProps = (state) => {
    return {
        login: state.login,
        catalog: state.catalog
    }
}

const mapDispatchToProps = (dispatch) => ({
    setUser: (username) => dispatch(setUser(username)),
    fetchAllCatalog: (sort) => dispatch(fetchAllCatalog(sort)),
    fetchCatalogCard: (sort, lang) => dispatch(fetchCatalogCard(sort, lang)),
    initCatalog: () => dispatch(initCatalog()),
    setCatalogSort: (sort) => dispatch(setCatalogSort(sort)),
    setYearFrom: (yearFrom) => dispatch(setYearFrom(yearFrom)),
    setYearTo: (yearTo) => dispatch(setYearTo(yearTo)),
    setRateFrom: (rateFrom) => dispatch(setRateFrom(rateFrom)),
    setRateTo: (rateTo) => dispatch(setRateTo(rateTo)),
    setGenres: (genres) => dispatch(setGenres(genres)),
    setSearch: (search) => dispatch(setSearch(search))
});

function InputForm(props) {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Oopsy!');

    const inputChange = (e) => {
        const { name, value } = e.target;

        let isYear = (value.match(/^\d{1,4}$/)) ? true : false;
        let isRate = (parseInt(value) > 0 && parseInt(value) < 10) ? true : false;

        /* мб сделать select? для года, жанра, страны */
        if (isYear) {
            if (name === 'yearfrom' || name === 'yearto') {
                return (value < 1900 || value > 2021)
                    ? (toggleValid('is-invalid'), setFeedback(props.feedback))
                    : (toggleValid('is-valid'), props.set(value));
            }
        }
        if (isRate) {
            if (name === 'ratefrom' || name === 'rateto') {
                return (value < 0 || value > 10)
                    ? (toggleValid('is-invalid'), setFeedback(props.feedback))
                    : (toggleValid('is-valid'), props.set(value));
            }
        }
        else
            toggleValid('is-invalid');
    };

    const checkInput = () => {
        props.setStatusButton((document.querySelectorAll(".is-invalid").length > 0) ? false : true);
    }

    return (
        <Col sm={6}>
            <Input
                type="number"
                name={props.name}
                defaultValue={props.defaultValue}
                onChange={inputChange}
                className={isValid}
                onBlur={checkInput}
            />
            <FormFeedback>{feedback}</FormFeedback>
        </Col>
    )
}

function Filter(props) {
    const [show, setModal] = useState(false);
    const toggleModal = () => setModal(!show);

    const [isValidInput, setStatusButton] = useState(true);

    const tagsHandle = (e) => {
        let value = [];

        if (e.target.value === "action" || e.target.value === "adventure" || e.target.value === "animation" || e.target.value === "comedy" ||
            e.target.value === "crime" || e.target.value === "documentary" || e.target.value === "drama" || e.target.value === "family" ||
            e.target.value === "fantasy" || e.target.value === "history" || e.target.value === "horror" || e.target.value === "music" ||
            e.target.value === "mystery" || e.target.value === "romance" || e.target.value === "thriller" || e.target.value === "war" ||
            e.target.value === "western" || e.target.value === "tv movie" || e.target.value === "science fiction") {
            value = Array.from(e.target.selectedOptions, option => option.value);
        }

        props.filter.setGenres(value);
    }

    const searchFilm = (e) => {
        const value = e.target.value.toLowerCase();

        // const filter = props.filter.catalog.info.filter(film => {
        //     return film.title.toLowerCase().includes(value);
        // });
        // console.log("filter", filter);

        console.log(value);
        props.filter.setSearch(value);
    };

    return (
        <Nav expand="lg" color="light">
            <Row className="catalog-sort-filter">
                <Col xs='9'>
                    <Input
                        defaultValue={props.filter.catalog.search}
                        type="text"
                        placeholder={props.t("catalogPage.search")}
                        name="search"
                        onChange={searchFilm}
                    />
                </Col>

                <Col xs={2}>
                    <FormGroup>
                        <Input
                            type="select"
                            onChange={e => { props.filter.setCatalogSort(e.target.value) }}
                            defaultValue={props.filter.catalog.sortType}>
                            <option value="rateAsc">{props.t("catalogPage.rate")} ↑</option>
                            <option value="rateDesc">{props.t("catalogPage.rate")} ↓</option>
                            <option value="yearAsc">{props.t("catalogPage.year")} ↑</option>
                            <option value="yearDesc">{props.t("catalogPage.year")} ↓</option>
                            <option value="nameAsc">{props.t("catalogPage.name")} ↑</option>
                            <option value="nameDesc">{props.t("catalogPage.name")} ↓</option>
                        </Input>
                    </FormGroup>
                </Col>

                <Col xs={1} className="users-filter">
                    <Button
                        type="button"
                        onClick={toggleModal}
                        color="secondary">
                        {props.t("catalogPage.filter")}
                    </Button>
                </Col>

                <Modal isOpen={show}>
                    <ModalHeader>
                        <Row>
                            <Col xs={12}>
                                <p>{props.t("catalogPage.filter")}</p>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody className="text-center">
                        <Row className="mt-2">
                            <Col xs={12}>
                                <p className="font-profile-head">{props.t("catalogPage.rate")}</p>
                            </Col>
                            <InputForm
                                name='ratefrom'
                                defaultValue={props.filter.catalog.rateFrom}
                                set={props.filter.setRateFrom}
                                setStatusButton={setStatusButton}
                                feedback={props.t("inputMsg.rateRange")} />
                            <InputForm
                                name='rateto'
                                defaultValue={props.filter.catalog.rateTo}
                                set={props.filter.setRateTo}
                                setStatusButton={setStatusButton}
                                feedback={props.t("inputMsg.rateRange")} />
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <p className="font-profile-head">{props.t("catalogPage.year")}</p>
                            </Col>
                            <InputForm
                                name='yearfrom'
                                defaultValue={props.filter.catalog.yearFrom}
                                set={props.filter.setYearFrom}
                                setStatusButton={setStatusButton}
                                feedback={props.t("inputMsg.yearRange")} />
                            <InputForm
                                name='yearto'
                                defaultValue={props.filter.catalog.yearTo}
                                set={props.filter.setYearTo}
                                setStatusButton={setStatusButton}
                                feedback={props.t("inputMsg.yearRange")} />
                        </Row>

                        <Row className="mt-2">
                            <Col xs={12} className="mb-1">
                                <p className="font-profile-head">{props.t("catalogPage.genre")}</p>
                                <Input type='select' multiple className="text-capitalize" defaultValue={props.filter.catalog.genres} onChange={e => tagsHandle(e)}>
                                    <option value="action">{props.t("catalogPage.action")}</option>
                                    <option value="adventure">{props.t("catalogPage.adventure")}</option>
                                    <option value="animation">{props.t("catalogPage.animation")}</option>
                                    <option value="comedy">{props.t("catalogPage.comedy")}</option>
                                    <option value="crime">{props.t("catalogPage.crime")}</option>
                                    <option value="documentary">{props.t("catalogPage.documentary")}</option>
                                    <option value="drama">{props.t("catalogPage.drama")}</option>
                                    <option value="family">{props.t("catalogPage.family")}</option>
                                    <option value="fantasy">{props.t("catalogPage.fantasy")}</option>
                                    <option value="history">{props.t("catalogPage.history")}</option>
                                    <option value="horror">{props.t("catalogPage.horror")}</option>
                                    <option value="music">{props.t("catalogPage.music")}</option>
                                    <option value="mystery">{props.t("catalogPage.mystery")}</option>
                                    <option value="romance">{props.t("catalogPage.romance")}</option>
                                    <option value="thriller">{props.t("catalogPage.thriller")}</option>
                                    <option value="war">{props.t("catalogPage.war")}</option>
                                    <option value="western">{props.t("catalogPage.western")}</option>
                                    <option value="tv movie">{props.t("catalogPage.tv")}</option>
                                    <option value="science fiction">{props.t("catalogPage.science")}</option>
                                </Input>
                            </Col>
                        </Row>

                        <ModalFooter className="justify-content-between">
                            <Button
                                color="success"
                                // className={isValidInput ? '' : 'disabled-button'}
                                onClick={() => { toggleModal(); props.filter.initCatalog(); }}>
                                {props.t("catalogPage.clear")}
                            </Button>
                            <Button color="secondary" onClick={toggleModal}>{props.t("catalogPage.cancel")}</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            </Row>
        </Nav>
    );
}

function GenreList(props) {
    let listItems;
    if (props.genres) {
        listItems = props.genres.map((genre, item) =>
            <span key={item}>{genre}{' '}</span>
        );
    }
    return (
        <ListGroupItem className="movie-list">{listItems}</ListGroupItem>
    );
}

function FilmCards(props) {
    let listItems;
    console.log("props", props);

    if (props.cards.length > 0) {
        listItems = props.cards.map((card, item) => {
            const poster = (props.lang === 'en') ? card.enposter : card.ruposter;
            const title = (props.lang === 'en') ? card.entitle : card.rutitle;
            const genres = (props.lang === 'en') ? card.engenres : card.rugenres;

            return (<Col md={3} key={item}>
                <Link to={`/movie/${card.imdb}`}>
                    <Card className="mb-4 text-center">
                        <CardImg top src={`https://image.tmdb.org/t/p/original/${poster}`} alt={title} />
                        <CardBody>
                            <CardTitle>
                                {title} <Badge color="danger" pill> {card.rate} </Badge>
                            </CardTitle>
                            <ListGroup flush>
                                <ListGroupItem>{card.year}</ListGroupItem>
                                <GenreList genres={genres} />
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Link>
            </Col>)
        });
    }
    return (
        <Row>{listItems}</Row>
    );
}

function CardsPagination(props) {
    const countPages = Math.ceil(props.cardCount / 16);

    if (countPages > 1) {
        let count,
            index,
            pages = [],
            currentPage = Number(props.getPage);

        if (currentPage === 1 && countPages !== 2) {
            count = currentPage + 2;
            index = currentPage;
        }
        else if (currentPage === 1 && countPages === 2) {
            count = currentPage + 1;
            index = currentPage;
        }
        else if (currentPage === 2 && countPages === 2) {
            count = currentPage;
            index = currentPage - 1;
        }
        else {
            count = currentPage + 1;
            index = currentPage - 1;
        }
        if (currentPage === countPages && countPages !== 2) {
            count = currentPage;
            index = currentPage - 2;
        }

        for (index; index <= count; index++) {
            pages.push(index);
        }

        const listItems = pages.map((page, item) =>
            <PaginationItem key={item} className={page === currentPage ? 'active-link' : ''}>
                <PaginationLink href={`/catalog/page/${page}`}>
                    {page}
                </PaginationLink>
            </PaginationItem>
        );

        return (
            <Pagination className="catalog-pagination">
                {
                    countPages > 3 &&
                    <PaginationItem>
                        <PaginationLink first href="/catalog/page/1" />
                    </PaginationItem>
                }

                {listItems}

                {
                    countPages > 3 &&
                    <PaginationItem>
                        <PaginationLink last href={`/catalog/page/${countPages}`} />
                    </PaginationItem>
                }
            </Pagination>
        );
    }
    else
        return (<div></div>);
}

const Catalog = (props) => {
    const { t, i18n } = useTranslation();
    const { page } = props.match.params;
    const { fetchAllCatalog, fetchCatalogCard, fetchEnAllGenres, fetchRuAllGenres } = props;
    const { sort, filterStatus, rateFrom, rateTo, yearFrom, yearTo, genres, search } = props.catalog;
    // const { enposter, ruposter, entitle, rutitle, engenres, rugenres } = props.catalog.info;
    // const { nickname } = props.login.me;
    const lang = i18n.language;

    useEffect(() => {
        const data = {
            sort,
            rateFrom,
            rateTo,
            yearFrom,
            yearTo,
            genres,
            search,
            page
        }

        if (page > 0) {
            fetchAllCatalog(data);
            fetchCatalogCard(data, lang);
        }
    }, [fetchAllCatalog, fetchCatalogCard, page, sort, filterStatus, rateFrom, rateTo, yearFrom, yearTo, genres, search, lang]);

    if (props.catalog.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.catalog.infoMsg) {
        return (
            <Info info='message' message={props.catalog.infoMsg} />
        );
    }
    else if (props.catalog.info != null) {
        return (
            <section className="catalog">
                <Container>
                    <Filter filter={props} lang={i18n.language} t={t} />
                    <FilmCards
                        cards={props.catalog.info}
                        lang={i18n.language}
                        t={t} />
                    <CardsPagination getPage={page} cardCount={props.catalog.cardCount} />
                </Container>
            </section>
        );
    }
    else
        return (
            <section className="catalog">
                <Container>
                    <Filter filter={props} lang={i18n.language} t={t} />
                    <span className="font-profile-head font-message">{t("catalogPage.not")}</span>
                </Container>
            </section>
        );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Catalog));
