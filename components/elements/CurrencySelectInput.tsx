import { ChevronDownIcon } from "@/components/icons/AppIcons";
import { CURRENCIES, PREVIEW_AMOUNT } from "@/hooks/currencies";
import { COLORS } from "@/hooks/styles";
import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Dropdown from "react-native-input-select";

type Props = {
  value: string;                               // currency code
  onChange: (code: string) => void;

  display: "symbol" | "code";                  // how to show the label
  onChangeDisplay: (v: "symbol" | "code") => void;

  direction: "ltr" | "rtl";                    // label left/right of amount
  onChangeDirection: (v: "ltr" | "rtl") => void;
};

const CurrencySelectInput: React.FC<Props> = ({
  value,
  onChange,
  display,
  onChangeDisplay,
  direction,
  onChangeDirection,
}) => {
  const options = useMemo(
    () =>
      CURRENCIES.map((c) => ({
        label: `${c.name} (${c.code}) ${c.symbol}`,
        value: c.code,
      })),
    []
  );

  // derive symbol/decimals for preview
  const found = useMemo(() => CURRENCIES.find((c) => c.code === value), [value]);
  const symbol = found?.symbol ?? "";
  const decimals = typeof found?.decimals === "number" ? found!.decimals : 2;

  const preview = (amount: number) => {
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const label = display === "symbol" && symbol ? symbol : (value || "");
    if (!label) return formatted;
    return direction === "ltr" ? `${label} ${formatted}` : `${formatted} ${label}`;
  };

  const Chip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        active && {
          backgroundColor: COLORS.PRIMARY + "12",
          borderColor: COLORS.PRIMARY,
        },
      ]}
    >
      <Text style={[styles.chipText, active && { color: COLORS.PRIMARY }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ gap: 12 }}>
      <Dropdown
        label={undefined}
        placeholder="Select a currency..."
        options={options}
        optionLabel="label"
        optionValue="value"
        selectedValue={value}
        onValueChange={(val: any) => onChange(val || "")}
        isSearchable
        primaryColor={COLORS.PRIMARY}
        autoCloseOnSelect
        // Option row styling
        checkboxControls={{
          checkboxStyle: { borderColor: COLORS.GRAY, marginRight: 10 },
          checkboxUnselectedColor: COLORS.GRAY,
          checkboxLabelStyle: styles.optionLabel,
        }}
        listComponentStyles={{
          itemSeparatorStyle: {
            height: 6,
            backgroundColor: "transparent",
          },
        }}
        dropdownStyle={styles.dropdown}
        dropdownContainerStyle={{borderWidth:1, }}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedItemStyle={styles.dropdownSelected}
        dropdownIcon={<ChevronDownIcon size={24} color={COLORS.GRAY} />}
        dropdownIconStyle={styles.chevronWrapper}
        searchControls={{
          textInputStyle: styles.searchBoxInput,
          textInputProps: {
            placeholder: "Search currency by name or code…",
            placeholderTextColor: COLORS.PLACEHOLDER,
            autoCapitalize: "none",
            autoCorrect: false,
            returnKeyType: "search",
          },
        }}
        modalControls={{
          modalOptionsContainerStyle: styles.modalOptionsContainer,
          modalBackgroundStyle: styles.modalBackground,
        }}
      />

      {/* Only show Display + Placement + Preview when a currency is selected */}
      {!!value && (
        <>
          <Text style={styles.subLabel}>Display</Text>
          <View style={styles.chipsRow}>
            <Chip
              label="Use symbol (€, $)"
              active={display === "symbol"}
              onPress={() => onChangeDisplay("symbol")}
            />
            <Chip
              label="Use code (EUR, USD)"
              active={display === "code"}
              onPress={() => onChangeDisplay("code")}
            />
          </View>

          <Text style={styles.subLabel}>Placement</Text>
          <View style={styles.chipsRow}>
            <Chip
              label="Left (LTR)"
              active={direction === "ltr"}
              onPress={() => onChangeDirection("ltr")}
            />
            <Chip
              label="Right (RTL)"
              active={direction === "rtl"}
              onPress={() => onChangeDirection("rtl")}
            />
          </View>

          {/* Preview */}
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Preview</Text>
            <Text style={styles.previewValue}>{preview(PREVIEW_AMOUNT)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default CurrencySelectInput;

const styles = StyleSheet.create({
  // Dropdown shell
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 10,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    paddingRight: 45,
    paddingHorizontal: 10,
  },
  dropdownLabel: { fontFamily: "San-Medium", color: COLORS.TEXT_DARK },
  dropdownPlaceholder: { color: "#9CA3AF", fontFamily: "San-Medium" },
  dropdownSelected: { fontFamily: "San-Medium", color: COLORS.TEXT_DARK },

  // Chevron
  chevronWrapper: {
    position: "absolute",
    right: 14,
    top: Platform.select({ ios: 20, android: 22 }),
  },

  // Search field (inside modal)
  searchBoxInput: {
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
    fontSize: 15,
    borderWidth: 0,
    backgroundColor: COLORS.INPUT_BACKGROUND,
  },
  modalOptionsContainer: { paddingVertical: 16,borderWidth:1, },
  modalBackground: { backgroundColor: COLORS.BLACK_90 },

  // Option label (wrapping)
  optionLabel: {
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
    fontSize: 15,
    paddingVertical: 8,
    flex: 1,
    flexShrink: 1,
    flexWrap: "wrap",
  },

  // Chips
  subLabel: {
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
    fontSize: 16,
    marginTop: 8,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  chipText: { fontFamily: "San-SemiBold", fontSize: 14, color: COLORS.TEXT_DARK },

  // Preview
  previewBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontFamily: "San-Medium", color: "#9CA3AF" },
  previewValue: { fontFamily: "San-SemiBold", fontSize: 18, color: COLORS.TEXT_DARK },
});
