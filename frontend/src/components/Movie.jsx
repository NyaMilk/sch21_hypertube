import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap'
import { useTranslation } from "react-i18next";
import CONFIG from '../util/const';

const Movie = () => {  
    const { imdb } = useParams();
    const { t } = useTranslation();

    return (
        <Container>
            {imdb}
            <video id="videoPlayer" controls>
                <source src={`${CONFIG.API_URL}/api/movies/video/${imdb}`}
                    type="video/mp4" />
                <track label="English" kind="subtitles" srclang="en" src="captions/vtt/sintel-en.vtt" default />
                <track label="Deutsch" kind="subtitles" srclang="de" src="captions/vtt/sintel-de.vtt" />
                <track label="Español" kind="subtitles" srclang="es" src="captions/vtt/sintel-es.vtt" />
            </video>
        </Container>
    );
}

export default Movie;
