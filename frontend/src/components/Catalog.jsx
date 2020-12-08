import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Nav, Container, Row, Col, FormGroup, Input, Button, Card, CardBody, CardImg, CardTitle, Badge,
    ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter,
    FormFeedback
} from 'reactstrap';
import { setUser } from '../redux/login/ActionCreators';
import {
    fetchAllCatalog, fetchCatalogCard, initCatalog, setCatalogSort,
    setYearFrom, setYearTo, setRateFrom, setRateTo, setGenres, setSearch
} from '../redux/catalog/ActionCreators';
import { useTranslation } from "react-i18next";
import { Loading } from './Loading';
import { Info } from './Info';

const testImg = "/img/0.jpg";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        catalog: state.catalog
    }
}

const mapDispatchToProps = (dispatch) => ({
    setUser: (username) => dispatch(setUser(username)),
    fetchAllCatalog: (sort) => dispatch(fetchAllCatalog(sort)),
    fetchCatalogCard: (page, sort) => dispatch(fetchCatalogCard(page, sort)),
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
        let isRate = (Number.isInteger(parseInt(value))) ? true : false; 

        /* мб сделать select? для года, жанра, страны */
        if (isYear) {
            if (name === 'yearfrom') {
                return (value < 1900 || value > 2021)
                    ? (toggleValid('is-invalid'), setFeedback(props.feedback))
                    : (toggleValid('is-valid'), props.set(value));
            }
            if (name === 'yearto') {
                return (value < 1900 || value > 2021)
                    ? (toggleValid('is-invalid'), setFeedback(props.feedback))
                    : (toggleValid('is-valid'), props.set(value));
            }
        }
        if (isRate) {
            if (name === 'ratefrom') {
                return (value < 0 || value > 10)
                    ? (toggleValid('is-invalid'), setFeedback("Age range 18 - 130 only"))
                    : (toggleValid('is-valid'), props.set(value));
            }
            if (name === 'rateto') {
                return (value < 0 || value > 10)
                    ? (toggleValid('is-invalid'), setFeedback("Age range 18 - 130 only"))
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
            {/* <FormGroup> */}
            <Input
                type="number"
                name={props.name}
                defaultValue={props.defaultValue}
                onChange={inputChange}
                className={isValid}
                onBlur={checkInput}
            />
            <FormFeedback>{feedback}</FormFeedback>
            {/* </FormGroup> */}
        </Col>
    )
}

function Filter(props) {
    const { t } = useTranslation();
    const [show, setModal] = useState(false);
    const toggleModal = () => setModal(!show);

    const [isValidInput, setStatusButton] = useState(true);

    const tagsHandle = (e) => {
        let value = [];

        if (e.target.value) {
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

        props.filter.setSearch(value);
    };

    return (
        <Nav expand="lg" color="light">

            <Input
                defaultValue={props.filter.catalog.search}
                type="text"
                // className="form-control"
                placeholder="Search"
                onChange={searchFilm}
            />

            <Row className="catalog-sort-filter">
                <Col xs={6}>
                    <FormGroup>
                        <Input
                            type="select"
                            onChange={e => { props.filter.setCatalogSort(e.target.value) }}
                            defaultValue={props.filter.catalog.sortType}>
                            <option value="rateAsc">Rate ↑</option>
                            <option value="rateDesc">Rate ↓</option>
                            <option value="yearAsc">Year ↑</option>
                            <option value="yearDesc">Year ↓</option>
                        </Input>
                    </FormGroup>
                </Col>

                <Col xs={4} className="users-filter">
                    <Button
                        type="button"
                        onClick={toggleModal}
                        color="secondary">
                        Filters
                    </Button>
                </Col>

                <Modal isOpen={show}>
                    <ModalHeader>
                        <Row>
                            <Col xs={12}>
                                <p>Filters</p>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody className="text-center">
                        <Row className="mt-2">
                            <Col xs={12}>
                                <p className="font-profile-head">Rate</p>
                            </Col>
                            <InputForm
                                name='ratefrom'
                                defaultValue={props.filter.catalog.rateFrom}
                                set={props.filter.setRateFrom}
                                setStatusButton={setStatusButton} />
                            <InputForm
                                name='rateto'
                                defaultValue={props.filter.catalog.rateTo}
                                set={props.filter.setRateTo}
                                setStatusButton={setStatusButton} />
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <p className="font-profile-head">Year</p>
                            </Col>
                            <InputForm
                                name='yearfrom'
                                defaultValue={props.filter.catalog.yearFrom}
                                set={props.filter.setYearFrom}
                                setStatusButton={setStatusButton}
                                feedback={t("inputMsg.yearRange")} />
                            <InputForm
                                name='yearto'
                                defaultValue={props.filter.catalog.yearTo}
                                set={props.filter.setYearTo}
                                setStatusButton={setStatusButton}
                                feedback={t("inputMsg.yearRange")} />
                        </Row>

                        {/* <Row className="mt-2">
                            <Col xs={12} className="mb-1">
                                <p className="font-profile-head">Tags</p>
                                <Input type='select' multiple defaultValue={props.filter.filter.tags} onChange={e => tagsHandle(e)}>
                                    <option value="sport">sport</option>
                                    <option value="movie">movie</option>
                                    <option value="food">food</option>
                                    <option value="art">art</option>
                                    <option value="travel">travel</option>
                                    <option value="dance">dance</option>
                                    <option value="animal">animal</option>
                                </Input>
                            </Col>
                        </Row> */}

                        <ModalFooter className="justify-content-between">
                            <Button
                                color="success"
                                // className={isValidInput ? '' : 'disabled-button'}
                                onClick={() => { toggleModal(); props.filter.initCatalog(); }}>
                                Clear
                            </Button>
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
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
            <span key={item}>{genre}</span>
        );
    }
    return (
        <ListGroupItem>{listItems}</ListGroupItem>
    );
}

function FilmCards(props) {
    let listItems;
    if (props.cards.length > 0) {
        listItems = props.cards.map((card, item) =>
            <Col md={4} key={item}>
                <Link to={`/movie/${card.imdb}`}>
                    <Card className="mb-4 text-center">
                        {/* <CardImg width="100%" top src={`/api/image/${card.nickname}/1/${card.photos}`} alt={`Profile photo ${card.nickname}`} /> */}
                        {/* Подумать еще над языком */}
                        <CardImg width="100%" top src={`https://image.tmdb.org/t/p/original${eval(`card.${props.language}poster`)}`} alt={card.title} />
                        <CardBody>
                            <CardTitle>
                                {card.title} <Badge color="danger" pill> {card.rate} </Badge>
                            </CardTitle>
                            <ListGroup flush>
                                <ListGroupItem>{card.year}</ListGroupItem>
                                <GenreList genres={card.genres} />
                            </ListGroup>

                        </CardBody>
                    </Card>
                </Link>
            </Col>
        );
    }
    return (
        <Row>{listItems}</Row>
    );
}

function CardsPagination(props) {
    const countPages = Math.ceil(props.cardCount / 9);

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
    const { fetchAllCatalog, fetchCatalogCard } = props;
    const { sort, filterStatus, rateFrom, rateTo, yearFrom, yearTo, genres, search } = props.catalog;
    // const { nickname } = props.login.me;

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
            fetchCatalogCard(data);
        }
    }, [fetchAllCatalog, fetchCatalogCard, page, sort, filterStatus, rateFrom, rateTo, yearFrom, yearTo, genres, search]);

    console.log("props ", props);


    if (props.catalog.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.catalog.infoMsg) {
        return (
            <Info />
        );
    }
    else if (props.catalog.info != null) {
        return (
            <section className="catalog">
                <Container>
                    <Filter filter={props} />
                    <FilmCards cards={props.catalog.info} language={i18n.language}/>
                    <CardsPagination getPage={page} cardCount={props.catalog.cardCount} />
                </Container>
            </section>
        );
    }
    else
        return (
            <section className="catalog">
                <Container>
                    <Filter filter={props} />
                    <span className="font-profile-head font-message">Not found :C</span>
                </Container>
            </section>
        );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Catalog));
