export const COLORS = {
  PRIMARY: "#FF7622",
  PRIMARY_LIGHT: "#FFE1CE",
  PRIMARY_DARK: "#2b130bff",
  PRIMARY_MEDIUM: "#FFBF6D",
  SECONDARY: "#181C2E",
  GRAY: "#98A8B8",
  GRAY_LIGHT: "#ECF0F4",
  TEXT_LIGHT: "#646982",
  TEXT_LIGHTER: "#FFF2E0",
  TEXT_DARK: "#32343E",
  SUCCESS: "#059C6A",
  ERROR: "#E04444",
  WHITE: "#ffffff",
  BLACK: "#000000",
  BLACK_90: "#00000090",
  INPUT_BACKGROUND: "#F0F5FA",
  PLACEHOLDER: "#A0A5BA",
};

export const GlobalSyles = {
  screen: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 15,
  },
};

export const phoneInputStyles = {
  flagContainer: { backgroundColor: COLORS.WHITE },
  container: { backgroundColor: COLORS.WHITE },
  input: { fontFamily: "San-Medium", color: COLORS.TEXT_DARK },
  callingCode: {
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
  },
};

export const modalStyles = {
  backdrop: { backgroundColor: COLORS.BLACK_90 },
  searchInput: {
    borderColor: COLORS.GRAY,
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
  },
  countryItem: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GRAY,
  },
  callingCode: {
    fontFamily: "San-Medium",
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
  },
  countryName: {
    fontFamily: "San-Medium",
    fontSize: 16,
    color: COLORS.TEXT_DARK,
  },
  countryNotFoundMessage: {
    fontFamily: "San-Medium",
    fontSize: 14,
  },
  alphabetLetterText: { fontFamily: "San-Regular", fontSize: 16 },
  alphabetLetterTextActive: {
    fontFamily: "San-SemiBold",
    color: COLORS.WHITE,
  },
  alphabetLetterTextDisabled: { fontFamily: "San-Regular" },
};



export const otpStyles= {
              pinCodeContainerStyle: { borderWidth: 2 },
              pinCodeTextStyle: {
                fontFamily: "San-Medium",
                fontSize: 22,
                color: COLORS.TEXT_DARK,
              },
              focusStickStyle: {},
              focusedPinCodeContainerStyle: {},
              placeholderTextStyle: {
                fontFamily: "San-Regular",
                fontSize: 20,
                color: COLORS.TEXT_LIGHT,
              },
           
            }