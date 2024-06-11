export default function SkeletonText({ row }) {
  const rows = Array.from({ length: row });
  return (
    <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
      {rows.map((_, index) => (
        <div className="flex items-center w-full" key={index}>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
