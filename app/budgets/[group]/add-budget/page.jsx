"use client";
import { useEffect, useState } from "react";
import { getData, postData, putData } from "@/utils/fetch";
import { toCapitalCase } from "@/utils/helper";
import SelectInput from "@/components/SelectInput/page";

const optionTypes = [
  { value: "earning", label: "Earning" },
  { value: "spending", label: "Spending" },
];

export default function AddBudgetCategory({ params, searchParams }) {
  const clientId = "1717515";
  const type = "spending";
  const group = toCapitalCase(params.group);
  const groupId = searchParams.groupId;
  const month = searchParams.monthInNumber;
  const year = searchParams.year;

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("spending");
  const [categoryBudget, setCategoryBudget] = useState(0);
  const [categoryInputs, setCategoryInputs] = useState({});
  const [monthlyCategories, setMonthlyCategories] = useState([]);

  const handleInputChange = (e, categoryId, field, type) => {
    let value = "";
    if (type == "reactSelect") {
      value = e ? e.value : "";
    } else {
      // const {value} = e.target
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
  // const handleInputChange = (selectedOption, categoryId, field) => {
  //   const value = selectedOption ? selectedOption.value : "";
  //   setCategoryInputs((prev) => ({
  //     ...prev,
  //     [categoryId]: {
  //       ...prev[categoryId],
  //       [field]: value,
  //     },
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/budgets/categories",
        payload: {
          clientId: clientId,
          name: categoryName,
          type: type,
          groupId: groupId,
          reqFunc: "PostCategoryBudgetWithGroup",
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
          url: "/api/budgets/categories",
          payload: {
            categories: createPayload,
            reqFunc: "PostCategoryBudgetBulk",
          },
        });

        console.log("res post", res);
      }

      if (updatePayload.length > 0) {
        const res = await putData({
          url: "/api/budgets/categories",
          payload: {
            categories: updatePayload,
            reqFunc: "PutCategoryBudgetBulk",
          },
        });
        console.log("res put", res);
      }

      // Fetch updated categories or handle UI state update as necessary
    } catch (error) {
      console.error("Error adding/updating category budgets:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // GetCategoryBudgetsAmount
      const res = await getData({
        url: "/api/budgets/categories",
        params: {
          clientId: clientId,
          groupName: group,
          type: type,
          year: "2024",
          month: 6,
          reqFunc: "GetCategoryBudgetsAmount",
        },
      });
      if (res.status == 200) {
        console.log("res", res);
        setCategories(res.data);
      }

      // GetMonthlyCategoryBudgets
      const resMonthly = await getData({
        url: "/api/budgets/categories",
        params: {
          clientId: clientId,
          groupId: groupId,
          type: type,
          year: "2024",
          month: 6,
          reqFunc: "GetMonthlyCategoryBudgets",
        },
      });
      if (resMonthly.status == 200) {
        setMonthlyCategories(resMonthly.data);
      }
    }
    fetchData();
  }, [group, groupId]);

  return (
    <main className="h-screen p-5">
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900 dark:text-white">
        Update Budget
      </h5>

      {/* <form onSubmit={handleSubmit}>
        <div className="mb-3">
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
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="budget"
              className="block mb-y text-sm font-medium text-gray-900 dark:text-white"
            >
              Budget
            </label>
            <input
              type="text"
              id="budget"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Budget"
              value={categoryBudget}
              onChange={(e) => setCategoryBudget(e.target.value)}
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
      </form> */}

      <div className="grid gap-6 mb-1 md:grid-cols-2 text-center">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Name
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Amount
        </label>
      </div>
      <form className="space-y-3" onSubmit={handleSubmitInputMass}>
        {categories.map((category, index) => (
          <div key={index} className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              {/* <label
                  htmlFor={`name-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label> */}
              <input
                type="text"
                id={`name-${index}`}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Name"
                value={
                  categoryInputs[category.id || `new-${index}`]?.name ||
                  category.name ||
                  ""
                }
                onChange={(e) =>
                  handleInputChange(e, category.id || `new-${index}`, "name")
                }
                required
                disabled
              />
            </div>
            {/* <SelectInput
                label="Type"
                placeholder="Type"
                options={optionTypes}
                value={optionTypes.find(
                  (option) =>
                    option.value ===
                    (categoryInputs[category.id || `new-${index}`]?.type ||
                      category.type)
                )}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    category.id || `new-${index}`,
                    "type",
                    "reactSelect"
                  )
                }
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#f9fafb", // bg-gray-50
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // focus:border-blue-500 or border-gray-300
                    color: state.isFocused ? "#ffffff" : "#111827", // dark:text-white or text-gray-900
                    fontSize: "14px", // text-sm
                    borderRadius: "0.5rem", // rounded-lg
                    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : null, // focus:ring-blue-500
                    width: "100%", // w-full
                    padding: "0.125rem 0", // py-5 px-0
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: "14px", // text-sm
                  }),
                }}
                isSearchable={false}
              /> */}
            {category.monthlyCategoryBudgets.length > 0 ? (
              category.monthlyCategoryBudgets.map((monthlyCategory, index) => (
                <div key={index}>
                  {/* <label
                        htmlFor={`budget-${index}`}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Amount
                      </label> */}
                  <input
                    type="text"
                    id={`budget-${index}`}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    required
                  />
                </div>
              ))
            ) : (
              <div>
                {/* <label
                  htmlFor={`budget-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Amount
                </label> */}
                <input
                  type="text"
                  id={`budget-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  required
                />
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
