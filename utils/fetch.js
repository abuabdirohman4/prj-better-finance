import axios from "axios";
import { getLocal, setLocal } from "./session";
import { SESSIONKEY } from "./constants";

const clientId = "1717515";

export async function getData({ url, params, token }) {
  try {
    return await axios.get(`${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function postData({ url, payload, token, formData }) {
  try {
    return await axios.post(`${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return error;
  }
}

export async function putData({ url, payload }) {
  try {
    return await axios.put(`${url}`, payload);
  } catch (error) {
    return error;
  }
}

export async function deleteData({ url, token }) {
  try {
    return await axios.delete(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error;
  }
}

export async function fetchAllCategories(updateStorage) {
  let resAllCategories = {};
  if (!updateStorage) {
    resAllCategories = getLocal(SESSIONKEY.categories);
  }
  if (!resAllCategories || Object.entries(resAllCategories).length === 0) {
    resAllCategories = await getData({
      url: "/api/budgets/categories",
      params: {
        clientId: clientId,
        reqFunc: "GetCategories",
      },
    });
  }
  if (resAllCategories.status == 200) {
    console.log("resAllCategories", resAllCategories);
    setLocal(SESSIONKEY.categories, resAllCategories);
    return resAllCategories;
  }
}

export async function fetchTransactions(
  updateStorage,
  {
    params: {
      date: { day = "", month = "", year = "" } = {},
      type = "",
      pocket1 = "",
      pocket2 = "",
      category = "",
      desc = "",
      amount = "",
    } = {},
  }
) {
  let resAllTransactions = {};
  if (!updateStorage) {
    resAllTransactions = getLocal(SESSIONKEY.transactions);
  }
  if (!resAllTransactions || Object.entries(resAllTransactions).length === 0) {
    resAllTransactions = await getData({
      url: "/api/transactions",
      params: {
        clientId: clientId,
        date: { day, month, year },
        type,
        pocket1,
        pocket2,
        category,
        desc,
        amount,
      },
    });
  }
  if (resAllTransactions.status == 200) {
    console.log("resAllTransactions", resAllTransactions);
    setLocal(SESSIONKEY.transactions, resAllTransactions);
    return resAllTransactions.data;
  }
}

export async function fetchCategoryGroups(updateStorage) {
  let categoryGroup = {};
  if (!updateStorage) {
    categoryGroup = getLocal(SESSIONKEY.categoryGroup);
  }
  if (!categoryGroup || Object.entries(categoryGroup).length === 0) {
    console.log("storage categoryGroup", categoryGroup);
    categoryGroup = await getData({
      url: "/api/budgets/group",
      params: {
        clientId: clientId,
      },
    });
  }

  if (categoryGroup.status === 200) {
    console.log("categoryGroup", categoryGroup);
    setLocal(SESSIONKEY.categoryGroup, categoryGroup);
    return categoryGroup;
  }
}
