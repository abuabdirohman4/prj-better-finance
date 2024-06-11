"use client";
import { useEffect, useState } from "react";
import { getData, postData } from "@/utils/fetch";
import { toCapitalCase } from "@/utils/helper";

export default function CreateCategoryBudget({ params }) {
  const clientId = "1717515";
  const type = "spending";
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("spending");
  const category = toCapitalCase(params.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/categories/budgets",
        payload: {
          clientId: clientId,
          name: categoryName,
          type: type,
        },
      });
      if (res.status == 201) {
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
        params: { clientId: clientId, groupName: category, type: type },
      });
      if (res.status == 200) {
        console.log("res", res);
        setCategories(res.data);
      }
    }
    fetchCategories();
  }, [category]);

  return (
    <main className="h-screen p-5">
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900 dark:text-white">
        Add Category
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          {/* <label>
            Category Type:
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            >
              <option value="earning">earning</option>
              <option value="spending">spending</option>
            </select>
          </label> */}
          <div>
            <label
              htmlFor="type"
              className="block mb-y text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Type
            </label>
            <select
              id="type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            >
              <option value="earning">Earning</option>
              <option value="spending">Spending</option>
            </select>
          </div>

          <div className="mt-3">
            <label
              htmlFor="group-category-name"
              className="block mb-y text-sm font-medium text-gray-900 dark:text-white"
            >
              Category Name
            </label>
            <input
              type="text"
              id="group-category-name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => categoryName(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>

      {/* <form className="max-w-sm mx-auto"></form> */}

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          List Category:
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          {categories.map((category, index) => (
            <li key={index}>{category.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
