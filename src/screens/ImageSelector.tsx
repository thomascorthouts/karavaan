import React, { Component } from 'react';
import { ImagePicker } from 'expo';
import { Button, Image, View, Dimensions, StyleSheet } from 'react-native';
import { GreenButton } from '../components/Buttons/GreenButton';

interface IState {
    image: any;
    expense: Expense;
}

class ImageSelector extends Component<IDefaultNavProps, IState> {
    constructor(props: IDefaultNavProps, state: IState) {
        super(props, state);

        this.state = {
            image: null,
            expense: this.props.navigation.state.params.expense as Expense
        };
    }

    render() {
        let { image } = this.state;
        let { goBack } = this.props.navigation;
        let height = Dimensions.get('window').height;
        let width = Dimensions.get('window').width;

        return (
            <View style={styles.flexCenter}>
                <View style={styles.flexCenter}>
                    <GreenButton
                        buttonText='Pick an image from the camera roll'
                        buttonStyle={{ paddingHorizontal: 10 }}
                        onPress={this.pickImage}
                    />
                    <GreenButton
                        buttonText='Take an image with the camera'
                        buttonStyle={{ paddingHorizontal: 10 }}
                        onPress={this.takeImage}
                    />
                </View>
                {image &&
                    <View style={styles.flex}>
                        <Image source={{ uri: image }} style={{ flex: 1, width: width - 40, height: height * 0.5, resizeMode: 'contain' }} />
                        <GreenButton
                            buttonText='Select Image'
                            onPress={() => this.selectImage(goBack)}
                        />
                    </View>
                }
            </View>
        );
    }

    selectImage = (goBack: any) => {
        const expense = Object.assign({}, this.state.expense, { image: this.state.image });
        this.setState({ expense }, () => {
            goBack();
            this.props.navigation.state.params.updateImage({ expense: expense });
        });
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

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    flexCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        padding: 20
    }
});