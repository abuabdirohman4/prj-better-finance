"use client";
import { useEffect, useState } from "react";
import { getData, postData } from "@/utils/fetch";

export default function CreateCategoryBudgetGroup() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/categories/budgets/group",
        payload: {
          clientId: "1717515",
          name: categoryName,
        },
      });
      if (res.status == 201) {
        console.log("res post", res.data);
      } else {
        console.log("res post", res.response.data);
      }
    } catch (error) {
      console.error("Error adding category budget:", error);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const res = await getData({
        url: "/api/categories/budgets/group",
        params: { clientId: "1717515" },
      });
      if (res.status == 200) {
        console.log("res get", res);
        setCategoryGroup(res.data);
      }
    }
    fetchCategories();
  }, []);

  return (
    <main className="h-screen p-5">
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900 dark:text-white">
        Add Category Groups
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="group-category-name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Group Category Name
          </label>
          <input
            type="text"
            id="group-category-name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Group Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          List Category:
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          {categoryGroup.map((category, index) => (
            <li key={index}>{category.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
