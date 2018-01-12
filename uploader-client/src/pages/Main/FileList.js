import React, {Component} from 'react';
import { List, Avatar, Button, Spin, Icon } from 'antd';
import { GET, DELETE } from '../../services/Http';
import { teal500, orange500 } from '../../components/color';

const getDateString = (file) => {
    return new Date(file.uploadedAt).toLocaleDateString();
}

const getFileSize = (file) => {
    let bytes = file.size;
    const thresh = 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

const downloadFile = (file) => {
    GET(`${MAIN_SERVER_NODE}/files/${file._id}`, {}, true, 'application/json', 'blob').then((resp) => {
        console.log(resp)
        const blob = new Blob([resp.data]);
        const url = window.URL.createObjectURL(blob);
        console.log(blob)
        console.log(url)
        let tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', file.fileName);
        tempLink.click();
      })
}

const deleteFile = (file, done) => {
    DELETE(`${this.props.server}/files/${file._id}`).then((resp) => {
        console.log(resp)
        done();
    })
}

const getCompleteIcon = (file) => (
    file.completed?<Icon type="check-circle" style={{color: teal500}} />:<Icon type="pause-circle" style={{color: orange500}}/>
)

const FileList = ({ data, requestUpdate }) => (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={file => (
            <List.Item actions={[
                <Button onClick={() => downloadFile(file)}>下载</Button>,
                <Button onClick={() => deleteFile(file, requestUpdate)}>删除</Button>,
            ]}>
                <List.Item.Meta
                    avatar={<Icon type="file" />}
                    title={
                        <div>
                            {file.fileName} {getCompleteIcon(file)}
                        </div>
                    }
                    description={`${getDateString(file)} ${getFileSize(file)}`}
                />
                <div></div>
            </List.Item>
    )}
  />
)

export default FileList;