"use client";
import ButtonBack from "@/components/Button/BackButton/page";
import {
  fetchCategories,
  fetchCategoryGroups,
  fetchMonthlyCategories,
  postData,
  putData,
} from "@/utils/fetch";
import { useEffect, useState } from "react";

export default function AddBudgetCategory({ params, searchParams }) {
  const clientId = "1717515";
  const type = "spending";
  // const group = toCapitalCase(params.group);
  // const groupId = searchParams.groupId;
  const group = "Living";
  const groupId = 1;
  // const month = searchParams.monthInNumber;
  // const year = searchParams.year;
  const month = 6;
  const year = "2024";

  const [categories, setCategories] = useState([]);
  const [categoryInputs, setCategoryInputs] = useState({});
  const [monthlyCategories, setMonthlyCategories] = useState([]);
  console.log("categories", categories);

  const handleInputChange = (e, categoryId, field, type) => {
    let value = "";
    if (type == "reactSelect") {
      value = e ? e.value : "";
    } else {
      value = e.target.value;
    }
    setCategoryInputs((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  const handleSubmitInputMass = async (e) => {
    e.preventDefault();

    const createPayload = [];
    const updatePayload = [];
    Object.keys(categoryInputs).forEach((categoryId) => {
      const category = categoryInputs[categoryId];
      const existingCategory = monthlyCategories.find(
        (monthlyCategory) =>
          monthlyCategory.categoryId.toString() === categoryId
      );

      if (existingCategory) {
        // Data yang sudah ada dan perlu diperbarui
        updatePayload.push({
          id: existingCategory.id,
          categoryId: parseInt(categoryId),
          clientId: clientId,
          year: year,
          month: month,
          // type: category.type,
          amount: parseFloat(category.budget) || 0,
        });
      } else {
        // Data baru
        createPayload.push({
          categoryId: parseInt(categoryId),
          clientId: clientId,
          year: year,
          month: month,
          // name: category.name,
          // type: category.type,
          amount: parseFloat(category.budget) || 0,
        });
      }
    });

    try {
      if (createPayload.length > 0) {
        const res = await postData({
          url: "/api/monthly-categories",
          payload: {
            categories: createPayload,
          },
        });

        console.log("res post", res);
      }

      if (updatePayload.length > 0) {
        const res = await putData({
          url: "/api/monthly-categories",
          payload: {
            categories: updatePayload,
          },
        });
        console.log("res put", res);
      }
      await fetchCategoryGroups(true);

      // Fetch updated categories or handle UI state update as necessary
    } catch (error) {
      console.error("Error adding/updating category budgets:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // GetCategoryAmount
      const categories = await fetchCategories(true, {
        // groupId: groupId,
        // groupName: group,
        type: type,
        year: year,
        month: month,
      });
      if (categories.status == 200) {
        console.log("categories", categories);
        setCategories(categories.data);
      }

      const monthlyCategories = await fetchMonthlyCategories(true, {
        // groupId: groupId,
        type: type,
        year: year,
        month: month,
      });
      if (monthlyCategories.status == 200) {
        console.log("monthlyCategories", monthlyCategories);
        setMonthlyCategories(monthlyCategories.data);
      }
    }
    fetchData();
  }, [group, groupId]);

  return (
    <div className="p-5 min-h-[94vh]">
      <ButtonBack href="/budgets" />
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900">
        Update Budget
      </h5>

      <div className="grid gap-6 mb-1 grid-cols-2 text-center">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Name
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Amount
        </label>
      </div>
      <form className="space-y-3" onSubmit={handleSubmitInputMass}>
        {categories.map((category, index) => (
          <div key={index} className="grid gap-6 grid-cols-2">
            <div>
              <input
                type="text"
                id={`name-${index}`}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Name"
                value={
                  categoryInputs[category.id || `new-${index}`]?.name ||
                  category.name ||
                  ""
                }
                onChange={(e) =>
                  handleInputChange(e, category.id || `new-${index}`, "name")
                }
                // required
                disabled
              />
            </div>
            {category.monthlyCategories.length > 0 ? (
              category.monthlyCategories.map((monthlyCategory, index) => (
                <div key={index}>
                  <input
                    type="text"
                    id={`budget-${index}`}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Amount"
                    value={
                      categoryInputs[category.id || `new-${index}`]?.budget ||
                      monthlyCategory.amount ||
                      ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        category.id || `new-${index}`,
                        "budget"
                      )
                    }
                    // required
                  />
                </div>
              ))
            ) : (
              <div>
                <input
                  type="text"
                  id={`budget-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Amount"
                  value={
                    categoryInputs[category.id || `new-${index}`]?.budget ||
                    0 ||
                    ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      category.id || `new-${index}`,
                      "budget"
                    )
                  }
                  // required
                />
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
