"use client";
import ButtonBack from "@/components/Button/BackButton/page";
import { fetchPockets, putData } from "@/utils/fetch";
import { formatRupiah } from "@/utils/helper";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export default function PocketPage({ params, searchParams }) {
  const pocketName = params.pocket;
  const pocketId = searchParams.pocketId;
  const pocketAmount = searchParams.pocketAmount;
  const pocketColor = searchParams.color;
  const [pocketActual, setPocketActual] = useState(0);
  const [pocketDifference, setPocketDifference] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await putData({
      url: "/api/pockets",
      payload: {
        id: Number(pocketId),
        actual: pocketActual,
        reqFunc: "PutPocket",
      },
    });

    if (res.status == 201) {
      console.log("res put", res);
    } else {
      console.error("error update pocket:", res.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      console.log('fetchData')
      const pockets = await fetchPockets(false)
      if (pockets.status == 200) {
        console.log("pockets", pockets.data);
        setPocketActual(pockets.data.actual);
        setPocketDifference(pockets.data.actual - pocketAmount);
      } else {
        console.error("error get pocket", pockets.response);
      }
    }
    fetchData()
  }, [pocketId, pocketAmount]);

  return (
    <div className="w-full p-8 min-h-[94vh] bg-white border border-gray-200 rounded-lg shadow">
      <ButtonBack />
      <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
        <div className="block text-center max-w-sm bg-white border border-gray-200 rounded-sm shadow cursor-pointer">
          <h5 className="my-8 font-bold tracking-tight text-gray-900">
            {pocketName}
          </h5>
          <div
            className={`${pocketColor} p-1.5 flex text-center border border-white`}
          >
            <p className="font-bold text-sm text-white w-1/2">Data</p>
            <div className="left-1/2 w-0.5 bg-white"></div>
            <p className="font-bold text-sm text-white w-1/2">
              {formatRupiah(pocketAmount)}
            </p>
          </div>
          <div
            className={`${pocketColor} p-1.5 grid grid-cols-2 justify-center text-center border border-white`}
          >
            <div>
              <p className="font-bold text-sm text-white">Actual</p>
            </div>
            <div className="left-1/2 w-0.5 bg-white">
              <CurrencyInput
                className="font-bold text-sm text-black text-center w-28 ml-9"
                prefix="Rp "
                value={pocketActual}
                intlConfig={{ locale: "id-ID" }}
                onValueChange={(value) => {
                  setPocketActual(value);
                  setPocketDifference(value - pocketAmount);
                }}
              />
            </div>
          </div>
          <div
            className={`${pocketColor} p-1.5 flex text-center border border-white`}
          >
            <p className="font-bold text-sm text-white w-1/2">Difference</p>
            <div className="left-1/2 w-0.5 bg-white"></div>
            <p className="font-bold text-sm text-white w-1/2">
              {formatRupiah(pocketDifference)}
            </p>
          </div>
        </div>
        <button
          type="submit"
          className=" mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
