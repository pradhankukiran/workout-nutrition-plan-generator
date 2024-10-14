import React from 'react';

interface PlanSelectionSectionProps {
  title: string;
  icon: React.ReactNode;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const PlanSelectionSection: React.FC<PlanSelectionSectionProps> = ({
  title,
  icon,
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        {icon} {title}
      </h2>
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option}
            className={`w-full py-3 px-4 rounded-lg text-left transition-colors duration-200 ${
              selectedOption === option
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlanSelectionSection;