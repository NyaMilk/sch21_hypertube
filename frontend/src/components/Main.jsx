import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Remind from './Remind';
import Restore from './Restore';
import Catalog from './Catalog';
import Movie from './Movie';
import Profile from './Profile';
import Footer from './Footer';

export const Main = () => {
    return (
        <div>
            <Router>
                <Header />
                <Switch>
                    <Route exact={true} path='/login' component={Login} />
                    <Route path='/login/:username/:hash' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route exact={true} path='/remind' component={Remind} />
                    <Route path='/remind/:email/:hash' component={Restore} />
                    <Route path='/catalog/page/:page' component={Catalog} />
                    <Route exact={true} path='/movie/:imdb' component={Movie} />
                    <Route exact={true} path='/profile/:username' component={Profile} />
                    <Route exact path='/' component={Login} />
                </Switch>
            </Router>
            <Footer />
        </div>
    )
}