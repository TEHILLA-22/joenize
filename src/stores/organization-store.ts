import { create } from "zustand";

interface Organization {
  id: string;
  name: string;
}

interface OrganizationStore {
  activeOrganization: Organization | null;

  setOrganization: (
    organization: Organization | null
  ) => void;
}

export const useOrganizationStore =
  create<OrganizationStore>((set) => ({
    activeOrganization: null,

    setOrganization: (organization) =>
      set({
        activeOrganization: organization,
      }),
  }));