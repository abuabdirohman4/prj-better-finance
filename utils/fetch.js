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

export async function putData({ url, payload, token }) {
  try {
    return await axios.put(`${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export async function fetchCategories(
  updateStorage,
  { groupId = "", groupName = "", month = "", type = "", year = "" } = {}
) {
  let categories = {};
  if (!updateStorage) {
    categories = getLocal(SESSIONKEY.categories);
  }
  if (!categories || Object.entries(categories).length === 0) {
    console.log("storage categories", categories);
    categories = await getData({
      url: "/api/categories",
      params: {
        clientId: clientId,
        groupId,
        groupName,
        month,
        type,
        year,
      },
    });
  }
  if (categories.status == 200) {
    console.log("categories", categories);
    setLocal(SESSIONKEY.categories, categories);
    return categories;
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
      url: "/api/category-groups",
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

export async function fetchMonthlyCategories(
  updateStorage,
  { groupId = "", year = "", month = "" } = {}
) {
  let monthlyCategories = {};
  if (!updateStorage) {
    monthlyCategories = getLocal(SESSIONKEY.monthlyCategories);
  }
  if (!monthlyCategories || Object.entries(monthlyCategories).length === 0) {
    monthlyCategories = await getData({
      url: "/api/monthly-categories",
      params: {
        clientId: clientId,
        groupId,
        year,
        month,
      },
    });
  }
  if (monthlyCategories.status == 200) {
    console.log("monthlyCategories", monthlyCategories);
    setLocal(SESSIONKEY.monthlyCategories, monthlyCategories);
    return monthlyCategories;
  }
}

export async function fetchPockets(updateStorage) {
  let pockets = {};
  if (!updateStorage) {
    pockets = getLocal(SESSIONKEY.pockets);
  }
  if (!pockets || Object.entries(pockets).length === 0) {
    console.log("storage pockets", pockets);
    pockets = await getData({
      url: "/api/pockets",
      params: {
        clientId: clientId,
      },
    });
  }
  if (pockets.status == 200) {
    console.log("pockets", pockets);
    setLocal(SESSIONKEY.pockets, pockets);
    return pockets;
  }
}

export async function fetchIcons(updateStorage) {
  let icons = {};
  if (!updateStorage) {
    icons = getLocal(SESSIONKEY.icons);
  }
  if (!icons || Object.entries(icons).length === 0) {
    console.log("storage icons", icons);
    try {
      icons = await getData({
        url: "/api/icons",
      });
    } catch (error) {
      console.error("Error fetching icons:", error);
    }
  }
  if (icons.status == 200) {
    console.log("icons", icons);
    setLocal(SESSIONKEY.icons, icons);
    return icons;
  }
}

export async function fetchTransactions(
  updateStorage,
  {
    date: { day = "", month = "", year = "" } = {},
    type = "",
    pocket1 = "",
    pocket2 = "",
    category = "",
    desc = "",
    amount = "",
  } = {}
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
