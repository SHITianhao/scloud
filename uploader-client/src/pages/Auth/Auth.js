import React, {Component} from 'react';
import {Row, Col, Alert} from 'antd';
import LoginForm from '../../components/LoginForm';
import SignUpForm from '../../components/SignUpForm';
import { POST } from '../../services/Http';
import { STORAGE_TOKEN_KEY } from '../../components/constants';
import Storage from '../../services/Storage'; 

class Auth extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            login: true,
            errorMessage: ''
        }
    }

    catchAuthError = (err) => {
        const { message } = err.response.data;
        if(message !== null || message !== undefined) {
            this.setState({ errorMessage: message});
        } else {
            this.setState({errorMessage: '服务器异常'});
        }
    }

    handleLoginSubmit = (values) => {
        POST(`${this.props.server}/auth/login`, values, false).then(resp => {
            const token = resp.data.token;
            Storage.set(STORAGE_TOKEN_KEY, token);
            this.props.loginSuccess();
        }).catch(this.catchAuthError);
    }

    switchToSignUp = () => {
        this.setState({ login: false })
    }

    switchToLogin = () => {
        this.setState({ login: true })
    }

    handleSignUpSubmit = (values) => {
        POST(`${this.props.server}/auth/signup`, values, false).then(resp => {
            const token = resp.data.token;
            Storage.set(STORAGE_TOKEN_KEY, token);
            this.props.loginSuccess();
        }).catch(this.catchAuthError);;
    }
    

    render = () => (
        <div>
            {this.state.errorMessage === ''? '':
            <Alert
                banner={true}
                message={this.state.errorMessage}
                type="error"
                showIcon
            />}

            <Row type="flex" justify="center">
                <Col sm={24} md={12}>
                    <h1 style={{ textAlign: 'center'}}>Maxile Cloud Disk</h1>
                </Col>
            </Row>
            <Row type="flex" justify="center">
                <Col sm={24} md={12}>
                    {this.state.login?
                        <LoginForm handleSubmit={this.handleLoginSubmit} switchToSignUp={this.switchToSignUp} />:
                        <SignUpForm handleSubmit={this.handleSignUpSubmit} switchToLogin={this.switchToLogin} />
                     }
                </Col>
            </Row>
        </div>

    )
}

export default Auth;