"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchCategoryGroups, postData } from "@/utils/fetch";
import { styleSelect } from "@/utils/constants";
import ButtonBack from "@/components/Button/BackButton/page";
import SelectInput from "@/components/Input/SelectInput/page";

export default function CreateCategoryBudgetGroup() {
  const clientId = "1717515";
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [optionGroups, setOptionGroups] = useState([{ value: "", label: "" }]);
  const [optionCategories, setOptionCategories] = useState([
    { value: "", label: "" },
  ]);
  const [form, setForm] = useState({
    groupId: "",
    categoryId: "",
  });

  const handleSelectChange = (e, action) => {
    setForm({ ...form, [action.name]: e.value });
    if (action.name === "categoryId") {
      setForm({ ...form, [action.name]: e.value });
    }
  };

  const handleSubmitLink = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/budgets/categories",
        payload: {
          categoryId: form.categoryId,
          groupId: form.groupId,
          reqFunc: "PostCategoryLinkGroup",
        },
      });
      if (res.status == 201) {
        console.log("res post", res.data);
        setForm({ groupId: "", categoryId: "" });
        await fetchCategoryGroups(true);
        fetchOptions();
      } else {
        console.log("res post", res.response.data);
      }
    } catch (error) {
      console.error("Error adding category budget:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/budgets/group",
        payload: {
          clientId: clientId,
          name: categoryName,
        },
      });
      if (res.status == 201) {
        console.log("res post", res.data);
        setCategoryName("");
        await fetchCategoryGroups(true);
        fetchOptions();
      } else {
        console.log("res post", res.response.data);
      }
    } catch (error) {
      console.error("Error adding category budget:", error);
    }
  };

  const fetchOptions = useCallback(async () => {
    const categories = await fetchCategoryGroups(false);
    if (categories.status == 200) {
      setCategoryGroup(categories.data);
      setOptionCategories(
        categories.data
          .filter(({ groupId }) => groupId === null)
          .map(({ categoryId, name }) => ({
            value: categoryId,
            label: name,
          }))
      );
      setOptionGroups(
        categories.data
          .filter(({ groupId }) => groupId !== null)
          .map(({ groupId, name }) => ({
            value: groupId,
            label: name,
          }))
      );
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return (
    <div className="p-5 min-h-[94vh]">
      <ButtonBack href="/budgets" />
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

      <h5 className="text-center text-xl my-8 font-bold leading-none text-gray-900">
        Link Group & Category
      </h5>
      <form onSubmit={handleSubmitLink}>
        <div className="mb-3">
          <SelectInput
            label="Category Without Group"
            name="categoryId"
            placeholder="Select Category"
            options={optionCategories}
            value={
              optionCategories.find(
                (option) => option.value === form.categoryId
              ) || ""
            }
            onChange={handleSelectChange}
            styles={styleSelect}
          />
        </div>
        <div className="mb-3">
          <SelectInput
            label="Group"
            name="groupId"
            placeholder="Select Group"
            options={optionGroups}
            value={
              optionGroups.find((option) => option.value === form.groupId) || ""
            }
            onChange={handleSelectChange}
            styles={styleSelect}
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
