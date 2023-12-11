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
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { useContext, useState } from "react";
import { BudgetContext, BudgetEntry } from "./budget-provider";

const DATE_FORMAT = "dd MMM";
export default function Home() {
  const { budgets, addEntry, entries, removeEntry } = useContext(BudgetContext);
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
      <div className="p-4 border rounded-xl">
        <div className="flex items-end space-x-2 mb-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              className="text-md"
              pattern="\d*"
              type="text"
              id="amount"
              placeholder="$"
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
      <div className="mt-6">
        <p className="text-center">History</p>
      </div>
      <div className="mt-2 flex flex-col overflow-x-hidden border rounded-xl">
        {entries
          .slice(0)
          .reverse()
          .map((entry) => (
            <EditableComponent
              key={entry.id}
              entry={entry}
              removeFn={removeEntry}
            />
          ))}
      </div>
    </main>
  );
}

function EditableComponent({
  entry,
  removeFn,
}: {
  entry: BudgetEntry;
  removeFn: (entry: BudgetEntry) => void;
}) {
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchCurrentX, setTouchCurrentX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const minSwipeDistance = 70;
  const swipeThreshold = 15; // Minimum movement to differentiate swipe from tap

  const move = (x: number) => {
    return Math.floor(x / 2) * -1;
  };
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(move(e.targetTouches[0].clientX));
    setTouchCurrentX(move(e.targetTouches[0].clientX)); // Initialize touchCurrentX
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentX = move(e.targetTouches[0].clientX);
    setTouchCurrentX(currentX);
    const movementX = Math.abs(touchStartX - currentX);
    if (movementX > swipeThreshold) {
      setIsSwiping(true);
    }
  };

  const onTouchEnd = () => {
    const swipeDistance = touchStartX - touchCurrentX;

    if (isSwiping && Math.abs(swipeDistance) > minSwipeDistance) {
      // Swipe left logic
      removeFn(entry);
    }

    // Reset state
    setTouchStartX(0);
    setTouchCurrentX(0);
    setIsSwiping(false);
  };

  // Calculate the card's position based on the swipe
  const cardStyle = {
    transform: isSwiping
      ? `translateX(${touchStartX - touchCurrentX}px)`
      : "translateX(0px)",
    transition: isSwiping
      ? "none"
      : "transform 0.3s ease, background 0.3s ease",
  };
  return (
    <div
      className={`py-2 flex px-4 space-x-8 items-center border-b last:border-b-0 ${
        isSwiping && Math.abs(touchStartX - touchCurrentX) > minSwipeDistance
          ? "bg-red-800 rounded-md"
          : ""
      }`}
      style={{ ...cardStyle }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="w-8 text-center leading-none">
        <span className="text-slate-700 text-xs">
          {format(entry.date, DATE_FORMAT)}
        </span>
      </div>
      <div className="flex justify-between  w-full">
        <span className="text-xs text-lime-600 p-1 font-bold text-left">
          {entry.category}
        </span>
        <div>${entry.amount}</div>
      </div>
    </div>
  );
}
