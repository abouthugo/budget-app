"use clident";

import { BudgetProvider } from "./budget-provider";
import { ThemeProvider } from "./theme-provider";

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BudgetProvider>{children}</BudgetProvider>
    </ThemeProvider>
  );
}
