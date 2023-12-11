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
import { addDays, format, isWithinInterval, subDays } from "date-fns";
import { nanoid } from "nanoid";
import { useContext, useState } from "react";
import { BudgetContext, BudgetEntry } from "./budget-provider";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@app/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@app/components/ui/calendar";
import { DateRange } from "react-day-picker";

const DATE_FORMAT = "dd MMM";
const DEFAULT_AMOUNT = "0.00";
const DEFAULT_DATE = {
  from: subDays(new Date(), 7),
  to: new Date(),
};
export default function Home() {
  const { budgets, addEntry, entries, removeEntry } = useContext(BudgetContext);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [date, setDate] = useState<DateRange | undefined>(DEFAULT_DATE);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const targetValue = e.target.value;
    const numericValue = targetValue.replace(/\D/g, "");
    const dollarValue = (parseInt(numericValue, 10) / 100).toFixed(2);
    if (!isNaN(+dollarValue)) setAmount(dollarValue);
  };
  const handleAddEntry = () => {
    if (category === "" || Number(amount) <= 0) return;
    const date = new Date().getTime();
    const id = nanoid();
    addEntry({ amount, category, date, id });

    // Cleanup
    setAmount(DEFAULT_AMOUNT);
    setCategory("");
  };

  const rangeFilter = (entry: BudgetEntry) => {
    const entryDate = new Date(entry.date);
    const interval = {
      start: date?.from || DEFAULT_DATE.from,
      end: date?.to || DEFAULT_DATE.to,
    };
    interval.start = subDays(interval.start, 1);
    interval.end = addDays(interval.end, 1);

    const result = isWithinInterval(entry.date, interval);
    console.log({ entryDate, interval, result });
    return result;
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
              max="2500"
              value={`$${amount}`}
              onChange={handleInputChange}
            />
          </div>
          <Select onValueChange={(val) => setCategory(val)} value={category}>
            <SelectTrigger className="w-[380px] truncate">
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
        <DateFilterButton onDateSet={setDate} date={date} />
      </div>
      <div className="mt-2 flex flex-col overflow-x-hidden border rounded-xl">
        {entries
          .filter(rangeFilter)
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
        <span className="text-muted-foreground text-xs">
          {format(entry.date, DATE_FORMAT)}
        </span>
      </div>
      <div className="flex justify-between w-full">
        <span className="text-xs text-lime-600 p-1 font-bold text-left">
          {entry.category}
        </span>
        <div>${entry.amount}</div>
      </div>
    </div>
  );
}

function DateFilterButton({
  onDateSet,
  date,
}: {
  onDateSet: (range: DateRange | undefined) => void;
  date: DateRange | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="link" className="text-xs">
          <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground mr-2" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mx-auto">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onDateSet}
        />
      </PopoverContent>
    </Popover>
  );
}
