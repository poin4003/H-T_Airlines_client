import { VStack } from "@/components/VStack";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ticketService } from "@/services/ticket";
import { Ticket } from "@/types/ticket";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TicketDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState<Ticket | undefined>(undefined);
  
  function updateFiled(field: keyof Ticket, value: string | number) {
    setTicketData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }

  const onDelete = useCallback(async () => {
    if (!ticketData) return;
        try {
          Alert.alert("Delete Flight", "Are you sure want to delete this flight?", [
        { text: "Cancel" },
        {
          text: "Delete", onPress: async () => {
            await ticketService.deleteOne(Number(id));
            router.back();
          }
        }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to delete flight")
    }
  }, [ticketData, id]);

  async function onSubmitChanges() {
    if (!ticketData) return;
    try {
      setIsSubmitting(true);
      await ticketService.updateOne(Number(id),
        ticketData.price,
        ticketData.ticket_type,
        ticketData.description,
        ticketData.available_seat,
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
    router.back();
  } 

  const fetchTicket = async () => {
    try {
      const response = await ticketService.getOne(Number(id));
      setTicketData(response?.data?.ticket);
    } catch (error) {
      router.back();
    }
  };

  useFocusEffect(useCallback(() => {
    fetchTicket();
  }, [id]));

  useEffect(() => {
    navigation.setOptions({ 
      headerTitle: "",
      headerRight: () => headerRight(onDelete)
  });
    console.log(ticketData);
  }, [navigation, onDelete]);

  return (
    <ScrollView>
      <VStack m={20} flex={1} gap={30}>
        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Price:</Text>
          <Input
            value={ String(ticketData?.price) }
            onChangeText={(value) => updateFiled("price", value)}
            placeholder="Price"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Type:</Text>
          <Input
            value={ ticketData?.ticket_type }
            onChangeText={(value) => updateFiled("ticket_type", value)}
            placeholder="Ticket type"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Description:</Text>
          <Input
            value={ ticketData?.description }
            onChangeText={(value) => updateFiled("description", value)}
            placeholder="departure airport"
            placeholderTextColor="darkgray"
            h={ 48 }
            p={ 14 }
          />
        </VStack>

        <VStack gap={5}>
          <Text ml={10} fontSize={14} color="gray">Available seat:</Text>
          <Input
            value={ String(ticketData?.available_seat) }
            onChangeText={(value) => updateFiled("available_seat", value)}
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
          onPress={() => onSubmitChanges()} 
        >
          Save changes
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
