export default function SkeletonList({ listNumber }) {
  return (
    <div
      role="status"
      className="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse md:p-6"
    >
      {Array.from({ length: listNumber }).map((_, index) => (
        <div className="flex items-center justify-between pt-4" key={index}>
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5 dark:bg-gray-300"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-200"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full w-12 dark:bg-gray-300"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
