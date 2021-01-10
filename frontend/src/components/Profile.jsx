import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Button, Input, Label,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormFeedback
} from 'reactstrap';
import classnames from 'classnames';
import { fetchProfile, fetchViews, fetchComments, fetchFriends } from '../redux/profile/ActionCreators';
import {
    setLogin, setFirstName, setLastName, setEmail,
    setAbout, setNewPassword, fetchEditProfile, editProfileStatus
} from '../redux/edit/ActionCreators';
import Loading from './Loading';
import Info from './Info';
import NotFound from './NotFound';
import { request } from '../util/http';
import { useTranslation } from "react-i18next";
import { isValidInput } from '../util/check';
import { ViewsList } from './ViewsList';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        profile: state.profile,
        edit: state.edit
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchProfile: (you, me) => dispatch(fetchProfile(you, me)),
    fetchComments: (username) => dispatch(fetchComments(username)),
    fetchFriends: (username) => dispatch(fetchFriends(username)),
    fetchViews: (you, me) => dispatch(fetchViews(you, me)),
    setLogin: (login) => dispatch(setLogin(login)),
    setFirstName: (firstName) => dispatch(setFirstName(firstName)),
    setLastName: (lastName) => dispatch(setLastName(lastName)),
    setEmail: (email) => dispatch(setEmail(email)),
    setAbout: (about) => dispatch(setAbout(about)),
    setNewPassword: (newPass) => dispatch(setNewPassword(newPass)),
    fetchEditProfile: (data, username) => dispatch(fetchEditProfile(data, username)),
    editProfileStatus: (status) => dispatch(editProfileStatus(status))
});

const Avatar = (props) => {
    const { username, check, text } = props;
    const [src, setSrc] = useState();

    const putPhoto = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = e.target.files[0].type;
            if (!type.match("image/png") && !type.match("image/jpeg") && !type.match("image/jpg")) {
                return;
            }
            let formData = new FormData();
            formData.append('photo', file);
            request(`/api/image/${username}`, formData, 'POST', 'image')
                .then(data => {
                    if (data) { setSrc(Date.now()) }
                })
                .catch(e => {
                    console.log(e.message);
                })
        }
    }

    return (
        <Col className="col-lg-3">
            {username &&
                <img
                    src={`/api/image/${username}/${src}`}
                    alt={`Avatar ${username}`}
                    className="mx-auto d-block profile-avatar rounded-circle" />
            }
            {
                check &&
                <div className="d-flex justify-content-center">
                    <Label className="btn btn-sm btn-success">
                        {text}
                        <Input className="profile-input" type="file" onChange={putPhoto} />
                    </Label>
                </div>
            }
        </Col>
    );
}

const InputForm = (props) => {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState('Wrong input');

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'login' || name === 'email' || name === 'lastName' || name === 'firstName'
            || name === 'currentPass' || name === 'newPass' || name === 'about') {
            if (isValidInput(name, value)) {
                toggleValid('is-valid');
                if (name === 'email' || name === 'login') {
                    request(`/api/register/check/${name}/${value}`)
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
    const { displayname, firstname, lastname, about, email, provider } = props.info;
    const { setLogin, setFirstName, setLastName, setEmail, setAbout, setNewPassword, fetchEditProfile, editProfileStatus } = props;
    const history = useHistory();

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
        history.push(`/profile/${username || displayname}`);
        editProfileStatus('ok');
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
                    <Button color="success" onClick={save} disabled={!isActiveBtn}>Save</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const AsideButton = (props) => {
    const { me, name, fetchProfile, setMsg, check, info, status } = props;

    const changeStatus = (e) => {
        if (e.target.value === 'add' || e.target.value === 'remove') {
            const data = {
                me: me,
                you: name,
                status: e.target.value
            }

            request('/api/user/friends', data, 'POST')
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        fetchProfile(name, me);
                    }
                })
                .catch(error => setMsg(error.message));
        }
    }
    if (check) {
        const { setLogin, setFirstName, setLastName, setEmail,
            setAbout, setNewPassword, fetchEditProfile, editProfileStatus, edit } = props;

        return (
            <Row className="aside-button">
                <EditProfile
                    info={info}
                    setLogin={setLogin}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setEmail={setEmail}
                    setAbout={setAbout}
                    setNewPassword={setNewPassword}
                    fetchEditProfile={fetchEditProfile}
                    editProfileStatus={editProfileStatus}
                    edit={edit}
                />
            </Row>
        );
    }
    else {
        return (
            <Row className="aside-button" >
                <Button color="info"
                    value={info.isfriend === 1 ? 'remove' : 'add'}
                    onClick={changeStatus}>
                    {info.isfriend === 1 ? status[1] : status[0]}
                </Button>
            </Row>
        );
    }
}

const Profile = (props) => {
    const { t } = useTranslation();
    const { me } = props.login;
    const { username } = props.match.params;
    const { fetchProfile, fetchViews, fetchComments, fetchFriends, setLogin, setFirstName, setLastName,
        setEmail, setAbout, setNewPassword, fetchEditProfile, editProfileStatus } = props;
    const { isLoading, infoMsgViews, infoMsgComments, infoMsgFriends, info, views, comments, friends } = props.profile;
    const { status } = props.edit;

    useEffect(() => {
        fetchProfile(username, me);
    }, [fetchProfile, username, me, status]);

    useEffect(() => {
        fetchViews(username);
        fetchComments(username);
        fetchFriends(username);
    }, [fetchViews, fetchComments, fetchFriends, username]);

    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const [message, setMsg] = useState();

    if (isLoading) {
        return (
            <Loading />
        );
    }
    else if (infoMsgViews || infoMsgComments || infoMsgFriends) {
        return (
            <Info info="alert" message={infoMsgViews || infoMsgComments || infoMsgFriends} />
        );
    }
    else if (info != null) {
        const { displayname, firstname, lastname, about, provider } = info;
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
                        info={info}
                        status={[t("profilePage.status.add"), t("profilePage.status.remove")]}
                        setLogin={setLogin}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        setEmail={setEmail}
                        setAbout={setAbout}
                        setNewPassword={setNewPassword}
                        fetchEditProfile={fetchEditProfile}
                        editProfileStatus={editProfileStatus}
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
                                    <ViewsList myviews={views} movies />
                                </TabPane>
                                <TabPane tabId="2">
                                    <ViewsList myviews={comments} comments />
                                </TabPane>
                                <TabPane tabId="3">
                                    <ViewsList myviews={friends} friends />
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
