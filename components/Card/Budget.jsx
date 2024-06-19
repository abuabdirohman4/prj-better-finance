"use client";
import { formatRupiah } from "@/utils/helper";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function CardBudget({
  name,
  budget,
  spending,
  subCategory,
}) {
  const percentage = budget
    ? (parseFloat(spending) / -parseFloat(budget)) * 100
    : 0;
  const stringPercent = percentage.toFixed(0);
  const balance = parseFloat(spending) + parseFloat(budget);

  const [isOpen, setIsOpen] = useState(false);
  const handleAccordionToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={`py-4 px-3 mb-4 border border-2 rounded-xl`}>
      <div
        className="block flex-col w-full font-medium text-gray-500 rounded-t-xl focus:ring-4 focus:ring-gray-200  gap-3"
        aria-expanded={isOpen}
        onClick={subCategory.length > 0 ? handleAccordionToggle : () => {}}
      >
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          {subCategory.length > 0 ? (
            isOpen ? (
              <FaChevronUp className="w-3 h-3 shrink-0" />
            ) : (
              <FaChevronDown className="w-3 h-3 shrink-0" />
            )
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">Budget</p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900">
            {formatRupiah(budget)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">Spending</p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-red-500">
            {formatRupiah(spending)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">Balance</p>
          </div>
          <div
            className={`inline-flex items-center text-base font-semibold ${
              balance < 0 && "text-red-500"
            }`}
          >
            {formatRupiah(balance)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate"></p>
          </div>
          <p className="text-sm text-gray-500 truncate me-2">
            {!stringPercent ? "0" : stringPercent}%
          </p>
          <div className="w-8/12 bg-gray-200 rounded-full">
            <div
              className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
              style={{
                width: `${percentage > 100 ? "100" : stringPercent}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? "" : "hidden"}`}>
        <ul className="pt-8">
          {subCategory.map((category, index) => {
            const percentage = category.budget
              ? (parseFloat(category.spending) / -parseFloat(category.budget)) *
                100
              : 0;
            const stringPercent = percentage.toFixed(0);
            const balance =
              parseFloat(category.spending) + parseFloat(category.budget);
            return (
              <div key={index} className="py-8 border-t-2 border-t-gray-200">
                <div className="flex-1 min-w-0 mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {category.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate">Budget</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {formatRupiah(category.budget)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate">Spending</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-red-500">
                    {formatRupiah(category.spending)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate">Balance</p>
                  </div>
                  <div
                    className={`inline-flex items-center text-base font-semibold ${
                      balance < 0 && "text-red-500"
                    }`}
                  >
                    {formatRupiah(balance)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 truncate"></p>
                  </div>
                  <p className="text-sm text-gray-500 truncate me-2">
                    {!stringPercent ? "0" : stringPercent}%
                  </p>
                  <div className="w-8/12 bg-gray-200 rounded-full">
                    <div
                      className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
                      style={{
                        width: `${percentage > 100 ? "100" : stringPercent}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
