import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Button, Row, Col, Layout} from 'antd';
const {Header} = Layout;

import {fullWhite} from './color';

const headerStyle = {
  textAlign: 'center',
  fontSize: 'x-large',
  color: fullWhite,
  fontWeight: 'bold'
}

const NavActions = ({actions})=>(
  <div style={{fontSize: 'large',lineHeight: '64px',float: 'right'}}>
    {actions}
  </div>
)

const Nav = ({actions}) => (
  <Header style={headerStyle}>
    <Row type="flex">
      <Col span={4}>
      </Col>
      <Col span={16}>
          Maxile Cloud Disk
      </Col>
      <Col span={4}>
        <NavActions actions={actions}/>
      </Col>
    </Row>

  </Header>
)

export default Nav;