import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { History } from "@/types/history";
import { Alert } from "react-native";
import { historyService } from "@/services/history";
import { VStack } from "@/components/VStack";
import { HStack } from "@/components/HStack";
import { Text } from "@/components/Text";
import { ScrollView } from "react-native";
import { Devider } from "@/components/Devider";

export default function HistoryScreen() {
  const navigation = useNavigation();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ bookingHistories, setBookingHistories ] = useState<History[]>([]);

  async function fetchBookingHistories() {
    try {
      setIsLoading(true);
      const response = await historyService.getAll();
      setBookingHistories(response.data);
      console.log(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => { fetchBookingHistories(); }, []));

  useEffect(() => {
    navigation.setOptions({ headerTitle: "Histories" });
  }, [navigation]);

  return (
    <VStack flex={1} p={20} pb={0} gap={20}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} bold>{bookingHistories.length} Booking histories</Text>
      </HStack>
      <ScrollView>
        {bookingHistories.map((bookingHistory) => (
          <VStack gap={20} h={120} style={{ marginBottom: 15 }} key={bookingHistory.ID}>
            <HStack>
              <VStack
                h={120} 
                w={"69%"}
                p={20}
                justifyContent="space-between"
                style={{
                  backgroundColor: "white",
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <HStack alignItems="center">
                  <Text fontSize={22} bold>{bookingHistory?.ticket?.flight?.flight_number}</Text>
                  <Text fontSize={22} bold>|</Text>
                  <Text fontSize={16} numberOfLines={2} bold>
                    {bookingHistory?.ticket?.ticket_type}
                  </Text>
                </HStack>

                <Text fontSize={12} mt={12}>Total: ${bookingHistory?.total_amount}</Text> 
                <Text fontSize={12}>Arrival Time: {bookingHistory?.ticket?.flight?.arrival_time}</Text>
              </VStack>
              
              <VStack
                h={110}
                w={"1%"}
                style={{
                  alignSelf: "center",
                  borderColor: "lightgray",
                  borderWidth: 2,
                  borderStyle: 'dashed',
                }}
              />

              <VStack
                h={120}
                w={"29%"}
                justifyContent="center"
                alignItems="center"
                style={{
                  backgroundColor: "white",
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <Text fontSize={14} bold>GATE:</Text>
                <Text mt={4} fontSize={14}>{bookingHistory?.gate}</Text>
                <Devider mt={3} mb={3} /> 
                <Text fontSize={14} bold>SEAT:</Text>
                <Text mt={4} fontSize={14}>{bookingHistory?.seat_number}</Text>
              </VStack>
            </HStack>
          </VStack>
        ))}
        <VStack h={20}/>
      </ScrollView>
    </VStack>
  );
}