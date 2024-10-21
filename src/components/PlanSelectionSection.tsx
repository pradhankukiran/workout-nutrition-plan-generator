import React from 'react';

interface PlanSelectionSectionProps {
	title: string;
	icon: React.ReactNode;
	options: string[];
	selectedOption: string;
	onSelect: (option: string) => void;
}

const PlanSelectionSection: React.FC<PlanSelectionSectionProps> = ({ title, icon, options, selectedOption, onSelect }) => {
	return (
		<div className='bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl'>
			<h2 className='text-2xl font-bold mb-6 flex items-center text-red-500'>
				{icon} {title}
			</h2>
			<div className='space-y-4'>
				{options.map((option) => (
					<button
						key={option}
						className={`w-full py-4 px-6 rounded-lg text-left transition-all duration-300 ${
							selectedOption === option
								? 'bg-red-600 text-white shadow-md transform scale-105'
								: 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-md'
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
