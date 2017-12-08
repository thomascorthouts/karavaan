/*import React, { Component } from 'react'
import {
  CameraRoll,
  Image,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

class CameraRollView extends Component<any,any> {

  constructor(props:any) {
    super(props)
    var controls = props.controls
    this.state = {
      images: [],
      selected: '',
      fetchParams: { first: 25 },
      groupTypes: 'SavedPhotos',
    }
    this._storeImages = this._storeImages.bind(this)
    this._logImageError = this._logImageError.bind(this)
    this._selectImage = this._selectImage.bind(this)
  }

  componentDidMount() {
    // get photos from camera roll
    CameraRoll.getPhotos(this.state.fetchParams, this._storeImages, this._logImageError);
  }

  // callback which processes received images from camera roll and stores them in an array
  _storeImages(data:any) {
    const assets = data.edges;
    const images = assets.map( asset => asset.node.image );
    this.setState({
        images: images,
    });
  }

  _logImageError(err:any) {
      console.log(err);
  }

  _selectImage(uri:any) {
    // define whatever you want to happen when an image is selected here
    this.setState({
      selected: uri,
    });
    console.log('Selected image: ', uri);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={styles.container}>
            <View style={styles.imageGrid}>
            { this.state.images.map(image => {
              return (
               <TouchableHighlight onPress={() => this._selectImage(image.uri)}>
                 <Image style={styles.image} source={{ uri: image.uri }} />
               </TouchableHighlight>
             );
            })}
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
  },
  image: {
      width: 100,
      height: 100,
      margin: 10,
  },
});

export default CameraRollView*/