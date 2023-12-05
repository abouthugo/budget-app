"use client";
import { ReactNode, createContext, useEffect, useState } from "react";

interface Budgets {
  [key: string]: number;
}

export type BudgetEntry = {
  id: string;
  category: string;
  amount: string;
  date: number;
};

interface BudgetContextType {
  budgets: Budgets;
  entries: BudgetEntry[];
  addEntry: (entry: BudgetEntry) => void;
  editEntry: (editedEntry: BudgetEntry) => void;
  addBudget: (budget: string) => void;
  removeBudget: (budget: string) => void;
}

// Create the context with initial default values
export const BudgetContext = createContext<BudgetContextType>({
  budgets: { dining: 0, transport: 0, misc: 0 },
  entries: [],
  addEntry: () => {},
  editEntry: () => {},
  addBudget: () => {},
  removeBudget: () => {},
});

interface BudgetProviderProps {
  children: ReactNode;
}

const BUDGETS = "budgets";
const ENTRIES = "entries";
export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [budgets, setBudgets] = useState<Budgets>({
    dining: 0,
    transport: 0,
    misc: 0,
  });
  const [entries, setEntries] = useState<BudgetEntry[]>([]);

  const addEntry = (entry: BudgetEntry) => {
    const newEntries = [...entries, entry];
    const newBudgets = {
      ...budgets,
      [entry.category]: budgets[entry.category] + Number(entry.amount),
    };
    setEntries(newEntries);
    setBudgets(newBudgets);
    localStorage.setItem(ENTRIES, JSON.stringify(newEntries));
    localStorage.setItem(BUDGETS, JSON.stringify(newBudgets));
  };

  const editEntry = (editedEntry: BudgetEntry) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === editedEntry.id ? editedEntry : entry
    );
    setEntries(updatedEntries);
    // TODO@hugo: Implement logic to update totals
  };

  const addBudget = (budget: string) => {
    if (Object.keys(budgets).includes(budget)) return;
    const updatedBudgets = { ...budgets, [budget]: 0 };
    setBudgets(updatedBudgets);
    localStorage.setItem(BUDGETS, JSON.stringify(updatedBudgets));
  };

  const removeBudget = (budget: string) => {
    if (!Object.keys(budgets).includes(budget)) return;
    const updatedBudgets = JSON.parse(JSON.stringify(budgets));
    delete updatedBudgets[budget];
    setBudgets(updatedBudgets);
    localStorage.setItem(BUDGETS, JSON.stringify(updatedBudgets));
  };

  useEffect(() => {
    const savedBudgets = localStorage.getItem(BUDGETS);
    const savedEntries = localStorage.getItem(ENTRIES);
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
  }, []);

  return (
    <BudgetContext.Provider
      value={{ budgets, entries, addEntry, editEntry, addBudget, removeBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
