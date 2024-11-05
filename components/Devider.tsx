import { defaultShortCuts, ShortcutProps } from "@/styles/shortcuts";
import { View } from "react-native";

interface DeviderProps extends ShortcutProps {
  color?: string; // Màu
  mt?: number;    // Margin top
  mb?: number;    // Margin bottom
}

export function Devider({ color = "lightgray", mt, mb, ...props }: DeviderProps) {
  return (
    <View
      style={[
        defaultShortCuts(props),
        {
          backgroundColor: color,
          height: 1,
          marginTop: mt,
          marginBottom: mb,
        }
      ]}
    />
  );
}
