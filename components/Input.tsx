import { defaultShortCuts, ShortcutProps } from "@/styles/shortcuts";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends ShortcutProps, TextInputProps {

}

export function Input(props: InputProps) {
  return (
    <TextInput
      {...props}
      selectionColor="black"
      style={[defaultShortCuts(props), {
        fontSize: 16,
        borderRadius: 16,
        backgroundColor: "lightgray",
        color: "black",
      }]} 
    />
  )
}