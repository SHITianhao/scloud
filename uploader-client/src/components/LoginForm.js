import React, {Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;
const LoginForm = ({ form, handleSubmit, switchToSignUp }) => (
    <Form onSubmit={(e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                handleSubmit(values);
            }
        });
    }} className="login-form">
        <FormItem>
            {form.getFieldDecorator('username', {
                rules: [
                    {
                        required: true,
                        message: 'Please input your username!'
                    }
                ]
            })(
                <Input
                    prefix={< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                    placeholder="Username"/>
            )}
        </FormItem>
        <FormItem>
            {form.getFieldDecorator('password', {
                rules: [
                    {
                        required: true,
                        message: 'Please input your Password!'
                    }
                ]
            })(
                <Input
                    prefix={< Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
                    type="password"
                    placeholder="Password"/>
            )}
        </FormItem>
        <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
            <Button onClick={switchToSignUp} style={{ marginLeft: '16px' }} >Sign Up</Button>
        </FormItem>
    </Form>
)

export default Form.create()(LoginForm);