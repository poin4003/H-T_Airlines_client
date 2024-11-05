import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { Text } from "@/components/Text";
import { SafeAreaView, KeyboardAvoidingView, ScrollView } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Input } from "@/components/Input";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Devider } from "@/components/Devider";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { authenticate, toggleAuthMode, isLoadingAuth } = useAuth();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [identity_id, setIdentityId] = useState('');
  const [passport, setPassport] = useState('');

  async function onRegister() {
    const credentials = { email, password, first_name, last_name, phone_number, identity_id, passport };
    await authenticate('register', credentials);
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView style={{ alignItems: "center", justifyContent: "center" }}>
        <ScrollView>
          <VStack flex={1} justifyContent="center" alignItems="center" p={10} gap={40}>
            <HStack gap={10}>
              <Text fontSize={30} bold mb={20}>H&T Airline</Text>
              <TabBarIcon name="airplane-outline" size={50} />
            </HStack>
            <VStack w={"100%"} gap={30}>
              <HStack w={"100%"} gap={10}>
                <Input
                  value={first_name}
                  onChangeText={setFirstName}
                  placeholder="Firstname"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  w={"48.5%"}
                  p={14}
                />
                <Input
                  value={last_name}
                  onChangeText={setLastName}
                  placeholder="Lastname"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  w={"48.5%"}
                  p={14}
                />
              </HStack>
              <VStack gap={5}>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  p={14}
                />
              </VStack>
              <VStack gap={5}>
                <Input
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  p={14}
                />
              </VStack>
              <VStack gap={5}>
                <Input
                  value={phone_number}
                  onChangeText={setPhoneNumber}
                  placeholder="PhoneNumber"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  p={14}
                />
              </VStack>
              <VStack gap={5}>
                <Input
                  value={identity_id}
                  onChangeText={setIdentityId}
                  placeholder="IdentityId"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  p={14}
                />
              </VStack>
              <VStack gap={5}>
                <Input
                  value={passport}
                  onChangeText={setPassport}
                  placeholder="Passport"
                  placeholderTextColor="darkgray"
                  autoCapitalize="none"
                  autoCorrect={false}
                  h={48}
                  p={14}
                />
              </VStack>
              <Button
                isLoading={isLoadingAuth}
                onPress={onRegister}
              >
                {"Register"}
              </Button>
            </VStack>

            <Devider w={"90%"} />
            <Text fontSize={16} underline onPress={toggleAuthMode}>
              {"Login now"}
            </Text>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
