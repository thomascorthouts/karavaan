import React, { Component } from 'react';
import { ImagePicker } from 'expo';
import { Image, View, Dimensions } from 'react-native';
import { GreenButton } from '../components/Buttons/GreenButton';
import { specificStyles, standardStyles } from './screenStyles';

interface IState {
    image: any;
}

class ImageSelector extends Component<IDefaultNavProps, IState> {

    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            image: null
        };
    }

    render() {
        let { image } = this.state;
        let { goBack } = this.props.navigation;
        let height = Dimensions.get('window').height;
        let width = Dimensions.get('window').width;

        return (
            <View style={ standardStyles.flexCenter }>
                <View style={ standardStyles.flexCenter }>
                    <GreenButton
                        buttonText='Pick an image from the camera roll'
                        buttonStyle={ specificStyles.leftButton }
                        onPress={this.pickImage}
                    />
                    <GreenButton
                        buttonText='Take an image with the camera'
                        buttonStyle={ specificStyles.rightButton }
                        onPress={this.takeImage}
                    />
                </View>

                {image &&
                    <View style={standardStyles.flex}>
                        <Image source={{ uri: image }} style={[standardStyles.flex, {width: width - 40, height: height * 0.5, resizeMode: 'contain' }]} />
                        <GreenButton
                            buttonText='Select Image'
                            onPress={() => this.selectImage(goBack)}
                        />
                    </View>
                }
            </View>
        );
    }

    selectImage(goBack: any) {
        goBack();
        this.props.navigation.state.params.updateImage(this.state.image);
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    takeImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };
}

export default ImageSelector;