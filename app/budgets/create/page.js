"use client";
import { useEffect, useState } from "react";
import { getData, postData } from "@/utils/fetch";

export default function CategoryBudget() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("spending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/categories/budgets",
        payload: {
          clientId: "1717515",
          name: categoryName,
          type: categoryType,
        },
      });
      if (res.status == 200) {
        console.log("res", res.data);
      } else {
        console.log("res", res.response.data);
      }
    } catch (error) {
      console.error("Error adding category budget:", error);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const res = await getData({
        url: "/api/categories/budgets",
        params: { clientId: "1717515" },
      });
      if (res.status == 200) {
        console.log("res", res);
        setCategories(res.data);
      }
    }
    fetchCategories();
  }, []);

  return (
    <main className="h-screen">
      <div>
        <h1>List Category</h1>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              {category.name}
              {/* <button onClick={() => deleteCategory(category.id)}>Delete</button> */}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Add Category Budget</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Category Name:
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </label>
          <label>
            Category Type:
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            >
              <option value="earning">earning</option>
              <option value="spending">spending</option>
            </select>
          </label>
          <button type="submit">Add Category Budget</button>
        </form>
      </div>
    </main>
  );
}
