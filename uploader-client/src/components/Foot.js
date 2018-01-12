import React, {Component} from 'react';
import {Layout, Row, Col, Icon} from 'antd';
const {Footer} = Layout;
import { grey900, fullWhite } from './color';

const footStyle = {
    marginTop: '16px',
    color: fullWhite,
    backgroundColor: grey900,
    fontSize: 'large',
}

const CustomFoot = () => (
    <Footer style={footStyle}>
        <Row type="flex" justify="center" align="middle" gutter={16}>
            <Col xs={24} sm={24} md={12}>
                版权所有 Maxile
            </Col>
        </Row>
    </Footer>
)

export default CustomFoot;