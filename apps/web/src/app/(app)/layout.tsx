import { AppShell } from "@/components/app/app-shell";
import { getSessionUser } from "@/lib/session";

import { MENU_ITEMS } from "shared";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const navItems = MENU_ITEMS.filter(
    (item) => item.web?.path && item.key !== "settings",
  );

  return (
    <AppShell
      navItems={navItems}
      user={{
        email: user.email,
        name: user.name,
        role: user.role,
        organizationLogoUrl: user.organizationLogoUrl ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
