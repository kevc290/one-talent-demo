interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 sm:px-4 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md animate-scaleIn'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
      }`}
    >
      {label}
    </button>
  );
}