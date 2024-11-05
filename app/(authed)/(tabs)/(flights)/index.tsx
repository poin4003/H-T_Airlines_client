import { useAuth } from "@/context/AuthContext";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Flight } from "@/types/flight";
import { UserRole } from "@/types/user";
import { flightService } from "@/services/flight";
import { Alert, TouchableOpacity, ScrollView } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { VStack } from "@/components/VStack";
import { HStack } from "@/components/HStack";
import { Text } from "@/components/Text";
import { Devider } from "@/components/Devider";
import { historyService } from "@/services/history";

export default function FlightScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [visibleTickets, setVisibleTickets] = useState<number | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);

  function onGoToFlightPage(id: number) {
    router.push(`/(flights)/flight/${id}`); 
  }

  function onGoToCreateTicket(flight_id: number) {
    router.push(`/(flights)/newTicket/${flight_id}`);
  }

  function onGotoTicketPage(id: number) {
    router.push(`/(flights)/ticket/${id}`);
  }

  async function buyTicket(ticketId: number) {
    try {
      await historyService.createOne(ticketId);
      Alert.alert("Success", "Success to buy ticket");
      fetchFlights();
    } catch (error) {
      Alert.alert("Error", "Failed to buy ticket");
    }
  }

  const conformBuyTicket = (ticketId: number) => {
    Alert.alert(
      "Confirm Purchase",
      "Are you sure you want to buy this ticket?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => buyTicket(ticketId),
        },
      ],
      { cancelable: false }
    );
  };

  const fetchFlights = async () => {
    try {
      setIsLoading(true);
      const response = await flightService.getAll();
      if (response) {
        setFlights(response?.data || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch flights");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchFlights(); }, []));

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Flight",
      headerRight: user?.role === UserRole.Manager ? headerRight : null,
    });
  }, [navigation, user]);



  const renderList = (flight: Flight) => { 
    const isOpen = visibleTickets === flight.ID;

    const toggleTickets = () => {
      setVisibleTickets(isOpen ? null : flight.ID);
    };

    return (
      <VStack
        key={flight?.ID}
        gap={20}
        p={20}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          marginTop: 15,
        }}
      >
        <TouchableOpacity onPress={
          () => {
            user?.role === UserRole.Manager ? onGoToFlightPage(flight?.ID) : ""}
          }
        >
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center">
              <Text fontSize={26}>{flight?.flight_number}</Text>
              <Text fontSize={26}> | </Text>
              <Text fontSize={26}>{flight?.aircraft_type}</Text>
            </HStack>
            {user?.role === UserRole.Manager && <TabBarIcon size={24} name="chevron-forward" />}
          </HStack>
        </TouchableOpacity>

        <Devider />

        <HStack justifyContent="space-between">
          <Text bold fontSize={16}>Departure: {flight?.departure_airport}</Text>
          <Text bold fontSize={16}>Arrival: {flight?.arrival_airport}</Text>
        </HStack>

        <Text fontSize={14} color='gray'>Departure time: {flight?.departure_time}</Text>
        <Text fontSize={14} color='gray'>Arrival time: {flight?.arrival_time}</Text>

        <Devider />

        {user?.role === UserRole.Manager ? (
          <HStack justifyContent="space-between">
            <TabBarIcon size={32} name="add-circle-outline" onPress={() => onGoToCreateTicket(flight.ID)}/>
            <TouchableOpacity onPress={toggleTickets} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text color="black" fontSize={14} bold>
                {isOpen ? 'Hide Tickets' : 'Show Tickets'}
              </Text>
              <TabBarIcon size={16} name={isOpen ? "chevron-up" : "chevron-down"} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </HStack>
          ) : (
          <HStack justifyContent="flex-end">
            <TouchableOpacity onPress={toggleTickets} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text color="black" fontSize={14} bold>
                {isOpen ? 'Hide Tickets' : 'Show Tickets'}
              </Text>
              <TabBarIcon size={16} name={isOpen ? "chevron-up" : "chevron-down"} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </HStack>
          )
        }

        {isOpen && (
          <VStack p={10}>
            {flight.ticket && flight.ticket.map(ticket => (
              <VStack gap={20} h={120} style={{ marginBottom: 15 }} key={ticket?.ID}>
                <HStack>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      if (user?.role === UserRole.Manager) {
                        if (ticket?.ID) {
                          onGotoTicketPage(ticket?.ID);
                        }
                      } else {
                        Alert.alert("Description", ticket?.description || "No description available");
                      }
                    }}
                    style={{
                      height: 120,
                      width: "69%",
                      padding: 20,
                      justifyContent: "space-between",
                      backgroundColor: "white",
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  > 
                    <HStack alignItems="center">
                      <Text fontSize={20} bold>{ticket?.ticket_type}</Text>
                      <Text fontSize={20} bold>|</Text>
                      <Text fontSize={16} bold>${ticket?.price}</Text>
                    </HStack>
                    <Text fontSize={12}>Available seat: {ticket?.available_seat}</Text>
                   
                  </TouchableOpacity>

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
              
                  <TouchableOpacity
                    onPress={() => {
                      if (ticket?.ID !== undefined) {
                        conformBuyTicket(ticket?.ID);
                      } else {
                        Alert.alert("Error", "Ticket ID is not available");
                      }
                    }}
                    style={{
                      height: 120,
                      width: "29%",
                      backgroundColor: "black",
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderColor: "black",
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                  <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Buy now</Text>
                </TouchableOpacity>
 
                </HStack>
              </VStack>
              ))}
            {flight.ticket.length === 0 && (
              <Text>No tickets available</Text>
            )}
          </VStack>
        )}
      </VStack> 
    );
  };

  return (
    <VStack flex={1} p={20} pb={0} gap={20}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} bold>{flights.length} Flights</Text>
      </HStack>
      <ScrollView>
        {flights.map((flight) => renderList(flight))}
      </ScrollView>
    </VStack>
  );
}

const headerRight = () => {
  return (
    <TabBarIcon size={32} name="add-circle-outline" onPress={() => router.push('/(flights)/newFlight')} />
  );
}
