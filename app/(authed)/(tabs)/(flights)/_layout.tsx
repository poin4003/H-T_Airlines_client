import { Stack } from "expo-router";

export default function FlightLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Flights" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="newFlight" />
      <Stack.Screen name="newTicket/[flight_id]" />
      <Stack.Screen name="flight/[id]" />
      <Stack.Screen name="ticket/[id]" />
    </Stack>
  );
}