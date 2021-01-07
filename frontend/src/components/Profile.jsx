import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Button, Input, Label,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormFeedback
} from 'reactstrap';
import classnames from 'classnames';
import { fetchProfile, fetchViews, fetchComments } from '../redux/profile/ActionCreators';
import {
    setLogin, setFirstName, setLastName, setEmail,
    setAbout, setNewPassword, fetchEditProfile
} from '../redux/edit/ActionCreators';
import { fetchUpdateLogin } from '../redux/login/ActionCreators';
import Loading from './Loading';
import Info from './Info';
import NotFound from './NotFound';
import { request } from '../util/http';
import { useTranslation } from "react-i18next";
import CONFIG from '../util/const';
import { isValidInput, isValidPassword } from '../util/check';
import { ViewsList } from './ViewsList';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        profile: state.profile,
        edit: state.edit
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUpdateLogin: (username) => dispatch(fetchUpdateLogin(username)),
    fetchProfile: (you, me) => dispatch(fetchProfile(you, me)),
    fetchComments: (username) => dispatch(fetchComments(username)),
    fetchViews: (you, me) => dispatch(fetchViews(you, me)),
    setLogin: (login) => dispatch(setLogin(login)),
    setFirstName: (firstName) => dispatch(setFirstName(firstName)),
    setLastName: (lastName) => dispatch(setLastName(lastName)),
    setEmail: (email) => dispatch(setEmail(email)),
    setAbout: (about) => dispatch(setAbout(about)),
    setNewPassword: (newPass) => dispatch(setNewPassword(newPass)),
    fetchEditProfile: (data, username) => dispatch(fetchEditProfile(data, username))
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

const InputForm = (props) => {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Oopsy!');

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'login' || name === 'email' || name === 'lastName' || name === 'firstName'
            || name === 'currentPass' || name === 'newPass') {
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
                            if (result.success !== true) {
                                toggleValid('is-invalid');
                                setFeedback(props.feedback)
                            }
                        })
                }

                if (name !== 'currentPass') {
                    props.set(value);
                }
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
                defaultValue={props.value || ''}
                onChange={inputChange}
                onBlur={props.checkBtn}
                className={isValid}
            />
            <FormFeedback>{feedback}</FormFeedback>
        </div>
    )
}

const EditProfile = (props) => {
    const { t } = useTranslation();
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState();
    const { displayname, firstname, lastname, about, email, provider } = props.info;
    const { setLogin, setFirstName, setLastName, setEmail, setAbout, setNewPassword, fetchEditProfile } = props;

    const toggleModal = () => setModal(!modal);

    const [isActiveBtn, toggleBtn] = useState(true);

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-invalid").length;
        countInvalidInputs === 0 ? toggleBtn(true) : toggleBtn(false);
    }

    const save = () => {
        const { username, firstname, lastname, about, email, newpass } = props.edit;

        const data = {
            displayname: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            about: about,
            newpass: newpass
        }

        fetchEditProfile(data, displayname);
        toggleModal();
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
                        value={displayname}
                        label={t("loginPage.login")}
                        feedback={[t("inputMsg.login.taken"), t("inputMsg.login.invalid")]}
                        set={setLogin}
                        checkBtn={checkBtn} />
                    <InputForm
                        name='firstName'
                        value={firstname}
                        label={t("loginPage.firstName")}
                        feedback={t("inputMsg.text")}
                        set={setFirstName}
                        checkBtn={checkBtn} />
                    <InputForm
                        name='lastName'
                        value={lastname}
                        label={t("loginPage.lastName")}
                        feedback={t("inputMsg.text")}
                        set={setLastName}
                        checkBtn={checkBtn} />
                    <InputForm
                        name='email'
                        value={email}
                        label={t("loginPage.email")}
                        feedback={[t("inputMsg.email.taken"), t("inputMsg.email.invalid")]}
                        set={setEmail}
                        checkBtn={checkBtn}
                        type="email" />
                    <InputForm
                        name='about'
                        value={about}
                        label={t("profilePage.about")}
                        set={setAbout}
                        checkBtn={checkBtn} />

                    {provider === "hypert" &&
                        <InputForm
                            name='currentPass'
                            login={displayname}
                            label={t("profilePage.curpassword")}
                            feedback={t("inputMsg.password.wrong")}
                            checkBtn={checkBtn}
                            type='password' />
                        &&
                        <InputForm
                            name='newPass'
                            label={t("profilePage.newpassword")}
                            set={setNewPassword}
                            feedback={t("inputMsg.password.weak")}
                            checkBtn={checkBtn}
                            type='password' />
                    }
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button color="success" onClick={save} message={message} disabled={!isActiveBtn}>Save</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const AsideButton = (props) => {
    const changeStatus = (e) => {
        if (e.target.value === 'add' || e.target.value === 'remove') {
            const data = {
                me: props.me,
                you: props.name,
                status: e.target.value
            }

            request('/api/user/profile/friends', data, 'POST')
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        props.fetchProfile(props.name, props.me);
                    }
                })
                .catch(error => props.setMsg(error.message));
        }
    }
    if (props.check) {
        const { setLogin, setFirstName, setLastName, setEmail,
            setAbout, setNewPassword, fetchEditProfile, edit } = props;

        return (
            <Row className="aside-button">
                <EditProfile
                    info={props.info}
                    setLogin={setLogin}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setEmail={setEmail}
                    setAbout={setAbout}
                    setNewPassword={setNewPassword}
                    fetchEditProfile={fetchEditProfile}
                    edit={edit}
                />
            </Row>
        );
    }
    else {
        return (
            <Row className="aside-button" >
                <Button color="info"
                    value={props.info.case === 1 ? 'remove' : 'add'}
                    onClick={changeStatus}>
                    {props.info.case === 1 ? props.status[1] : props.status[0]}
                </Button>
            </Row>
        );
    }
}

const Profile = (props) => {
    const { t } = useTranslation();
    const { me } = props.login;
    const { username } = props.match.params;
    const { fetchProfile, fetchViews, fetchComments, setLogin, setFirstName, setLastName,
        setEmail, setAbout, setNewPassword, fetchEditProfile } = props;

    useEffect(() => {
        fetchProfile(username, me);
    }, [fetchProfile, username, me]);

    useEffect(() => {
        fetchViews(username);
    }, [username]);

    useEffect(() => {
        fetchComments(username);
    }, [username]);

    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const [message, setMsg] = useState();

    if (props.profile.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.profile.infoMsg) {
        return (
            <Info info="message" message={props.profile.infoMsg} />
        );
    }
    else if (props.profile.info != null) {
        const { displayname, firstname, lastname, about, provider } = props.profile.info;
        const isMe = (me === username);

        return (
            <section className="profile text-break">
                <Container>
                    {
                        message &&
                        <Info info='alert' message={message} />
                    }
                    <AsideButton
                        check={isMe}
                        info={props.profile.info}
                        status={[t("profilePage.status.add"), t("profilePage.status.remove")]}
                        setLogin={setLogin}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        setEmail={setEmail}
                        setAbout={setAbout}
                        setNewPassword={setNewPassword}
                        fetchEditProfile={fetchEditProfile}
                        provider={provider}
                        edit={props.edit}
                        setMsg={setMsg}
                        me={me}
                        name={username}
                        fetchProfile={fetchProfile}

                    />
                    <Row className="profile-header">
                        <Avatar
                            username={displayname}
                            check={isMe}
                            text={t("profilePage.change")} />
                        <Col ls="9" className="font-profile-head">
                            <h2>{displayname}</h2>
                            <p>{firstname} {lastname}</p>
                            <p>{about}</p>
                        </Col>
                    </Row>

                    <Row className="page-tabs">
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
                                    <ViewsList myviews={props.profile.views} movies />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ViewsList myviews={props.profile.comments} comments />
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
