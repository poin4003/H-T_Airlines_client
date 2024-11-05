import { Redirect, Stack, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  return (
    <>
      {!isLoggedIn ? (
        <Redirect href="/login" />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </>
  )
}