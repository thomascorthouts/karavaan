import { Alert } from 'react-native';

export const showError = (error: string) => {
    Alert.alert('Warning', error.replace(/^[\n\r]+/, '').trim(),
        [
            { text: 'OK', onPress: () => { return false; } }
        ],
        { onDismiss: () => undefined }
    );
    return true;
};

export const confirmDelete = (type: string, callback: any) => {
    Alert.alert('Warning', 'Do you really want to delete ' + type,
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => callback() }
        ],
        { onDismiss: () => undefined }
    );
    return true;
};