"use client";
import { useState, useEffect } from "react";
import { getData } from "@/utils/fetch";

export default function CreateBudgets() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      const res = await getData({
        url: "/api/categories/budgets/group",
        params: { clientId: "1" },
      });
      console.log("res", res);
      if (res.status == 200) {
        console.log("res", res);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {/* {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => deleteCategory(category.id)}>Delete</button>
          </li>
        ))} */}
      </ul>
      <div>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={() => addCategory(newCategoryName)}>
          Add Category
        </button>
      </div>
    </div>
  );
}
