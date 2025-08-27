// import axios from "../configs";
import axios from "axios";
import { redirect } from "next/navigation";

export async function getData({ url, params, token }) {
  try {
    return await axios.get(`${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const res = JSON.parse(JSON.stringify(error));
    if (res.status === 401) {
      redirect("/masuk");
    }
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
    throw error;
  }
}

export async function putData({ url, payload }) {
  try {
    return await axios.put(`${url}`, payload);
  } catch (error) {
    throw error;
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
    throw error;
  }
}
