import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Remind from './Remind';
import Restore from './Restore';
import Catalog from './Catalog';
import Footer from './Footer';

export function Main() {

    return (
        <div>
            <Header />
            <Router>
                <Switch>
                    <Route exact={true} path='/login' component={Login} />
                    <Route path='/login/:nickname/:hash' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route exact={true} path='/remind' component={Remind} />
                    <Route path='/remind/:email/:hash' component={Restore} />
                    <Route component={Catalog} />
                </Switch>
            </Router>
            <Footer />
        </div>
    )
}