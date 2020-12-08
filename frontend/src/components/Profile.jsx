import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Alert, Container, Row, Col, Nav, NavItem, NavLink, Card, CardImg, CardBody, TabContent, TabPane, Button, Media, Input, Label,
    UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter,
    FormFeedback
} from 'reactstrap';
import classnames from 'classnames';
import { fetchProfile, fetchView, fetchLike, fetchStatus, fetchUpdateStatus, fetchUpdateView, fetchReport } from '../redux/profile/ActionCreators';
import { fetchUpdateLogin } from '../redux/login/ActionCreators';
import { Loading } from './Loading';
import { Info } from './Info';
import NotFound from './NotFound';
import { request } from '../util/http';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import CONFIG from '../util/const';
import { isValidInput, isValidPassword } from '../util/check';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        profile: state.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUpdateLogin: (username) => dispatch(fetchUpdateLogin(username)),
    fetchProfile: (username) => dispatch(fetchProfile(username))
});

const Avatar = (props) => {
    const { username } = props;
    const [src, setSrc] = useState();

    const putPhoto = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = e.target.files[0].type;
            if (!type.match("image/png") && !type.match("image/jpeg") && !type.match("image/jpg")) {
                alert('Wrong format!');
                return;
            }
            let formData = new FormData();
            formData.append('photo', file);
            request(`${CONFIG.API_URL}/api/image/${username}`, formData, 'POST', 'image')
                .then(data => {
                    if (data) { setSrc(Date.now()) }
                })
                .catch(e => {
                    alert(e.message);
                })
        }
    }

    return (
        <Col className="col-lg-3">
            <img
                src={`${CONFIG.API_URL}/api/image/${props.username}/${src}`}
                alt={`Avatar ${props.username}`}
                className="mx-auto d-block profile-avatar rounded-circle" />
            {
                props.check &&
                <div className="d-flex justify-content-center">
                    <Label className="btn btn-sm btn-success">
                        {props.text}
                        <Input className="profile-input" type="file" onChange={putPhoto} />
                    </Label>
                </div>
            }
        </Col>
    );
}

function InputForm(props) {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Oopsy!');

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'login' || name === 'email' || name === 'lastName' || name === 'firstName' || name === 'currentPass' || name === 'newPass') {
            if (isValidInput(name, value)) {
                toggleValid('is-valid');
                if (name === 'email' || name === 'login') {
                    request(`${CONFIG.API_URL}/api/register/check/${name}/${value}`)
                        .then(res => res.json())
                        .then(result => {
                            if (result.success === true) {
                                toggleValid('is-invalid');
                                setFeedback(props.feedback[0]);
                            }
                        })
                }
                else if (name === 'currentPass') {
                    const data = {
                        login: props.login,
                        password: value
                    };

                    request('/api/register/check/pass', data, 'POST')
                        .then(res => res.json())
                        .then(result => {
                            console.log('h2', result);
                            if (result.success !== true) {
                                toggleValid('is-invalid');
                                setFeedback(props.feedback)
                            }
                        })
                }

                // if (name !== 'currentPass')
                //     props.set(value)
            }
            else {
                toggleValid('is-invalid');
                (name === 'login' || name === 'email') ? setFeedback(props.feedback[1]) : setFeedback(props.feedback);
            }
        }
    };

    return (
        <div>
            <p className="font-profile-head">{props.label}</p>
            <Input
                type={props.type || 'text'}
                placeholder={props.placeholder || ''}
                name={props.name}
                defaultValue={props.me || ''}
                onChange={inputChange}
                onBlur={props.checkBtn}
                className={isValid}
            />
            <FormFeedback>{feedback}</FormFeedback>
        </div>
    )
}

function EditProfile(props) {
    const { t } = useTranslation();
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState();

    const toggleModal = () => setModal(!modal);

    const [isActiveBtn, toggleBtn] = useState(true);

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-invalid").length;
        countInvalidInputs === 0 ? toggleBtn(false) : toggleBtn(true);
    }

    const reportSubmit = () => {
        const data = {
            me: props.me
        }
        // props.fetch(data);
        setModal(!modal);
    }

    return (
        <div>
            <Button
                onClick={toggleModal}
                color="secondary">
                {t("profilePage.editProfile")}
            </Button>

            <Modal isOpen={modal}>
                <ModalHeader>
                    <Row>
                        <Col xs={12}>
                            {t("profilePage.editProfile")}
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <InputForm
                        name='login'
                        // me={props.info.username}
                        label={t("loginPage.login")}
                        feedback={[t("inputMsg.login.taken"), t("inputMsg.login.invalid")]}
                        // set={props.setLogin}
                        checkBtn={checkBtn} />
                    <InputForm
                        name='firstName'
                        // me={props.info.firstname}
                        label={t("loginPage.firstName")}
                        feedback={t("inputMsg.text")}
                        // set={props.setFirstName}
                        checkBtn={checkBtn} />
                    <InputForm
                        name='lastName'
                        // me={props.info.lastname}
                        label={t("loginPage.lastName")}
                        feedback={t("inputMsg.text")}
                        // set={props.setLastName}
                        checkBtn={checkBtn} />
                    <InputForm
                        name='email'
                        // me={props.info.email}
                        label={t("loginPage.email")}
                        feedback={[t("inputMsg.email.taken"), t("inputMsg.email.invalid")]}
                        // set={props.setEmail}
                        checkBtn={checkBtn}
                        type="email" />
                    <InputForm
                        name='about'
                        // me={props.info.about}
                        label={t("profilePage.about")}
                        // set={props.setAbout}
                        checkBtn={checkBtn} />

                    <InputForm
                        name='currentPass'
                        // login={props.info.username}
                        label={t("profilePage.curpassword")}
                        feedback={t("inputMsg.password.wrong")}
                        checkBtn={checkBtn}
                        type='password' />
                    <InputForm
                        name='newPass'
                        label={t("profilePage.newpassword")}
                        // set={props.setNewPassword}
                        feedback={t("inputMsg.password.weak")}
                        checkBtn={checkBtn}
                        type='password' />
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button color="success" onClick={reportSubmit} message={message}>Save</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

function AsideButton(props) {
    const changeStatus = (e) => {
        if (e.target.value === 'add' || e.target.value === 'remove') {
            // props.fetchUpdateStatus(props.me, props.you, props.status, e.target.value);
        }
    }

    if (props.check) {
        return (
            <Row className="aside-button">
                <EditProfile
                    info={props.info}
                />
            </Row>
        );
    }
    else {
        return (
            <Row className="aside-button" >
                <Button color="info"
                    value={props.status === 'add' ? 'remove' : 'add'}
                    onClick={changeStatus}>
                    {props.status === 'add' ? props.status[1] : props.status[0]}
                </Button>
            </Row>
        );
    }
}

const Profile = (props) => {
    const { t } = useTranslation();
    const { me } = props.login;
    const { username } = props.match.params;
    const { fetchProfile } = props;

    useEffect(() => {
        fetchProfile(username);
    }, [username]);

    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    if (props.profile.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.profile.infoMsg) {
        return (
            <Info />
        );
    }
    else if (props.profile.info != null) {
        const isMe = (me === username);

        return (
            <section className="profile text-break">
                <Container>
                    <AsideButton
                        check={isMe}
                        // info={props.login.info}
                        status={[t("profilePage.status.add"), t("profilePage.status.remove")]} />
                    <Row className="profile-header">
                        <Avatar
                            username={username}
                            check={isMe}
                            text={t("profilePage.change")} />
                        <Col ls="9" className="font-profile-head">
                            <h2>{props.profile.info.username}</h2>
                            <p>{props.profile.info.firstname} {props.profile.info.lastname}</p>
                            <p>{props.profile.info.about}</p>
                        </Col>
                    </Row>

                    <Row className="profile-tabs">
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>
                                        {t("profilePage.tabOne")}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>
                                        {t("profilePage.tabTwo")}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => { toggle('3'); }}>
                                        {t("profilePage.tabTree")}
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    {/* <ViewsList myviews={props.profile.views} /> */}
                                </TabPane>
                                <TabPane tabId="2">
                                    {/* <LikesList mylikes={props.profile.likes} /> */}
                                </TabPane>
                                <TabPane tabId="3">
                                    {/* <LikesList mylikes={props.profile.likes} /> */}
                                </TabPane>
                            </TabContent>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
