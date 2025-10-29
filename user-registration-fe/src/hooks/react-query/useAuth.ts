import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getAuthValueFromStorage, getUser, signIn, signOut, signUp } from "@/services/auth";

import { useToast } from "../use-toast";
import { useAuthStore } from "../useAuthStore";

export const authKeys = {
  key: ["authUser"] as const,
  detail: () => [...authKeys.key, "detail"] as const,
};

export const useSignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // const authUser = getAuthUser();
      // queryClient.setQueryData(authKeys.detail(), authUser);
      setAccessToken(data.accessToken);
      navigate({ to: "/" });
      toast({
        title: "Success",
        description: "You have successfully logged in",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: "/log-in" });
      toast({
        title: "Success",
        description: "You have successfully signed up",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignOut = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: "/log-in" });
      clearAccessToken();
      queryClient.clear();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUserProfile = () => {
  const token = getAuthValueFromStorage()?.accessToken;
  return useQuery({
    queryFn: getUser,
    queryKey: authKeys.detail(),
    enabled: Boolean(token),
    retry: false,
  });
};
