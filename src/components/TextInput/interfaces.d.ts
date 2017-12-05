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
    onBlur?: any;
    onChange?: any;
    onChangeText?: any;
    onContentSizeChange?: any;
    onEndEditing?: any;
    onFocus?: any;
    onLayout?: any;
    onScroll?: any;
    onSelectionChange?: any;
    onSubmitEditing?: any;
    placeholder?: string;
    placeholderTextColor?: any;
    inputref?: any;
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

interface IPropsWithButton extends IProps{

    buttonText: string;
    selectCurrency(): void;
}

interface ICurrencyPicker extends IProps{

    currentCurrency: Currency;
    currencies: Map<string, Currency>;
    selectThisCurrency(curr: string): void;
}