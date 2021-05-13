import {StyleSheet, css} from "aphrodite/no-important";

export const Colors = {
  warmOrange: "#EDAD47",
  lightYellow: "#EDC747",
  darkGrey: "#303531",
  primaryBlack: "#1D1D1C",
  secondaryGrey1: "#E9EDEC",
  secondaryGrey2: "#D7DADD",
  secondaryGrey3: "#A5ABAD",
  secondaryGrey4: "#8E8F91",
  limeGreen: "#51DD78",
  lightPurple: "#E679F8",
  purple: "#FB2FFF",
  blue: "#2D88DC",
  mustard: "#D4DB89",
  green: "#388525",
  carolinaBlue: "#3AD0FF",
};

export const colorForType = (type) => {
  switch (type) {
    case "PERSON":
      return Colors.lightPurple;
      break;
    case "PRIORITY":
      return Colors.limeGreen;
      break;
    case "CONTRIBUTION":
      return Colors.purple;
      break;
    default:
      throw new Error("unsupported type");
  }
};

export const cssStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.warmOrange,
    color: Colors.primaryBlack,
    padding: "12px",
    marginTop: "20px",
    border: "none",
    fontSize: "10pt",
  },
  label: {},
  row: {
    display: "block",
    marginTop: "20px",
  },
  input: {
    marginLeft: "15px",
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    border: "none",
    borderBottom: "1px solid " + Colors.secondaryGrey1,
    width: "60%",
    color: Colors.secondaryGrey4,
    height: "20px",
  },
});
