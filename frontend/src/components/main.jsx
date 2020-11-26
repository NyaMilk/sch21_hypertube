import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Login from './login/Login';
import Catalog from './catalog/Catalog';

export function Main() {

    return(
        <div>
            <Router>
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route component={Catalog}/>
                </Switch>
            </Router>
        </div>
    )
}