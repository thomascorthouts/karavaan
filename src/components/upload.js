import {RNFetchBlob} from 'react-native';

let upload = (data) => {
  return RNFetchBlob.fetch('POST', 'http://10.0.2.10:3000', {
    Authorization : "Bearer access-token",
    otherHeader : "foo",
    'Content-Type' : 'multipart/form-data',
  }, data);
}

module.exports = upload;