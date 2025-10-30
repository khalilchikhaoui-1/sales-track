// __tests__/authentication/Boarding-Test.tsx
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

// --- Mock i18n: expose a jest.fn t() and return the key (stable across locales)
jest.mock("@/i18n", () => {
  const mockT = jest.fn((key: string) => key);
  return {
    t: mockT,
    i18n: { locale: "xx", defaultLocale: "en" },
  };
});

// Router mock
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// PrimaryButton -> simple pressable text
jest.mock("@/components/elements/Buttons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    PrimaryButton: ({
      label,
      onPress,
    }: {
      label: string;
      onPress?: () => void;
    }) => React.createElement(Text, { accessibilityRole: "button", onPress }, label),
  };
});

// Image + SafeArea + static assets
jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Image: (props: any) => React.createElement(View, { testID: "mock-image", ...props }) };
});

jest.mock("react-native-safe-area-context", () => {
  const RN = jest.requireActual("react-native");
  return { SafeAreaView: RN.View };
});

jest.mock("@/assets/images/board1.png", () => "board1");
jest.mock("@/assets/images/board2.png", () => "board2");
jest.mock("@/assets/images/board3.png", () => "board3");

// --- Under test (import after mocks) ---
import Boarding from "@/app/stacks/authentication/boarding";

describe("Boarding screen – uses t() keys and navigates", () => {
  const mockRouter = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useRouter } = require("expo-router");
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("calls t() with the right keys, renders them, and navigates on last button", () => {
    const { t } = require("@/i18n"); // the mocked module
    render(<Boarding />);

  

    // Because our mock returns the key, those keys should appear as text
    expect(screen.getByText("boarding.board1.title")).toBeTruthy();
    expect(screen.getByText("boarding.board1.description")).toBeTruthy();
    expect(screen.getByText("boarding.board2.title")).toBeTruthy();
    expect(screen.getByText("boarding.board2.description")).toBeTruthy();
    expect(screen.getByText("boarding.board3.title")).toBeTruthy();
    expect(screen.getByText("boarding.board3.description")).toBeTruthy();

    // Press the last button (the "GET STARTED" one in UI, but label doesn't matter here)
    const buttons = screen.getAllByRole("button");
    fireEvent.press(buttons[buttons.length - 1]);

    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: "/stacks/authentication/login",
    });
  });
});
