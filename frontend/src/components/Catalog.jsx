import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Container, Row, Col, FormGroup, Input, Button, Card, CardBody,
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
import Loading from './Loading';
import Info from './Info';

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

const InputForm = (props) => {
    const { set, name, defaultValue } = props;
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Wrong input');

    const inputChange = (e) => {
        const { name, value } = e.target;

        let isYear = (value.match(/^\d{1,4}$/)) ? true : false;
        let isRate = (parseInt(value) > 0 && parseInt(value) <= 10) ? true : false;

        if (isYear && (name === 'yearfrom' || name === 'yearto')) {
            return (value < 1900 || value > 2021)
                ? (toggleValid('is-invalid'), setFeedback(props.feedback))
                : (toggleValid('is-valid'), set(value));
        }
        else if (isRate && (name === 'ratefrom' || name === 'rateto')) {
            return (parseInt(value) < 0 || parseInt(value) > 10)
                ? (toggleValid('is-invalid'), setFeedback(props.feedback))
                : (toggleValid('is-valid'), set(value));
        }
        else
            toggleValid('is-invalid');
    };

    return (
        <Col sm={6}>
            <Input
                type="number"
                name={name}
                defaultValue={defaultValue}
                onChange={inputChange}
                className={isValid}
            />
            <FormFeedback>{feedback}</FormFeedback>
        </Col>
    )
}

const Filter = (props) => {
    const { t } = props;
    const { setGenres, setSearch, setCatalogSort, catalog, setRateFrom, setRateTo, setYearFrom, setYearTo, initCatalog } = props.filter;
    const [show, setModal] = useState(false);
    const toggleModal = () => setModal(!show);
    const genres = ["action", "adventure", "animation", "comedy", "crime", "documentary",
        "drama", "family", "fantasy", "history", "horror", "music", "mystery", "romance",
        "thriller", "war", "western", "science-fiction"];

    const tagsHandle = (e) => {
        let value = [];

        if (genres.indexOf(e.target.value) > -1) {
            value = Array.from(e.target.selectedOptions, option => option.value);
        }

        setGenres(value);
    }

    const searchFilm = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
    };

    const listGenres = genres.map((genre, item) =>
        < option key={item} value={genre} >
            {
                (genre === 'science-fiction') ? t(`catalogPage.science`) :
                    t(`catalogPage.${genre}`)
            }
        </option>
    )

    return (
        <Row className="catalog-sort-filter">
            <Col xs='9'>
                <Input
                    defaultValue={catalog.search}
                    type="text"
                    placeholder={t("catalogPage.search")}
                    name="search"
                    onChange={searchFilm}
                />
            </Col>

            <Col xs={2}>
                <FormGroup>
                    <Input
                        type="select"
                        onChange={e => { setCatalogSort(e.target.value) }}
                        defaultValue={catalog.sortType}>
                        <option value="rateAsc">{t("catalogPage.rate")} ↑</option>
                        <option value="rateDesc">{t("catalogPage.rate")} ↓</option>
                        <option value="yearAsc">{t("catalogPage.year")} ↑</option>
                        <option value="yearDesc">{t("catalogPage.year")} ↓</option>
                        <option value="nameAsc">{t("catalogPage.name")} ↑</option>
                        <option value="nameDesc">{t("catalogPage.name")} ↓</option>
                    </Input>
                </FormGroup>
            </Col>

            <Col xs={1} className="users-filter">
                <Button
                    type="button"
                    onClick={toggleModal}
                    color="secondary">
                    {t("catalogPage.filter")}
                </Button>
            </Col>

            <Modal isOpen={show}>
                <ModalHeader>
                    <Row>
                        <Col xs={12}>
                            <p>{t("catalogPage.filter")}</p>
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody className="text-center">
                    <Row className="mt-2">
                        <Col xs={12}>
                            <p className="font-profile-head">{t("catalogPage.rate")}</p>
                        </Col>
                        <InputForm
                            name='ratefrom'
                            defaultValue={catalog.rateFrom}
                            set={setRateFrom}
                            feedback={t("inputMsg.rateRange")} />
                        <InputForm
                            name='rateto'
                            defaultValue={catalog.rateTo}
                            set={setRateTo}
                            feedback={t("inputMsg.rateRange")} />
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <p className="font-profile-head">{t("catalogPage.year")}</p>
                        </Col>
                        <InputForm
                            name='yearfrom'
                            defaultValue={catalog.yearFrom}
                            set={setYearFrom}
                            feedback={t("inputMsg.yearRange")} />
                        <InputForm
                            name='yearto'
                            defaultValue={catalog.yearTo}
                            set={setYearTo}
                            feedback={t("inputMsg.yearRange")} />
                    </Row>

                    <Row className="mt-2">
                        <Col xs={12} className="mb-1">
                            <p className="font-profile-head">{t("catalogPage.genre")}</p>
                            <Input type='select' multiple className="text-capitalize" defaultValue={catalog.genres} onChange={e => tagsHandle(e)}>
                                {listGenres}
                            </Input>
                        </Col>
                    </Row>

                    <ModalFooter className="justify-content-between">
                        <Button
                            color="success"
                            onClick={() => { toggleModal(); initCatalog(); }}>
                            {t("catalogPage.clear")}
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>{t("catalogPage.cancel")}</Button>
                    </ModalFooter>
                </ModalBody>
            </Modal>
        </Row>
    );
}

const GenreList = (props) => {
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

const FilmCards = (props) => {
    const { cards, lang } = props;
    let listItems;

    if (cards.length > 0) {
        listItems = props.cards.map((card, item) => {
            const { enposter, ruposter, entitle, rutitle, engenres, rugenres, imdb, rate, year } = card;
            const poster = (lang === 'en') ? enposter : ruposter;
            const title = (lang === 'en') ? entitle : rutitle;
            const genres = (lang === 'en') ? engenres : rugenres;

            return (<Col md={3} key={item}>
                <Link to={`/ movie / ${imdb} `}>
                    <Card className="mb-4 text-center">
                        <CardImg top src={`https://image.tmdb.org/t/p/original/${poster}`} alt={title} />
                        <CardBody>
                            <CardTitle>
                                {title} <Badge color="danger" pill> {rate} </Badge>
                            </CardTitle>
                            <ListGroup flush>
                                <ListGroupItem>{year}</ListGroupItem>
                                <GenreList genres={genres} />
                            </ListGroup>
                        </CardBody>
                    </Card >
                </Link >
            </Col >)
        });
    }
    return (
        <Row>{listItems}</Row>
    );
}

const CardsPagination = (props) => {
    const { cardCount, getPage } = props;
    const countPages = Math.ceil(cardCount / 16);

    if (countPages > 1) {
        let count,
            index,
            pages = [],
            currentPage = Number(getPage);

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
    const { fetchAllCatalog, fetchCatalogCard } = props;
    const { sort, filterStatus, rateFrom, rateTo, yearFrom, yearTo, genres, search, isLoading, infoMsg, info, cardCount } = props.catalog;
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

    if (isLoading) {
        return (
            <Loading />
        );
    }
    else if (infoMsg) {
        return (
            <Info info='message' message={infoMsg} />
        );
    }
    else if (info != null) {
        return (
            <section className="catalog">
                <Container>
                    <Filter filter={props} lang={i18n.language} t={t} />
                    <FilmCards
                        cards={info}
                        lang={i18n.language}
                        t={t} />
                    <CardsPagination getPage={page} cardCount={cardCount} />
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
