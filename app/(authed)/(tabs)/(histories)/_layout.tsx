import { Stack } from 'expo-router';

export default function TicketsLayout() {
  return (
    <Stack screenOptions={ { headerBackTitle: "Histories" } }>
      <Stack.Screen name="index" />
    </Stack>
  )
}