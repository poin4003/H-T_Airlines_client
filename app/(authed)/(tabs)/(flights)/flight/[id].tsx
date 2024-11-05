import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { VStack } from "@/components/VStack";
import { flightService } from "@/services/flight";
import { Flight } from "@/types/flight";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router"
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import DateTimePicker from "@/components/DatetimePicker";
import { Button } from "@/components/Button";

export default function FlightDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flightData, setFlightData] = useState<Flight | null>(null);

  function updateFiled(field: keyof Flight, value: string | Date) {
    setFlightData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }

  const onDelete = useCallback(async () => {
    if (!flightData) return;
    try {
      Alert.alert("Delete Flight", "Are you sure want to delete this flight?", [
        { text: "Cancel" },
        {
          text: "Delete", onPress: async () => {
            await flightService.deleteOne(Number(id));
            router.back();
          }
        }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to delete flight")
    }
  }, [flightData, id])

  async function onSubmitChanges() {
    if (!flightData) return;
    try {
      setIsSubmitting(true);
      await flightService.updateOne(Number(id),
        flightData.flight_number,
        flightData.departure_airport,
        flightData.arrival_airport,
        flightData.departure_time,
        flightData.arrival_time,
        flightData.aircraft_type
      );
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update flight");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fetchFlight = async () => {
    try {
      const response = await flightService.getOne(Number(id));
      setFlightData(response.data);
    } catch (error) {
      router.back();
    }
  };

  useFocusEffect(useCallback(() => {
    fetchFlight();
  }, []));

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => headerRight(onDelete)
    });
  }, [navigation, onDelete]);

  return (
    <ScrollView>
      <VStack m={20} flex={1} gap={30}>
        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Flight number:</Text>
          <Input
            value={ flightData?.flight_number }
            onChangeText={(value) => updateFiled("flight_number", value)}
            placeholder="flight number"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Aircraft:</Text>
          <Input
            value={ flightData?.aircraft_type }
            onChangeText={(value) => updateFiled("aircraft_type", value) }
            placeholder="Aircraft type"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Departure airport:</Text>
          <Input
            value={ flightData?.departure_airport }
            onChangeText={(value) => updateFiled("departure_airport", value)}
            placeholder="departure airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Arrival airport:</Text>
          <Input
            value={ flightData?.arrival_airport }
            onChangeText={(value) => updateFiled("arrival_airport", value)}
            placeholder="arrival airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Departure time:</Text>
          <DateTimePicker 
            onChange={(date) => updateFiled("departure_time", date)} 
            currentDate={new Date(flightData?.departure_time || new Date())}
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Arrival time:</Text>
          <DateTimePicker 
            onChange={(date) => updateFiled("arrival_time", date)} 
            currentDate={new Date(flightData?.arrival_time || new Date())}
          />
        </VStack>

        <Button
          mt={ "auto" } 
          isLoading={ isSubmitting }
          disabled={ isSubmitting }
          onPress={ onSubmitChanges }
        >
          Save Changes
        </Button>
      </VStack>
    </ScrollView>
  );
}

const headerRight = (onPress: VoidFunction) => {
  return (
    <TabBarIcon size={30} name={"trash"} onPress={onPress} />
  );
};