interface IProps {
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    autoFocus?: boolean;
    blurOnSubmit?: boolean;
    caretHidden?: boolean;
    defaultValue?: string;
    editable?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    maxHeight?: number;
    maxLength?: number;
    multiline?: boolean;
    onBlur?: () => void;
    onChange?: () => void;
    onChangeText?: () => void;
    onContentSizeChange?: () => void;
    onEndEditing?: () => void;
    onFocus?: () => void;
    onLayout?: () => void;
    onScroll?: () => void;
    onSelectionChange?: () => void;
    onSubmitEditing?: () => void;
    placeholder?: string;
    placeholderTextColor?: any;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';    
    secureTextEntry?: boolean;
    selectTextOnFocus?: boolean;
    selection?: {start: number, end: number};
    selectionColor?: any;
    inputStyle?: any;
    value?: string;
}

interface IPropsWithLabel extends IProps {
    labelStyle?: any;
    labelText: string;
}