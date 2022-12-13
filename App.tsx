import React from 'react';
import {
  Keyboard,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export default function TabOneScreen() {
  return (
    <View className="flex-1 px-4 mt-20 bg-white dark:bg-black">
      <Text className="mb-3 text-xl font-semibold dark:text-white">
        Enter your otp here
      </Text>
      <OtpInput
        onComplete={(value) => console.log(value)}
        defaultValue=""
        otpLength={6}
        // otpFieldStyle={(active, error) => ({
        //   width: 42,
        //   height: 44,
        //   borderWidth: 2,
        //   borderRadius: 8,
        //   backgroundColor: active ? 'white' : 'grey',
        //   borderColor: error ? 'red' : active ? '#ccc' : 'green',
        //   marginRight: 12,
        // })}
        // isError={true}
      />
    </View>
  );
}

type OtpInputFieldProps = {
  index: number;
  otpInputValue: string;
  isInputFocused: boolean;
  otpLength: number;
  otpFieldStyle?:
    | StyleProp<ViewStyle>
    | ((active?: boolean, error?: boolean) => StyleProp<ViewStyle>);
  otpTextStyle?: StyleProp<TextStyle>;
};

type OtpInputProps = Pick<
  OtpInputFieldProps,
  'otpLength' | 'otpFieldStyle' | 'otpTextStyle'
> & {
  defaultValue?: string;
  onComplete?: (value: string) => void;
  isError?: boolean;
  otpContainerStyle?: StyleProp<ViewStyle>;
};

function OtpInput({
  onComplete,
  defaultValue = '',
  otpLength = 4,
  isError = false,
  otpFieldStyle,
  otpTextStyle,
  otpContainerStyle,
}: OtpInputProps) {
  const inputRef = React.useRef<TextInput>(null);

  const [isOtpReady, setIsOtpReady] = React.useState<boolean>(false);
  const [otpInputValue, setOtpInputValue] =
    React.useState<string>(defaultValue);
  const [isInputFocused, setIsInputFocused] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const error = isError && isOtpReady;

  /* 
    focus the text-input, when pressing the opt-field
   */
  const onFocusHandler = () => {
    setIsInputFocused(true);
    inputRef?.current?.focus();
  };

  /* 
    setting otp to the otp field
   */
  const onChangeTextHandler = (text: string) => {
    setOtpInputValue(text);
    if (text.length === otpLength) {
      setIsOtpReady(true);
      onComplete && onComplete(text);
    } else {
      setIsOtpReady(false);
    }
  };

  /* 
    on-complete called when default value is set
    can be use for auto complete or auto fill
   */
  React.useEffect(() => {
    if (defaultValue.length === otpLength) {
      onComplete && onComplete(otpInputValue);
    }
  }, []);

  /* 
    hack: for getting keyboard after pressing device back button,
    otherwise it is not getting back when pressing input field
   */
  React.useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef?.current?.blur();
    });
    return () => {
      hideSubscription.remove();
    };
  }, []);

  /* 
    hack: to hide initial input field after paste or on-text-change event
   */
  React.useEffect(() => {
    if (otpInputValue.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      onFocusHandler();
    }
  }, [otpInputValue]);

  /* 
    styles for opt field
   */
  const getOtpFieldStyle = (
    active: boolean,
    error: boolean,
  ): StyleProp<ViewStyle> => {
    if (otpFieldStyle && typeof otpFieldStyle === 'function') {
      return otpFieldStyle(active, error);
    }
    if (otpFieldStyle) {
      return otpFieldStyle;
    }
  };
  const otpFieldBaseStyle = 'items-center justify-center';
  const otpFieldDemoStyle = (active?: boolean, error?: boolean) => `
    w-10 h-12 mr-2 border-2 rounded-lg 
    ${
      error
        ? 'border-red-400'
        : active
        ? 'border-slate-400 dark:border-slate-700'
        : 'border-slate-200 dark:border-slate-900'
    }
  `;

  return (
    <View style={otpContainerStyle}>
      <Pressable onPress={onFocusHandler} className="flex-row">
        {new Array(otpLength).fill(0).map((_value, index) => {
          const emptyInputChar = '';
          const digit = otpInputValue[index] || emptyInputChar;
          const isCurrentDigit = index === otpInputValue.length;
          const lastDigit = index === otpLength - 1;
          const isOtpInputFull = otpInputValue.length === otpLength;
          const isFocused = isCurrentDigit || (lastDigit && isOtpInputFull);
          const isActive = isInputFocused && isFocused;
          return (
            <View
              key={index}
              style={getOtpFieldStyle(isActive, error)}
              className={`${otpFieldBaseStyle} ${
                !otpFieldStyle && otpFieldDemoStyle(isActive, error)
              }`}
            >
              <Text
                style={otpTextStyle && otpTextStyle}
                className={`text-center text-lg font-bold dark:text-white`}
              >
                {digit}
              </Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        style={[
          {
            position: 'absolute',
            left: 0,
            opacity: !isVisible ? 1 : 0,
            zIndex: !isVisible ? 10 : -99999,
            color: 'transparent',
            textAlign: 'center',
          },
          getOtpFieldStyle(true, false),
          // { backgroundColor: "red" },
        ]}
        className={`${otpFieldBaseStyle} ${
          !otpFieldStyle && otpFieldDemoStyle(true, false)
        }`}
        value={otpInputValue}
        onChangeText={(text) => onChangeTextHandler(text)}
        maxLength={otpLength}
        keyboardType="phone-pad"
        defaultValue={defaultValue}
      />
    </View>
  );
}

// function OtpInputField({
//   otpInputValue,
//   index,
//   otpLength,
//   isInputFocused,
//   otpFieldStyle,
//   otpTextStyle,
// }: OtpInputFieldProps) {
//   const emptyInputChar = ""
//   const digit = otpInputValue[index] || emptyInputChar
//   const isCurrentDigit = index === otpInputValue.length
//   const lastDigit = index === otpLength - 1
//   const isOtpInputFull = otpInputValue.length === otpLength
//   const isFocused = isCurrentDigit || (lastDigit && isOtpInputFull)

//   const getOtpFieldStyle = (): StyleProp<ViewStyle> => {
//     if (otpFieldStyle && typeof otpFieldStyle === "function") {
//       return otpFieldStyle(isInputFocused && isFocused)
//     }
//     if (otpFieldStyle) {
//       return otpFieldStyle
//     }
//   }

//   return (
//     <View
//       style={getOtpFieldStyle()}
//       className="h-14 w-[48px] items-center justify-center rounded-md border-2"
//     >
//       <Text style={otpTextStyle && otpTextStyle} className={`text-center text-lg font-bold `}>
//         {digit}
//       </Text>
//     </View>
//   )
// }

// create an text-input
// create an otp boxes
// map input value to otp boxes
// manage focus by passing index, text length and last element
// style the input as same as otp box and positioned it at the first otp box
// initially input box will be on top of otp box but when the text.length > 0
// we will push text-input into back and opacity to 0 this is done to get
// on paste value and auto fill will also work

// crate an headless component and inject the style from parents
// use context api to pass common props
