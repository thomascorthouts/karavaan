interface IProps {
    placeholder?: string;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    editable?: boolean;
    secureTextEntry?: boolean;
    onSubmitEditing?: any;
}

interface IPropsWithLabel extends IProps {
    labelText: string;
}