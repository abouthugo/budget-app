"use client";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { useContext, useState } from "react";
import { BudgetContext } from "../budget-provider";

export default function BudgetPage() {
  const [newCategory, setNewCategory] = useState("");
  const { budgets, addBudget } = useContext(BudgetContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newCategory.trim() === "") {
      alert("Please enter a category name.");
      return;
    }
    if (budgets.hasOwnProperty(newCategory)) {
      alert("This category already exists.");
      return;
    }

    // Update budgets with the new category
    addBudget(newCategory);
    setNewCategory("");
  };

  const getTotal = () =>
    Object.entries(budgets).reduce((acc, curr) => acc + curr[1], 0);

  return (
    <div>
      <h1 className="font-bold text-xl pb-5">Budgets</h1>
      <p className="text-md">Add New Budget Category</p>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          className="text-md"
          type="text"
          value={newCategory}
          onChange={(e) =>
            setNewCategory(
              String(e.target.value).toLowerCase().replace(" ", "-")
            )
          }
          placeholder="Enter category name"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-lime-500 to-cyan-500"
        >
          Add
        </Button>
      </form>
      <div className="flex w-full max-w-md px-2 py-6 bg-slate-900 rounded-xl mt-4 justify-center">
        <h2 className="text-lg font-bold text-right">Total ${getTotal()}</h2>
      </div>
      <div className="flex flex-col w-full max-w-md justify-between border-b">
        <h1 className="my-4 pl-2 text-xl font-bold">Budgets</h1>
        {Object.entries(budgets).map(([budget, total], i) => (
          <div
            key={`${budget}-${i}`}
            className="hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer p-2 border-t flex space-x-2 items-center justify-between"
          >
            <div>{budget}</div>
            <div>${total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
