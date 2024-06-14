"use client";
import { useCallback, useEffect, useState } from "react";
import { getData, postData } from "@/utils/fetch";
import { toCapitalCase } from "@/utils/helper";

export default function CreateCategoryBudget({ params, searchParams }) {
  const clientId = "1717515";
  const type = "spending";
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState(type);
  const groupName = toCapitalCase(params.group);
  const groupId = searchParams.groupId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/budgets/categories",
        payload: {
          clientId: clientId,
          name: categoryName,
          type: categoryType,
          groupId: groupId,
          reqFunc: "PostCategoryBudgetWithGroup",
        },
      });
      if (res.status == 201) {
        console.log("res post", res.data);
        setCategoryName("");
        setCategoryType(type);
        fetchCategories();
      } else {
        console.log("res post", res.response.data);
      }
    } catch (error) {
      console.error("Error adding category budget:", error);
    }
  };

  const fetchCategories = useCallback(async () => {
    const res = await getData({
      url: "/api/budgets/categories",
      params: {
        clientId: clientId,
        groupId: groupId,
        type: type,
        reqFunc: "GetCategoryBudgets",
      },
    });
    if (res.status == 200) {
      console.log("res", res);
      setCategories(res.data);
    }
  }, [groupId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-5 min-h-[94vh]">
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900">
        Add Category {groupName}
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div>
            <label
              htmlFor="type"
              className="block mb-y text-sm font-medium text-gray-900"
            >
              Select Type
            </label>
            <select
              id="type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
              className="block mb-y text-sm font-medium text-gray-900"
            >
              Category Name
            </label>
            <input
              type="text"
              id="group-category-name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          List Category:
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {categories.map((category, index) => (
            <li key={index}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
