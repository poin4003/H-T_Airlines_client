import React from "react";
import { Platform } from "react-native";
import { HStack } from "./HStack";
import { Text } from "./Text";
import { Button } from "./Button";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { VStack } from "./VStack";

interface DateTimePickerProps {
  onChange: (date: Date) => void;
  currentDate: Date;
}

export default function DateTimePicker(props: DateTimePickerProps) {
  if (Platform.OS === 'android') {
    return <AndroidDateTimePicker {...props} />
  }

  if (Platform.OS === 'ios') {
    return <IOSDateTimePicker {...props} />
  }

  return null;
}

export const AndroidDateTimePicker = ({ onChange, currentDate }: DateTimePickerProps) => {
  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (_, date?: Date) => onChange(date || new Date()),
      mode: "date",
    });
  };

  const showTimepicker = () => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (_, date?: Date) => onChange(date || new Date()),
      mode: "time",
    });
  };

  return (
    <VStack alignItems="center" justifyContent="space-between">
      <Text>{currentDate.toLocaleString()}</Text>
      <HStack gap={5}>
        <Button onPress={showDatepicker}>Open Calendar</Button>
        <Button onPress={showTimepicker}>Open Time Picker</Button>
      </HStack>
    </VStack>
  )
}

export const IOSDateTimePicker = ({ onChange, currentDate }: DateTimePickerProps) => {
  return (
    <RNDateTimePicker
      style={{ alignSelf: "flex-start" }}
      accentColor="black"
      minimumDate={new Date()}
      value={currentDate}
      mode={"datetime"}
      display='default'
      onChange={(_, date) => onChange(date || new Date())}
    />
  )
}
