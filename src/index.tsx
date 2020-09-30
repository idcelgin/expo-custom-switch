import * as React from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useActive, useHover } from 'react-native-web-hooks';
import color from 'color';
import { TouchableOpacity } from './Elements';

const width = 70;
const circleWidth = 27;
const sideOffset = 5;
const transitionTime = 200;

export type Props = React.ComponentProps<typeof TouchableOpacity> & {
  onChange: (value: boolean) => void;
  value: boolean;
  iconLeft: object;
  iconRight: object;
  leftColor: string;
  rightColor: string;
};

export default function Switch({
  onChange,
  style,
  value,
  iconLeft,
  iconRight,
  leftColor,
  rightColor,
  ...props
}: Props) {
  const onValueChange = React.useMemo(() => () => onChange(!value), [onChange]);
  return (
    <TouchableOpacity
      accessibilityRole="button"
      tabIndex={0}
      activeOpacity={1.0}
      {...props}
      {...onEnterAndClick(onValueChange)}
      style={[styles.wrapper, style]}
    >
      <CustomSwitch
        isClicked={value}
        iconLeft={iconLeft}
        iconRight={iconRight}
        leftColor={leftColor}
        rightColor={rightColor}
      />
    </TouchableOpacity>
  );
}

const createAnimatedValue = (isOn: boolean) =>
  React.useRef(new Animated.Value(isOn ? 1 : 0));

const SlideUpIcon = ({
  isClicked,
  ...props
}) => {
  const value = createAnimatedValue(isClicked);

  React.useEffect(() => {
    Animated.timing(value.current, {
      toValue: isClicked ? 1 : 0,
      duration: transitionTime,
      easing: Easing.inOut(Easing.linear),
    }).start();
  }, [isClicked]);

  return (
    <Animated.View
      style={[
        styles.icon,
        {
          opacity: value.current,
          transform: [
            {
              translateY: value.current.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
        props.style,
      ]}
    >
      <Icon
        name="archive"
        {...props}
        style={[styles.icon, props.style]}
      />

    </Animated.View>
  );
};

const onEnterAndClick = cb => {
  return {
    // onClick: cb,
    onPress: cb,
    onKeyPress: e => {
      if (e.which === 13 || e.which === 32) {
        cb && cb(e);
      }
    },
  };
};

const CustomSwitch = ({
  isClicked,
  iconLeft,
  iconRight,
  leftColor,
  rightColor,
}) => {
  const ref = React.useRef(null);
  const isHovered = useHover(ref);
  const isActive = useActive(ref);

  const value = createAnimatedValue(isClicked);
  const scaleValue = React.useRef(new Animated.Value(1));

  React.useEffect(() => {
    Animated.timing(value.current, {
      toValue: isClicked ? 1 : 0,
      duration: transitionTime,
    }).start();
  }, [isHovered, isClicked]);

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: isActive ? 1.03 : isHovered ? 1.05 : 1,
      duration: transitionTime,
    }).start();
  }, [isActive, isHovered]);
  const outputRange = [
    leftColor,
    rightColor,
  ];
  const backgroundColor = isHovered
    ? isClicked
      ? color(rightColor).lighten(0.2).toString()
      : color(leftColor).lighten(0.2).toString()
    : value.current.interpolate({
        inputRange: [0, 1],
        outputRange,
      });

  return (
    <Animated.View
      ref={ref}
      style={[
        styles.customSwitch,
        {
          backgroundColor,
          transform: [{ scale: scaleValue.current }],
        },
      ]}
    >
      <Circle
        isClicked={isClicked}
        iconLeft={iconLeft}
        iconRight={iconRight}
        leftColor={leftColor}
        rightColor={rightColor}
      />
    </Animated.View>
  );
};

const Circle = ({
  isClicked,
  iconLeft,
  iconRight,
  leftColor,
  rightColor,
  ...props
}) => {
  const ref = React.useRef(null);

  const value = createAnimatedValue(isClicked);

  React.useEffect(() => {
    Animated.timing(value.current, {
      toValue: isClicked ? 1 : 0,
      duration: transitionTime,
    }).start();
  }, [isClicked]);

  const isHovered = useHover(ref);

  // const translateX = isClicked ? width - circleWidth - sideOffset : sideOffset;
  const backgroundColor = isClicked
    ? `rgba(255,255,255,${isHovered ? '0.3' : '0.4'})`
    : isHovered
    ? color(leftColor).lighten(0.3).toString()
    : color(leftColor).lighten(0.3).toString();
  // const borderColor = isClicked ? 'rgba(255,255,255,0.9)' : '#d6b05eb5';
  const borderColor = 'rgba(255,255,255,0.9)';

  return (
    <Animated.View
      {...props}
      ref={ref}
      style={[
        styles.circle,
        {
          // borderWidth: value.current.interpolate({
          //   inputRange: [0, 1],
          //   outputRange: [3, 2],
          // }),
          // borderColor,
          // backgroundColor,
          transform: [
            {
              translateX: value.current.interpolate({
                inputRange: [0, 1],
                outputRange: [sideOffset, width - circleWidth - sideOffset],
              }),
            },
          ],
        },
        props.style,
      ]}
    >
      <SlideUpIcon isClicked={!isClicked} size={22} {...iconLeft} />
      <SlideUpIcon isClicked={isClicked} size={22} {...iconRight} />
    </Animated.View>
  );
};

function webStyle(style) {
  return Platform.select({ web: style, default: {} });
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 17,
    overflow: 'hidden',
    ...webStyle({
      willChange: 'transform',
    }),
  },
  customSwitch: {
    ...webStyle({
      cursor: 'pointer',
    }),
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    width,
    borderRadius: 17,
  },
  star: {
    // @ts-ignore: borderRadius cannot be string on native
    borderRadius: Platform.select({
      web: '100%',
      default: 17,
    }),
    backgroundColor: 'white',
    position: 'absolute',
  },
  circle: {
    borderRadius: 17,
    ...webStyle({
      cursor: 'pointer',
      borderRadius: '100%',
    }),
    width: circleWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 27,
    overflow: 'hidden',
    borderStyle: 'solid',
  },
  icon: {
    ...webStyle({
      userSelect: 'none',
    }),
    position: 'absolute',
    width: 13,
    height: 13,
    opacity: 1,
  },
});
