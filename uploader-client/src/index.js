import React, { Component } from 'react';
import ReactDom from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom'
import App from './App';
ReactDom.render(
  <BrowserRouter >
    <Route path='/:location' component={App} key="1"/>
  </BrowserRouter>,
  document.getElementById('root')
);
