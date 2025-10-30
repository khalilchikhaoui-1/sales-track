import { render, screen } from "@testing-library/react-native";
import React from "react";


jest.mock("@/AuthLayout", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function AuthLayout(props: any) {
    return React.createElement(View, null, props.children);
  };
});

jest.mock("@/components/elements/Buttons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    PrimaryButton: ({ label }: { label: string }) =>
      React.createElement(Text, { accessibilityRole: "button" }, label),
  };
});

jest.mock("@/components/elements/Inputs", () => {
  const React = require("react");
  const { TextInput } = require("react-native");
  return {
    Input: ({ value, onChangeText, placeholder, testID }: any) =>
      React.createElement(TextInput, { value, onChangeText, placeholder, testID }),
  };
});

jest.mock("@/components/icons/AppIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    GoogleIcon: () => React.createElement(View, { testID: "google-icon" }),
    AppleIcon: () => React.createElement(View, { testID: "apple-icon" }),
  };
});

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), navigate: jest.fn(), push: jest.fn() },
}));

jest.mock("react-native-safe-area-context", () => {
  const RN = jest.requireActual("react-native");
  return { SafeAreaView: RN.View };
});

jest.mock("@react-native-google-signin/google-signin", () => {
  return {
    GoogleSignin: { configure: jest.fn() },
    statusCodes: {},
  };
});

jest.mock("@react-native-firebase/auth", () => {
  const fn: any = () => ({});
  fn.GoogleAuthProvider = { credential: jest.fn() };
  return fn;
});

import Login from "@/app/stacks/authentication/login";

describe("Login screen – basic buttons exist", () => {
  it("renders LOG IN, Forgot Password, SIGN UP, and social buttons", () => {
    render(<Login />);

    expect(screen.getByRole("button", { name: "LOG IN" })).toBeTruthy();

    expect(screen.getByText("Forgot Password")).toBeTruthy();
    expect(screen.getByText("SIGN UP")).toBeTruthy();

    expect(screen.getByTestId("google-icon")).toBeTruthy();
    expect(screen.getByTestId("apple-icon")).toBeTruthy();
  });
});
