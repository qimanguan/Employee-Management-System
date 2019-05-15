import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../container/Home';
import CreateCon from '../container/createCon';
import Edit from './Edit';
import Manager from './Manager';
import Reports from './Report';

const App = () => {
    return <BrowserRouter>
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/reports/:id' component={Reports}/>
            <Route path='/create' component={CreateCon} />
            <Route path='/edit/:id' component={Edit} />
            <Route path='/getById/:id' component={Manager}/>
        </Switch>
    </BrowserRouter>
}

export default App;
