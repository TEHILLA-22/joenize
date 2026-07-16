import axios from "axios";
import { useOrganizationStore } from "@/stores/organization-store";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://joenize-back.onrender.com/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const organization =
    useOrganizationStore.getState().activeOrganization;

  if (organization) {
    config.headers["X-Organization-ID"] =
      organization.id;
  }

  return config;
});




