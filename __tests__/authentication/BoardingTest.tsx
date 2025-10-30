// __tests__/authentication/Boarding-Test.tsx
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

// --- Mocks (no out-of-scope refs inside factories) ---
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/elements/Buttons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    PrimaryButton: ({ label, onPress }: { label: string; onPress?: () => void }) =>
      React.createElement(Text, { accessibilityRole: "button", onPress }, label),
  };
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Image: (props: any) => React.createElement(View, { testID: "mock-image", ...props }),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const RN = jest.requireActual("react-native");
  return { SafeAreaView: RN.View };
});

jest.mock("@/assets/images/board1.png", () => "board1");
jest.mock("@/assets/images/board2.png", () => "board2");
jest.mock("@/assets/images/board3.png", () => "board3");

// --- Under test ---
import Boarding from "@/app/stacks/authentication/boarding";

describe("Boarding screen", () => {
  const mockRouter = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useRouter } = require("expo-router");
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders slides and navigates to login when pressing GET STARTED", () => {
    render(<Boarding />);

    expect(
      screen.getByText("Run Multiple Businesses, Seamlessly")
    ).toBeTruthy();
    expect(screen.getByText("Invoice Faster, Get Paid Sooner")).toBeTruthy();
    expect(
      screen.getByText("Track Reports & Insights Effortlessly")
    ).toBeTruthy();

    const getStartedBtn = screen.getByRole("button", { name: "GET STARTED" });
    fireEvent.press(getStartedBtn);

    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: "/stacks/authentication/login",
    });
  });
});
