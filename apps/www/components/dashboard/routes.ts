export type DashRoute = {
  path: string;
  label: string;
  icon?: string; // lucide-react name if you add icons later
};

export const DASH_ROUTES: DashRoute[] = [
  { path: "/dashboard", label: "Overview" },
  { path: "/dashboard/groups", label: "My Groups" },
  { path: "/dashboard/business", label: "My Business Listings" },
  { path: "/dashboard/boost", label: "Boosts" },
  { path: "/dashboard/analytics", label: "Analytics" },
  { path: "/dashboard/import-export", label: "Import & Export" },
  { path: "/dashboard/support", label: "Support" },
  { path: "/dashboard/billing", label: "Billing & Payments" },
  { path: "/dashboard/referrals", label: "Referrals" },
  { path: "/dashboard/profile", label: "Profile" },
  { path: "/dashboard/settings", label: "Settings" },
];
