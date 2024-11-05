import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { Text } from "@/components/Text"
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Input } from "@/components/Input";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Devider } from "@/components/Devider";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { authenticate, isLoadingAuth, toggleAuthMode, authMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onAuthentication() {
    await authenticate(authMode, { email, password })
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <VStack flex={1} justifyContent="center" alignItems="center" p={10} gap={40}>
          <HStack gap={10}>
            <Text fontSize={30} bold mb={20}>H&T Airline</Text>
            <TabBarIcon name="airplane-outline" size={50} />
          </HStack>
          <VStack w={"100%"} gap={30}>
            <VStack gap={5}>
              <Text ml={10} fontSize={14} color="gray">Email</Text>
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
              <Text ml={10} fontSize={14} color="gray">Password</Text>
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

            <Button
              isLoading={isLoadingAuth}
              onPress={onAuthentication}
            >
              {authMode === "login" ? "Login" : "Register"}
            </Button>
          </VStack>
          <Devider w={"90%"} />
          <Text fontSize={16} underline onPress={toggleAuthMode}>
            {
              authMode === "login" ? "Register new account" : "Login now"
            }
          </Text>

        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}