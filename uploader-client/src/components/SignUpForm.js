import React, {Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false
        }
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render = () => (
        <Form onSubmit={(e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.handleSubmit(values);
                }
            });
        }} className="login-form">
            <FormItem label="Username">
                {this.props.form.getFieldDecorator('username', {
                    rules: [{
                        required: true, message: 'Please input your username!'
                    }]
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem label="E-mail" >
                {this.props.form.getFieldDecorator('email', {
                    rules: [{
                        type: 'email', message: 'The input is not valid E-mail!',
                    }, {
                        required: true, message: 'Please input your E-mail!',
                    }],
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem label="Password">
                {this.props.form.getFieldDecorator('password', {
                    rules: [{
                            required: true, message: 'Please input your Password!'
                        },{
                            validator: this.checkConfirm,
                        }]
                })(
                    <Input type="password" />
                )}
            </FormItem>
            <FormItem label="Confirm Password">
                {this.props.form.getFieldDecorator('confirm', {
                    rules: [{
                            required: true,  message: 'Please confirm your password!'
                        }, {
                            validator: this.checkPassword,
                        }]
                })(
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
            </FormItem>
            <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
                <Button onClick={this.props.switchToLogin} style={{ marginLeft: '16px' }} >Login with existing account</Button>
            </FormItem>
        </Form>
    )
}

export default Form.create()(SignUpForm);