import { defaultShortCuts, ShortcutProps } from "@/styles/shortcuts";
import { PropsWithChildren } from "react";
import { TextProps, Text as RNText } from "react-native";

interface CustomTextProps extends PropsWithChildren, ShortcutProps, TextProps {
  fontSize?: number;
  bold?: boolean;
  underline?: boolean;
  color?: string;
}

export const Text = ({
  fontSize = 18,
  bold,
  underline,
  color,
  children,
  ...restProps
}: CustomTextProps) => {
  return (
    <RNText style={[defaultShortCuts(restProps), {
      fontSize,
      fontWeight: bold ? "bold" : "normal",
      textDecorationLine: underline ? "underline" : "none",
      color,
    }]} { ...restProps }>
      {children}
    </RNText>
  )
}