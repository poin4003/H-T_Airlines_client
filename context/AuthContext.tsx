import { LoginCredentials, RegisterCredentials, userService } from "@/services/user";
import { User } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface AuthContextProps {
  isLoggedIn: boolean
  isLoadingAuth: boolean
  authenticate: (authMode: "login" | "register", credentials: LoginCredentials | RegisterCredentials) => Promise<void>
  logout: VoidFunction;
  user: User | null;
  authMode: "login" | "register";
  toggleAuthMode: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthenticationProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function checkIfLoggedIn() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        setIsLoggedIn(true);
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        router.replace("/(authed)");
      } else {
        setIsLoggedIn(false);
        setToken(null);
        setUser(null);
      }
    }

    checkIfLoggedIn();
  }, []);

  const toggleAuthMode = () => {
    if (authMode === "login") {
      setAuthMode("register");
      router.replace('/register');
    } else {
      setAuthMode("login");
      router.replace('/login');
    }
  };

  async function authenticate(authMode: "login" | "register", credentials: LoginCredentials | RegisterCredentials): Promise<void> {
    try {
      setIsLoadingAuth(true);

      let response;

      if (authMode === 'register') {

        if (isRegisterCredentials(credentials)) {
          response = await userService.register(credentials);
          if (response?.status === "fail") {
            Alert.alert("Error", response?.message)
            return;
          }
        } else {
          Alert.alert("Error", response)
          throw new Error("Invalid credentials for registration");
        }
      } else {
        response = await userService.login(credentials); 
      }

      if (response?.status !== "fail") {
        setIsLoggedIn(true);

        await AsyncStorage.setItem("token", response?.data?.token || "");
        await AsyncStorage.setItem("user", JSON.stringify(response?.data?.user) || "");
        setToken(response?.data?.token as string);
        setUser(response?.data?.user as User);
        router.replace("/(authed)");
      } else {
          Alert.alert("Error", response?.message)
          return
      }

    } catch (error: any) {
      Alert.alert("Error", error)
      setIsLoggedIn(false);
      console.log(error);
    } finally {
      setIsLoadingAuth(false);
    }
  }

  function isRegisterCredentials(credentials: LoginCredentials | RegisterCredentials): credentials is RegisterCredentials {
    return (credentials as RegisterCredentials).first_name !== undefined;
  }

  async function logout() {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        logout,
        toggleAuthMode,
        isLoadingAuth,
        isLoggedIn,
        user,
        authMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}