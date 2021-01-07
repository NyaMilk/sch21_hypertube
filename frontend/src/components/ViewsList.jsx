import * as React from 'react';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import 'moment/locale/ru';

const MovieView = (props) => {
    const { i18n } = useTranslation();
    const { imdb, entitle, rutitle, engenres, rugenres, enposter, ruposter } = props.movie;

    const title = (i18n.language === 'en') ? entitle : rutitle;
    const genres = (i18n.language === 'en') ? engenres : rugenres;
    const poster = (i18n.language === 'en') ? enposter : ruposter;

    return (
        <a href={`/movie/${imdb}`}>
            <div className="view-list-block">
                <div className="view-element-poster-wrapper col-md-1">
                    <img src={`https://image.tmdb.org/t/p/original/${poster}`} className="view-element-poster" alt={title}/>
                </div>
                <div className="view-element-info">
                    <div className="view-element-title">{title}</div>
                    <div className="view-element-genres-wrapper">
                        {genres.map(genre =>
                            <div className="view-element-genre">{genre}</div>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
}

const CommentsView = (props) => {
    const {i18n} = useTranslation();

    const {createdat, comment, idfilm} = props.comment;

    (i18n.language === 'en') ? moment.locale('en') : moment.locale('ru');

    return (
        <a href={`/movie/${idfilm}`}>
            <div className="view-list-block">
                <div className="view-comment-wrapper">
                    <div className="view-element-date">{moment(createdat).fromNow()}</div>
                    <div className="view-element-text">{comment}</div>
                </div>
            </div>
        </a>
    )
}

export const ViewsList = (props) => {
    const {myviews, movies, comments} = props;

    return (
        <div className="view-list-wrapper">
            {myviews.map(element => {
                if (movies) {
                    return <MovieView movie={element} />
                } else {
                    return <CommentsView comment={element} /> 
                }
            })}
        </div>
    )
}
