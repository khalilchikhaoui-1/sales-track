import { PrimaryButton } from "@/components/elements/Buttons";
import { COLORS } from "@/hooks/styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// @ts-expect-error – TS can’t resolve image modules here
import board1 from "@/assets/images/board1.png";
// @ts-expect-error – TS can’t resolve image modules here
import board2 from "@/assets/images/board2.png";
// @ts-expect-error – TS can’t resolve image modules here
import board3 from "@/assets/images/board3.png";
import { t } from "@/i18n";

const { width, height } = Dimensions.get("window");
const imageSize = width * 0.85;

interface IndicatorProps {
  i: number;
  scrollValue: Animated.Value;
}

type Slide = { title: string; description: string; image: any };

const data: Slide[] = [
  {
    title: t("boarding.board1.title"),
    description: t("boarding.board1.description"),
    image: board1,
  },
  {
    title: t("boarding.board2.title"),
    description: t("boarding.board2.description"),
    image: board2,
  },
  {
    title: t("boarding.board3.title"),
    description: t("boarding.board3.description"),
    image: board3,
  },
];

const Indicator = React.memo(function Indicator({
  i,
  scrollValue,
}: IndicatorProps) {
  const translateX = scrollValue.interpolate({
    inputRange: [-width + i * width, i * width, width + i * width],
    outputRange: [-20, 0, 20],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.indicator}>
      <Animated.View
        style={[styles.activeIndicator, { transform: [{ translateX }] }]}
      />
    </View>
  );
});

const Boarding = () => {
  const router = useRouter();
  const scrollValue = useRef(new Animated.Value(0)).current;

  const scrollRef = useRef<ScrollView | null>(null);

  const onNext = useCallback(
    (i: number, isLast: boolean) => {
      if (!isLast) {
        scrollRef.current?.scrollTo({
          x: width * (i + 1),
          animated: true,
        });
      } else {
        router.replace({
          pathname: "/stacks/authentication/login",
        });
      }
    },
    [router]
  );
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        overScrollMode="never"
        nestedScrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollValue } } }],
          { useNativeDriver: true }
        )}
      >
        {data.map((x, i) => {
          const isLast = i === data.length - 1;
          return (
            <View style={styles.card} key={x.title}>
              <View style={styles.illustration}>
                <Image
                  source={x.image}
                  style={{ width: imageSize, height: imageSize }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  priority={i === 0 ? "high" : "normal"}
                  transition={100}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{x.title}</Text>
                <Text style={styles.description}>{x.description}</Text>

                <PrimaryButton
                  label={isLast ? "GET STARTED" : "NEXT"}
                  onPress={() => onNext(i, isLast)}
                  fullWidth
                  style={styles.button}
                />
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.indicatorContainer} pointerEvents="none">
        {data.map((x, i) => (
          <Indicator i={i} key={x.title} scrollValue={scrollValue} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Boarding;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  card: {
    width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    minHeight: Math.min(height * 0.45, imageSize),
  },
  indicatorContainer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#00000070",
    marginHorizontal: 5,
    overflow: "hidden",
  },
  activeIndicator: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
  },
  textContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  icon: { width: "100%", aspectRatio: 1 },
  title: {
    marginBottom: 10,
    textAlign: "center",
    maxWidth: 300,
    fontSize: 24,
    color: COLORS.TEXT_DARK,
    fontFamily: "San-Bold",
  },
  description: {
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    maxWidth: 300,
    fontFamily: "San-Medium",
  },
  button: { paddingHorizontal: 20, marginBottom: 20 },
});
