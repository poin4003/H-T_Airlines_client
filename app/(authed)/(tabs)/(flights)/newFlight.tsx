import { VStack } from "@/components/VStack";
import { flightService } from "@/services/flight";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import DateTimePicker from "@/components/DatetimePicker";
import { Button } from "@/components/Button";

export default function NewFlight() {
  const navigation = useNavigation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flight_number, setFlightNumber] = useState('');
  const [departure_airport, setDepartureAirport] = useState('');
  const [arrival_airport, setArrivalAirport] = useState('');
  const [departure_time, setDepartureTime] = useState(new Date());
  const [arrival_time, setArrivalTime] = useState(new Date());
  const [aircraft_type, setAircraftType] = useState('');

  async function onSubmit() {
    try {
      setIsSubmitting(true);

      await flightService.createOne(
        flight_number, 
        departure_airport,
        arrival_airport,
        departure_time,
        arrival_time,
        aircraft_type,
      );
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create flight");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onChangeDepartureTime(departureTime?: Date) {
    setDepartureTime(departureTime || new Date());
  }

  function onChangeArrivalTime(arrirvalTime?: Date) {
    setArrivalTime(arrirvalTime || new Date());
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: "New Flight" });
  }, []);

  return (
    <ScrollView>
      <VStack m={20} flex={1} gap={30}>
        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Flight number:</Text>
          <Input
            value={ flight_number }
            onChangeText={ setFlightNumber }
            placeholder="flight number"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Aircraft:</Text>
          <Input
            value={ aircraft_type }
            onChangeText={ setAircraftType }
            placeholder="Aircraft type"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Departure airport:</Text>
          <Input
            value={ departure_airport }
            onChangeText={ setDepartureAirport }
            placeholder="departure airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Arrival airport:</Text>
          <Input
            value={ arrival_airport }
            onChangeText={ setArrivalAirport }
            placeholder="arrival airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Departure time:</Text>
          <DateTimePicker onChange={onChangeDepartureTime} currentDate={departure_time}/>
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Arrival time:</Text>
          <DateTimePicker onChange={onChangeArrivalTime} currentDate={arrival_time}/>
        </VStack>

        <Button
          mt={ "auto" } 
          isLoading={ isSubmitting }
          disabled={ isSubmitting }
          onPress={ onSubmit }
        >
          Save
        </Button>
      </VStack>
    </ScrollView>
  );
}
