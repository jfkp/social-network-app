export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="ml-2 h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="mt-4 h-64 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
} 