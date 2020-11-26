import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Catalog from './Catalog';
import Footer from './Footer';

export function Main() {

    return (
        <div>
            <Header />
            <Router>
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route component={Catalog} />
                </Switch>
            </Router>
            <Footer />
        </div>
    )
}