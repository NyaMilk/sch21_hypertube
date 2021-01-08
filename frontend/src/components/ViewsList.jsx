import * as React from 'react';
import { useTranslation } from "react-i18next";
import CONFIG from '../util/const';
import moment from 'moment';
import 'moment/locale/ru';

const MovieView = (props) => {
    const { i18n } = useTranslation();

    let listItems = props.movies.map((movie, item) => {
        const { entitle, rutitle, engenres, rugenres, enposter, ruposter } = movie;
        const title = (i18n.language === 'en') ? entitle : rutitle;
        const genres = (i18n.language === 'en') ? engenres : rugenres;
        const poster = (i18n.language === 'en') ? enposter : ruposter;
        return (
            <a key={item} href={`/movie/${movie.imdb}`}>
                <div className="view-list-block">
                    <div className="view-element-poster-wrapper col-md-1">
                        {
                            poster &&
                            <img src={`https://image.tmdb.org/t/p/original/${poster}`} className="view-element-poster" alt={title} />
                        }
                    </div>
                    <div className="view-element-info">
                        <div className="view-element-title">{title}</div>
                        <div className="view-element-genres-wrapper">
                            {
                                genres &&
                                genres.map((genre, i) =>
                                    <div key={i} className="view-element-genre">{genre}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </a>
        )
    });
    return (
        <div>{listItems}</div>
    );
}

const CommentsView = (props) => {
    const { i18n } = useTranslation();
    (i18n.language === 'en') ? moment.locale('en') : moment.locale('ru');

    let listItems = props.comments.map((comment, item) => {
        const { entitle, rutitle, enposter, ruposter } = comment;
        const title = (i18n.language === 'en') ? entitle : rutitle;
        const poster = (i18n.language === 'en') ? enposter : ruposter;
        return (
            <a key={item} href={`/movie/${comment.idfilm}`}>
                <div className="view-list-block">
                    <div className="view-element-poster-wrapper col-md-1">
                        {
                            poster &&
                            <img src={`https://image.tmdb.org/t/p/original/${poster}`} className="view-element-poster" alt={title} />
                        }
                    </div>
                    <div className="view-comment-wrapper">
                        <div className="view-element-date">
                            {props.t("profilePage.left")}
                            {title}
                        </div>
                        <div className="view-element-date">{moment(comment.createdat).fromNow()}</div>
                        <div className="view-element-text">{comment.comment}</div>
                    </div>
                </div>
            </a>
        )
    });
    return (
        <div>{listItems}</div>
    );
}

const FriendsView = (props) => {
    const { i18n } = useTranslation();
    (i18n.language === 'en') ? moment.locale('en') : moment.locale('ru');

    let listItems = props.friends.map((friend, item) =>
        <a key={item} href={`/profile/${friend.displayname}`}>
            <div className="view-list-block">
                <div className="view-element-poster-wrapper col-xs-2">
                    <img src={`${CONFIG.API_URL}/api/image/${friend.displayname}/1`} className="view-element-avatar" alt={friend.displayname} />
                </div>
                <div className="view-comment-wrapper">
                    <div className="view-element-date">{moment(friend.createdat).fromNow()}</div>
                    <div className="view-element-text">{friend.displayname}</div>
                </div>
            </div>
        </a>
    );
    return (
        <div>{listItems}</div>
    );
}

export const ViewsList = (props) => {
    const { t } = useTranslation();
    const { myviews, movies, comments, friends } = props;

    if (myviews && myviews.length > 0) {
        return (
            <div className="view-list-wrapper">
                {
                    movies &&
                    <MovieView movies={myviews} />
                }
                {
                    comments &&
                    <CommentsView comments={myviews} t={t} />
                }
                {
                    friends &&
                    <FriendsView friends={myviews} />
                }
            </div>
        )
    }
    else {
        return (
            <div className="font-profile-head font-message">{t("inputMsg.nothing")}</div>
        )
    }
}
