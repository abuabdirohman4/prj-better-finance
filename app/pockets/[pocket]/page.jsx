"use client";
import ButtonBack from "@/components/Button/BackButton/page";
import { formatRupiah } from "@/utils/helper";
import { useState } from "react";

export default function PocketPage({ params, searchParams }) {
  const pocketName = params.pocket;
  const pocketAmount = searchParams.pocketAmount;
  const pocketColor = searchParams.color;
  const [pocketActual, setPocketActual] = useState(0);
  const [pocketDifference, setPocketDifference] = useState(0);

  return (
    <div className="w-full p-8 min-h-[94vh] bg-white border border-gray-200 rounded-lg shadow">
      <ButtonBack href="/pockets" />
      <div className="flex items-center justify-between mb-8">
        {/* <h5 className="text-xl font-bold leading-none text-gray-900">
          {pocketName}
        </h5> */}
      </div>
      <form className="flex flex-col justify-center" onSubmit={() => {}}>
        <div className="block text-center max-w-sm bg-white border border-gray-200 rounded-sm shadow cursor-pointer hover:bg-gray-100">
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
            // className={`${pocketColor} p-1.5 flex justify-between text-center border border-white`}
          >
            <div>
              <p className="font-bold text-sm text-white">Actual</p>
            </div>
            <div className="left-1/2 w-0.5 bg-white">
              <input
                className="font-bold text-sm text-black text-center w-28 ml-9"
                value={pocketActual}
                onChange={(e) => {
                  setPocketActual(e.target.value);
                  setPocketDifference(e.target.value - pocketAmount);
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
            {/* <div className="left-1/2 w-0.5 bg-white">
              <input
                className="font-bold text-sm text-black text-center w-28 ml-9"
                value={pocketDifference}
                onChange={() => {}}
              />
            </div> */}
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
