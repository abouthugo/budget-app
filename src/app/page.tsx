"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import { formatRelative } from "date-fns";
import { nanoid } from "nanoid";
import { useContext, useState } from "react";
import { BudgetContext, BudgetEntry } from "./budget-provider";

const DATE_FORMAT = "MMM do h:mm a";
export default function Home() {
  const { budgets, addEntry, entries } = useContext(BudgetContext);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const targetValue = e.target.value;
    if (!isNaN(+targetValue)) setAmount(targetValue);
  };
  const handleAddEntry = () => {
    if (category === "" || Number(amount) <= 0) return;
    const date = new Date().getTime();
    const id = nanoid();
    addEntry({ amount, category, date, id });

    // Cleanup
    setAmount("");
    setCategory("");
  };
  return (
    <main className="">
      <h1 className="text-xl font-bold pb-5">Entries</h1>
      <div className="p-6 border rounded-md">
        <div className="flex items-end space-x-2 mb-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="text"
              id="amount"
              placeholder="Enter quantity"
              step="0.01"
              max="2500"
              value={amount}
              onChange={handleInputChange}
            />
          </div>
          <Select onValueChange={(val) => setCategory(val)} value={category}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Budgets</SelectLabel>
                {Object.keys(budgets).map((budget, index) => (
                  <SelectItem value={budget} key={`${budget}-${index}`}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAddEntry}
            className="bg-gradient-to-r from-lime-500 to-cyan-500"
          >
            Add Entry
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-col space-y-2">
        <p className="text-center">History</p>
        {entries.map((entry) => (
          <EditableComponent key={entry.id} entry={entry} />
        ))}
      </div>
    </main>
  );
}

function EditableComponent({ entry }: { entry: BudgetEntry }) {
  return (
    <div className="py-2 px-3 flex justify-between">
      <div>
        <span className="text-xs text-lime-600 p-1 font-bold">
          {entry.category}
        </span>
      </div>
      <div className="flex space-x-8">
        <div>{formatRelative(entry.date, new Date())}</div>
        <div>${entry.amount}</div>
      </div>
    </div>
  );
}
