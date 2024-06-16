"use client";
import { useCallback, useEffect, useState } from "react";
import { getData, postData } from "@/utils/fetch";
import { setLocal } from "@/utils/session";
import { SESSIONKEY } from "@/utils/constants";
import ButtonBack from "@/components/Button/BackButton/page";

export default function CreateCategoryBudgetGroup() {
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/budgets/group",
        payload: {
          clientId: "1717515",
          name: categoryName,
        },
      });
      if (res.status == 201) {
        console.log("res post", res.data);
        setCategoryName("");
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
      url: "/api/budgets/group",
      params: { clientId: "1717515" },
    });
    if (res.status == 200) {
      console.log("res get", res);
      setCategoryGroup(res.data);
      setLocal(SESSIONKEY.categoryGroup, res)
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-5 min-h-[94vh]">
      <ButtonBack/>
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900">
        Add Category Groups
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="group-category-name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Group Category Name
          </label>
          <input
            type="text"
            id="group-category-name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Group Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
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
          {categoryGroup.map((category, index) => (
            <li key={index}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
