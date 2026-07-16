"use client";

import { useState, useEffect } from "react";
import { Camera, User, Lock, Building, MapPin, Sliders, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { me } from "@/services/auth.service";
import { apiClient } from "@/lib/api/client";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "organization", label: "Organization", icon: Building },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "preferences", label: "Preferences", icon: Sliders },
];

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [orgData, setOrgData] = useState<any>({});
  const [userData, setUserData] = useState<any>({ phone_number: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Fetch Organization Data
    apiClient.get("/organizations/my-organization/")
      .then(res => setOrgData(res.data))
      .catch(err => console.error("Failed to fetch organization", err));
      
    // Sync user phone number
    if (user && (user as any).phone_number) {
      setUserData({ phone_number: (user as any).phone_number });
    }
  }, [user]);

  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setOrgData({ ...orgData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      await apiClient.patch("/accounts/users/me/", { phone_number: userData.phone_number });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (e) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveOrganization = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      await apiClient.patch("/organizations/my-organization/", orgData);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (e) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isLogo: boolean = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    
    if (isLogo) {
      formData.append("logo", file);
      try {
        const res = await apiClient.patch("/organizations/my-organization/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setOrgData(res.data);
      } catch (err) { console.error("Logo upload failed", err); }
    } else {
      formData.append("profile_photo", file);
      try {
        await apiClient.patch("/accounts/users/me/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        const fresh = await me();
        useAuthStore.getState().setUser(fresh);
      } catch (err) { console.error("Photo upload failed", err); }
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:w-64 shrink-0">
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSaveStatus("idle"); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-[#4F7A57]/10 text-[#4F7A57]"
                    : "text-[#6B6B6B] hover:bg-[#F5F3EF] hover:text-[#1E1E1E]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 space-y-6">
        {saveStatus === "success" && (
          <div className="flex items-center gap-2 rounded-md bg-[#4F7A57]/10 p-3 text-sm text-[#4F7A57] border border-[#4F7A57]/20">
            <CheckCircle2 className="h-4 w-4" />
            Changes saved successfully.
          </div>
        )}
        {saveStatus === "error" && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-4 w-4" />
            Failed to save changes. Please try again.
          </div>
        )}

        {activeTab === "profile" && (
          <>
            <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#4F7A57]/10 text-[#4F7A57] overflow-hidden relative">
                  {user && (user as any).profile_photo ? (
                    <img src={(user as any).profile_photo} alt="Profile" className="object-cover w-full h-full" />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-[#1E1E1E]">Profile</h1>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    Manage your buyer profile, email, and photo settings.
                  </p>
                </div>
                <div className="relative">
                  <input type="file" id="profile_photo" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, false)} />
                  <label
                    htmlFor="profile_photo"
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#D8D3CC] bg-white px-4 text-sm font-medium text-[#1E1E1E] transition-colors hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4" />
                    Change photo
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-medium text-[#1E1E1E] mb-4">Personal Information</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#6B6B6B]">Username</label>
                  <input
                    type="text"
                    disabled
                    value={user?.username ?? ""}
                    className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-[#F5F3EF] px-3 py-2 text-[#1E1E1E] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6B6B]">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email ?? ""}
                    className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-[#F5F3EF] px-3 py-2 text-[#1E1E1E] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B6B6B]">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Add phone number"
                    value={userData.phone_number}
                    onChange={(e) => setUserData({ phone_number: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 text-[#1E1E1E] focus:border-[#4F7A57] focus:outline-none focus:ring-1 focus:ring-[#4F7A57] sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={saveProfile} disabled={isSaving} className="rounded-md bg-[#4F7A57] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d5e43] transition-colors disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "organization" && (
          <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium text-[#1E1E1E] mb-1">Company Details</h2>
                <p className="text-sm text-[#6B6B6B]">Manage your business profile and tax information.</p>
              </div>
              {orgData.is_verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4F7A57]/10 px-2.5 py-0.5 text-xs font-medium text-[#4F7A57]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Business
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 border border-yellow-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unverified
                </span>
              )}
            </div>

            <div className="flex gap-4 mb-6 items-center">
               <div className="h-16 w-16 shrink-0 rounded-md border border-[#D8D3CC] bg-white flex items-center justify-center overflow-hidden">
                 {orgData.logo ? (
                   <img src={orgData.logo} alt="Company Logo" className="object-contain w-full h-full p-1" />
                 ) : (
                   <Building className="h-6 w-6 text-[#6B6B6B]" />
                 )}
               </div>
               <div>
                  <input type="file" id="company_logo" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} />
                  <label htmlFor="company_logo" className="cursor-pointer text-sm font-medium text-[#4F7A57] hover:underline">
                    Upload Logo
                  </label>
                  <p className="text-xs text-[#6B6B6B] mt-1">Recommended size 256x256px.</p>
               </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B6B6B]">Company Name</label>
                <input type="text" name="name" value={orgData.name || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B6B6B]">Description</label>
                <textarea name="description" value={orgData.description || ""} onChange={handleOrgChange} rows={3} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Business Registration Number</label>
                <input type="text" name="registration_number" value={orgData.registration_number || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Tax ID / VAT Number (TIN)</label>
                <input type="text" name="tax_id_number" value={orgData.tax_id_number || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Company Email</label>
                <input type="email" name="email" value={orgData.email || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Company Phone</label>
                <input type="tel" name="phone_number" value={orgData.phone_number || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Industry</label>
                <input type="text" name="industry" value={orgData.industry || ""} onChange={handleOrgChange} placeholder="e.g. Manufacturing, Retail" className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Business Type</label>
                <select name="business_type" value={orgData.business_type || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm text-[#1E1E1E]">
                  <option value="">Select Type</option>
                  <option value="LLC">LLC</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Year Established</label>
                <input type="number" name="year_established" value={orgData.year_established || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Number of Employees</label>
                <select name="number_of_employees" value={orgData.number_of_employees || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm text-[#1E1E1E]">
                  <option value="">Select Range</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B6B6B]">Website</label>
                <input type="url" name="website" value={orgData.website || ""} onChange={handleOrgChange} placeholder="https://" className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
            </div>
            
            <hr className="my-6 border-[#D8D3CC]" />
            <h3 className="text-md font-medium text-[#1E1E1E] mb-4">Location</h3>
            <div className="grid gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Country</label>
                <input type="text" name="country" value={orgData.country || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">State/Province</label>
                <input type="text" name="state" value={orgData.state || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">City</label>
                <input type="text" name="city" value={orgData.city || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#6B6B6B]">Full Street Address</label>
                <input type="text" name="address" value={orgData.address || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B6B6B]">Postal Code</label>
                <input type="text" name="postal_code" value={orgData.postal_code || ""} onChange={handleOrgChange} className="mt-1 block w-full rounded-md border border-[#D8D3CC] bg-white px-3 py-2 sm:text-sm" />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={saveOrganization} disabled={isSaving} className="rounded-md bg-[#4F7A57] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d5e43] transition-colors disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Company Info"}
              </button>
            </div>
          </section>
        )}

        {/* ... (Security, Addresses, Preferences unchanged for brevity) ... */}
        {activeTab === "security" && (
           <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 sm:p-6 shadow-sm">
             <h2 className="text-lg font-medium text-[#1E1E1E] mb-1">Security Settings</h2>
             <p className="text-sm text-[#6B6B6B] mb-6">Manage your password and authentication methods.</p>
             <p className="text-sm text-[#6B6B6B]">Contact support to change password.</p>
           </section>
        )}
        
        {activeTab === "addresses" && (
           <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 sm:p-6 shadow-sm">
             <h2 className="text-lg font-medium text-[#1E1E1E] mb-1">Address Book</h2>
             <p className="text-sm text-[#6B6B6B] mb-6">Address book feature coming soon.</p>
           </section>
        )}

        {activeTab === "preferences" && (
           <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 sm:p-6 shadow-sm">
             <h2 className="text-lg font-medium text-[#1E1E1E] mb-1">Preferences</h2>
             <p className="text-sm text-[#6B6B6B] mb-6">Preferences feature coming soon.</p>
           </section>
        )}

      </div>
    </div>
  );
}
