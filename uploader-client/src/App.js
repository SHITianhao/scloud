import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {Layout, Button, Spin, Select} from 'antd';
const {Header, Footer, Sider, Content} = Layout;
const Option = Select.Option;
import Foot from './components/Foot';
import Nav from './components/Nav';
import { STORAGE_TOKEN_KEY, MAIN_SERVER_NODE } from './components/constants';
import MainPage from './pages/Main/Main';
import AuthPage from './pages/Auth/Auth';
import Storage from './services/Storage';
import Node from './services/Node';
import './index.less';

const breadCrumbStyle = {
    margin: '16px 0',
    fontSize: 'large'
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authed: Storage.get(STORAGE_TOKEN_KEY) !== null,
            spinning: true,
            server: MAIN_SERVER_NODE
        }
    }

    componentDidMount = () => {
        const { match } = this.props;
        const { location } = match.params;
        Node.getNodeList().then(list => {
            
        })
        Node.getNodeAddressByLocation(location).then((address) => {
            this.setState({ server: address, spinning: false})
        })
    }

    loginSuccess = () => {
        this.setState({ authed: true });
    }

    logoutSuccess = () => {
        this.setState({ authed: false });
    }

    locationOnChange = () => {

    }
    
    navActions = () => {
        return [
            <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.locationOnChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
            </Select>,
            <Button type="danger" onClick={this.logoutSuccess} key={2}>退出登录</Button>
        ]
    }

    render = () => (
        <Spin spinning={this.state.spinning} tip="努力加载中">
            <Layout>
                {this.state.authed? <Nav actions={this.navActions()}/>:''}
                <Content  style={{marginTop: '16px'}}>       
                    <Switch>
                        <Route path='/' render={() => (
                            this.state.authed? 
                            <MainPage server={this.state.server}/>:
                            <AuthPage server={this.state.server} loginSuccess={this.loginSuccess} />
                        )} key="1"/>
                    </Switch>
                </Content>
                <Foot />
            </Layout>
        </Spin>
    )
}

export default withRouter(App);