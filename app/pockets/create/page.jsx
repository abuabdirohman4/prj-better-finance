"use client";
import ButtonBack from "@/components/Button/BackButton/page";
import { SESSIONKEY } from "@/utils/constants";
import { getData, postData } from "@/utils/fetch";
import { setLocal } from "@/utils/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePocket() {
  const clientId = "1717515";
  const [pocketName, setPocketName] = useState("");
  const [pocketAmount, setPocketAmount] = useState(0);
  const { push } = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData({
        url: "/api/pockets",
        payload: {
          clientId: clientId,
          name: pocketName,
          actual: pocketAmount,
          reqFunc: "PostPocket",
        },
      });
      if (res.status == 201) {
        console.log("res post", res.data);
        await fetchPockets();
        push("/pockets");
      } else {
        console.error("Error adding pocket:", res.response.data);
      }
    } catch (error) {
      console.error("Error adding pocket:", error);
    }
  };

  const fetchPockets = async () => {
    const pockets = await getData({
      url: "/api/pockets",
      params: {
        clientId: clientId,
        reqFunc: "GetPocket",
      },
    });
    if (pockets.status === 200) {
      setLocal(SESSIONKEY.pockets, pockets);
    } else {
      console.error("failed get pockets");
      return false;
    }
  };

  return (
    <div className="p-5 min-h-[94vh]">
      <ButtonBack />
      <h5 className="text-center text-xl mb-8 font-bold leading-none text-gray-900">
        Create Pocket Name
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="group-category-name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Pocket Name
          </label>
          <input
            type="text"
            id="group-category-name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Pocket Name"
            value={pocketName}
            onChange={(e) => setPocketName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="group-category-name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Current Amount
          </label>
          <input
            type="number"
            pattern="[0-9]+([\,+][0-9])?"
            id="group-category-name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Current Amount"
            value={pocketAmount}
            onChange={(e) => setPocketAmount(e.target.value)}
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
    </div>
  );
}
