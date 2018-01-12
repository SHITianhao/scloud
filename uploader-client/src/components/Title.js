import React, {Component} from 'react';
import { Row, Col } from 'antd';
import { teal900, teal500 } from './color';

const titleStyle = {
    textAlign: 'center',
    fontSize: 'x-large',
}

const titleTextStyle = {
    color: teal900
}

const subTitleTextStyle = {
    color: teal500
}

const Title = ({text, subTitle=undefined}) => (
    <Row type="flex" justify="center">
        <Col md={24} lg={16} style={titleStyle}>
            <h2 style={titleTextStyle}>{text}</h2>
            <h4 style={subTitleTextStyle} hidden={subTitle === undefined}>{subTitle}</h4>
        </Col>
    </Row>
)

export default Title;