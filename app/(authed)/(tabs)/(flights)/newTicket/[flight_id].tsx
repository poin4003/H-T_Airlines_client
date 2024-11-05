import { VStack } from "@/components/VStack";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ticketService } from "@/services/ticket";

export default function NewTicket() {
  const navigation = useNavigation();
  const { flight_id } = useLocalSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [ticket_type, setTicketType] = useState('');
  const [description, setDescription] = useState('');
  const [available_seat, setAvailableSeat] = useState<number>(0);

  async function onSubmit() {
    try {
      console.log(flight_id);
      setIsSubmitting(true);

      await ticketService.createOne(
        Number(flight_id),
        price,
        ticket_type,
        description,
        available_seat,
      );
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: "New ticket" });
  }, []);

  return (
    <ScrollView>
      <VStack m={20} flex={1} gap={30}>
        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Price:</Text>
          <Input
            value={ String(price) }
            onChangeText={(text) => setPrice(parseFloat(text) || 0)}
            placeholder="Price"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Type:</Text>
          <Input
            value={ ticket_type }
            onChangeText={ setTicketType }
            placeholder="Ticket type"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Description:</Text>
          <Input
            value={ description }
            onChangeText={ setDescription }
            placeholder="departure airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Available seat:</Text>
          <Input
            value={ String(available_seat) }
            onChangeText={(text) => setAvailableSeat(parseInt(text) || 0) }
            placeholder="arrival airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
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
