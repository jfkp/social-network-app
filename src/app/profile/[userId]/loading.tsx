export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="bg-white p-4 border-b">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-full bg-gray-200 rounded mb-4" />
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
} 