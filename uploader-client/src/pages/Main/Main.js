import React, {Component} from 'react';
import {Row, Col, Card, Icon, Upload, Button } from 'antd';
const {Meta} = Card;
import FileList from './FileList';
import UserList from './UserList';

import {fullWhite} from '../../components/color';

import { GET, POST } from '../../services/Http';
import { readFileIntoChunks } from '../../services/File';
import { FILE_CHUNK_SIZE, CONTENT_TYPE_FORM_DATA } from '../../components/constants';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    customRequest = (config) => {
        console.log(config);
        const { file } = config;
        const { name, size } = file;
        const chunkSize = Math.ceil( file.size / FILE_CHUNK_SIZE);
        const fileMD5 = "md5"+name+size;
        let fileId;
        POST(`${this.props.server}/upload/start`, {
            fileName: name,
            md5: fileMD5,
            chunkSize,
            size
        }).then(resp => {
            console.log(resp.data)
            fileId = resp.data.fileId;
            const { chunks } = resp.data;
            const skipChunkIndexs = chunks.map((chunk) => {
                return chunk.index;
            })
            return readFileIntoChunks(config.file, chunkSize, skipChunkIndexs, (chunk, md5, chunkIndex) => {
                if(chunkIndex >= chunkSize) {
                    console.log('uploaded file')
                    config.onProgress({ percent: 100}) 
                    return Promise.resolve();
                }
                const form = new FormData();
                form.append('data', chunk);
                form.append('fileId', fileId);
                form.append('chunkIndex', chunkIndex);
                form.append('md5', md5);
                return POST(`${this.props.server}/upload/chunk`, form, true, CONTENT_TYPE_FORM_DATA)
                .then(chunkResp => {
                    config.onProgress({ percent: Math.ceil(chunkIndex/chunkSize*100)});
                    return chunkResp.data;
                })
            });
        }).then((merge) => {
            if(merge) {
                return POST(`${this.props.server}/upload/end`, {fileId})
                .then(resp => {
                    config.onSuccess(resp.data);
                    console.log(resp.data);
                });
            } else {
                return Promise.resolve();
            }
        }).then(() => {
            this.fetchFiles();
        }).catch(err => {
            console.error(err);
        })
    }

    componentDidMount = () => {
        this.fetchFiles();
    }

    fetchFiles = (userId=null) => {
        GET(`${this.props.server}/files${userId === null?'':`?userId=${userId}`}`)
        .then(resp => {
            console.log(resp.data);
            this.setState({
                files: resp.data.files
            })
        })
    }

    onUserSelected = (userId) => {
        this.fetchFiles(userId);
    }

    render = () => (
        <Row type="flex" justify="center">
            <Col span={4}>
                <UserList onUserSelected={this.onUserSelected} server={this.props.server}/>
            </Col>
            <Col span={20}>
                <Row type="flex" justify="center">
                    <Col xl={24} xxl={16}>
                        <Upload customRequest={this.customRequest}>
                            <Button><Icon type="upload" />点击上传</Button>
                        </Upload>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col xl={24} xxl={16}>
                        <FileList data={this.state.files} requestUpdate={this.fetchFiles} server={this.props.server}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Main;