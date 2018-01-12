import { GET } from "./Http";
import Storage from "./Storage";
import { MAIN_SERVER_NODE } from "../components/constants";

const getNodeList = () => {
    return GET(`${MAIN_SERVER_NODE}/server/ip`).then(resp => {
        Storage.set('US', resp.data.US);
        Storage.set('CHINA', resp.data.CHINA);
        return resp.data;
    })
}

const getNodeAddressByLocation = (location) => {
    if(location !== null || location !== undefined) location = location.toUpperCase();
    const localValue =  Storage.get(location);
    if(localValue == null) {
        return getNodeList().then(() => {
            return Storage.get(location);
        })
    } else {
        return Promise.resolve(localValue);
    }
}

export default {
    getNodeList,
    getNodeAddressByLocation
} 