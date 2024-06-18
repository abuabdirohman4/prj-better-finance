import axios from "axios";
import { getLocal, setLocal } from "./session";
import { SESSIONKEY } from "./constants";

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

const clientId = "1717515";
export async function fetchAllCategories({ state }) {
  let resAllCategories = {};
  if (state !== "update") {
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