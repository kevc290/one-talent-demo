interface SkeletonCardProps {
  view: 'grid' | 'list';
}

export function SkeletonCard({ view }: SkeletonCardProps) {
  if (view === 'list') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 bg-gray-200 rounded w-48 skeleton"></div>
              <div className="h-5 w-16 bg-gray-200 rounded-full skeleton"></div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 w-24 bg-gray-200 rounded skeleton"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 w-32 bg-gray-200 rounded skeleton"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 w-20 bg-gray-200 rounded skeleton"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 skeleton"></div>
            </div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full animate-pulse">
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-gray-200 rounded w-3/4 skeleton"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-full ml-2 skeleton"></div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-4 w-24 bg-gray-200 rounded skeleton"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-4 w-32 bg-gray-200 rounded skeleton"></div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full skeleton"></div>
        <div className="h-4 bg-gray-200 rounded w-full skeleton"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 skeleton"></div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-4 w-20 bg-gray-200 rounded skeleton"></div>
        <div className="h-3 w-16 bg-gray-200 rounded skeleton"></div>
      </div>
    </div>
  );
}