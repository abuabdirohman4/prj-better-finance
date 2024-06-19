"use client";
import ButtonBack from "@/components/Button/BackButton/page";
import InputWithLabel from "@/components/Input/InputWithLabel/page";
import SelectInput from "@/components/Input/SelectInput/page";
import { SESSIONKEY, styleSelect } from "@/utils/constants";
import { getData, postData } from "@/utils/fetch";
import { getLocal, setLocal } from "@/utils/session";
import { useEffect, useState } from "react";

const optionTypes = [
  { value: "initial", label: "Initial" },
  { value: "earning", label: "Earning" },
  { value: "transfer", label: "Transfer" },
  { value: "spending", label: "Spending" },
];

export default function CreateTransactions({ searchParams }) {
  const clientId = "1717515";
  const type = searchParams.type;
  const today = new Date(Date.now());
  const [categories, setCategories] = useState([{ value: "", label: "" }]);
  const [pockets, setPockets] = useState([{ value: "", label: "" }]);
  const [form, setForm] = useState({
    date: today.toISOString().split("T")[0],
    type: type,
    pocket1: null,
    pocket2: null,
    category: null,
    subCategory: null,
    desc: "",
    amount: "",
  });

  const handleChange = (e, action) => {
    if (!e.target) {
      setForm({ ...form, [action.name]: e.value });
    } else {
      let value = e.target.value;
      if (e.target.name === "amount") {
        value = value.replace(/^0+/, "");
        if (value === "") value = "0";
      }
      setForm({ ...form, [e.target.name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await postData({
      url: "/api/transactions",
      payload: {
        clientId: clientId,
        transactions: form,
      },
    });

    console.log("res post", res);
    setForm({
      ...form,
      desc: "",
      amount: "",
    });
  };

  useEffect(() => {
    async function fetchData() {
      console.log("fetchData");

      // get pockets
      let resPockets = getLocal(SESSIONKEY.pockets);
      if (!resPockets) {
        console.log("storage pockets", resPockets);
        resPockets = await getData({
          url: "/api/pockets",
          params: {
            clientId: clientId,
            reqFunc: "GetPocket",
          },
        });
        if (resPockets.status === 200) setLocal(SESSIONKEY.pockets, resPockets);
      }

      if (resPockets.status === 200) {
        setPockets(
          resPockets.data.map(({ id, name }) => ({
            value: id,
            label: name,
          }))
        );

        // get categories
        let resCategories = getLocal(SESSIONKEY.categories);
        if (!resCategories) {
          resCategories = await getData({
            url: "/api/budgets/categories",
            params: {
              clientId: clientId,
              reqFunc: "GetCategories",
            },
          });
          if (resCategories.status === 200)
            setLocal(SESSIONKEY.categories, resCategories);
        }
        if (resCategories.status == 200) {
          console.log("resCategories", resCategories);
          setCategories(
            resCategories.data.map(({ id, name }) => ({
              value: id,
              label: name,
            }))
          );
          // get sub categories ???
        }
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-5 min-h-[94vh]">
      <ButtonBack />
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900">
        Create Transactions
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <InputWithLabel
            label={"Date"}
            name={"date"}
            type={"date"}
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <SelectInput
            label="Type"
            name="type"
            placeholder="Type"
            options={optionTypes}
            value={optionTypes.find((option) => option.value === type)}
            onChange={handleChange}
            styles={styleSelect}
          />
        </div>
        <div className="mb-3">
          <SelectInput
            label="From Pocket"
            name="pocket1"
            placeholder="Select Pocket"
            options={pockets}
            value={pockets.find((option) => option.value === form.pocket1)}
            onChange={handleChange}
            styles={styleSelect}
          />
        </div>
        <div className="mb-3 hidden">
          <SelectInput
            label="To Pocket"
            name="pocket2"
            placeholder="Select Pocket"
            options={pockets}
            value={pockets.find((option) => option.value === form.pocket2)}
            onChange={handleChange}
            styles={styleSelect}
          />
        </div>
        <div className="mb-3">
          <SelectInput
            label="Category"
            name="category"
            placeholder="Select Category"
            options={categories}
            value={categories.find((option) => option.value === form.category)}
            onChange={handleChange}
            styles={styleSelect}
          />
        </div>
        <div className="mb-3 hidden">
          <SelectInput
            label="Sub Category"
            name="subCategory"
            placeholder="Select Category"
            options={categories}
            value={categories.find(
              (option) => option.value === form.subCategory
            )}
            onChange={handleChange}
            styles={styleSelect}
          />
        </div>
        <div className="mb-3">
          <InputWithLabel
            label={"Description"}
            name={"desc"}
            type={"text"}
            placeholder={"Description"}
            value={form.desc}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <InputWithLabel
            label={"Amount"}
            name={"amount"}
            type={"number"}
            placeholder={"Amount"}
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="mt-3 mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
