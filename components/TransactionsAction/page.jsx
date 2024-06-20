import Link from "next/link";
import {
  BsArrowRightCircleFill,
  BsArrowUpCircleFill,
  BsPlusCircleFill,
} from "react-icons/bs";

export default function TransactionsAction() {
  return (
    <div className="grid grid-cols-3 gap-6 mb-5">
      <Link
        href={{
          pathname: `/transactions/create`,
          query: { type: "earning" },
        }}
        className="group cursor-pointer"
      >
        <BsPlusCircleFill
          className="mx-auto mb-2 text-gray-500 group-hover:text-blue-600"
          size={40}
        />
        <div className="text-center text-sm text-gray-500 group-hover:text-blue-600">
          Earning
        </div>
      </Link>
      <Link
        href={{
          pathname: `/transactions/create`,
          query: { type: "transfer" },
        }}
        className="group cursor-pointer"
      >
        <BsArrowUpCircleFill
          className="mx-auto mb-2 text-gray-500 group-hover:text-blue-600"
          size={40}
        />
        <div className="text-center text-sm text-gray-500 group-hover:text-blue-600">
          Transfer
        </div>
      </Link>
      <Link
        href={{
          pathname: `/transactions/create`,
          query: { type: "spending" },
        }}
        className="group cursor-pointer"
      >
        <BsArrowRightCircleFill
          className="mx-auto mb-2 text-gray-500 group-hover:text-blue-600"
          size={40}
        />
        <div className="text-center text-sm text-gray-500 group-hover:text-blue-600">
          Spending
        </div>
      </Link>
    </div>
  );
}
