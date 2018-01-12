import React, {Component} from 'react';
import { Tree, Input } from 'antd';
import { GET } from '../../services/Http';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
        }
    }

    componentDidMount = () => {
        this.fetchClients();
    }

    fetchClients = () => {
        GET(`${this.props.server}/support/clients`)
        .then(resp => {
            this.setState({
                users: resp.data.clients
            })
        })
    }

    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }

    onSearchChange = (e) => {
        const value = e.target.value;
        this.setState({
          searchValue: value,
          autoExpandParent: true,
        });
    }

    onSelectTreeNode = (selectedKeys, event) => {
        const { onUserSelected } = this.props;
        if(selectedKeys.length > 0) {
            onUserSelected(selectedKeys[0])
        }
    }

    renderUsername = (user) => {
        const { searchValue } = this.state;
        const index = user.username.indexOf(searchValue);
        const beforeStr = user.username.substr(0, index);
        const afterStr = user.username.substr(index + searchValue.length);
        const title = index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : <span>{user.username}</span>;
        return title;
    }

    render = () => (
        <div>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onSearchChange}/>
            <Tree
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onSelect={this.onSelectTreeNode}
            >
                {
                    this.state.users.map((user, index) => (
                        <TreeNode key={user._id} title={this.renderUsername(user)}  >
                        </TreeNode>
                    ))
                }
            </Tree>
        </div>
    )

}
export default UserList;