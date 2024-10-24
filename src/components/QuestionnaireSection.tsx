import React from 'react';
import { UserData } from '../types';

interface QuestionnaireSectionProps {
	title: string;
	icon: React.ReactNode;
	fields: (keyof UserData)[];
	userData: UserData;
	setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({ title, icon, fields, userData, setUserData }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '');
		setUserData((prevData) => ({ ...prevData, weight: value }));
	};

	const handleHeightChange = (type: 'feet' | 'inches', e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '');
		setUserData((prevData) => ({
			...prevData,
			height: {
				...(prevData.height as { feet: string; inches: string }),
				[type]: value,
			},
		}));
	};

	const getOptions = (field: keyof UserData) => {
		switch (field) {
			case 'gender':
				return ['Male', 'Female', 'Other'];
			case 'fitnessLevel':
				return ['Beginner', 'Intermediate', 'Advanced'];
			case 'fitnessGoal':
				return ['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Maintain Fitness'];
			case 'trainingType':
				return ['Strength Training', 'Cardio', 'HIIT', 'Yoga', 'Mixed'];
			default:
				return [];
		}
	};

	const renderField = (field: keyof UserData) => {
		const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

		if (field === 'gender' || field === 'fitnessLevel' || field === 'fitnessGoal' || field === 'trainingType') {
			return (
				<div key={field} className='mb-6'>
					<label className='block text-sm font-medium mb-2 text-gray-300'>{label}</label>
					<select
						name={field}
						value={userData[field] as string}
						onChange={handleChange}
						className='w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300'
					>
						<option value=''>Select {label}</option>
						{getOptions(field).map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			);
		}

		if (field === 'weight') {
			return (
				<div key={field} className='mb-6'>
					<label className='block text-sm font-medium mb-2 text-gray-300'>{label}</label>
					<div className='relative'>
						<input
							type='text'
							name={field}
							value={userData[field] as string}
							onChange={handleWeightChange}
							className='w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300'
							placeholder='Enter weight'
						/>
						<span className='absolute right-4 top-3 text-gray-400'>lbs</span>
					</div>
				</div>
			);
		}

		if (field === 'height') {
			const height = userData[field] as { feet: string; inches: string };
			return (
				<div key={field} className='mb-6'>
					<label className='block text-sm font-medium mb-2 text-gray-300'>{label}</label>
					<div className='flex space-x-4'>
						<div className='relative w-1/2'>
							<input
								type='text'
								name={`${field}-feet`}
								value={height.feet}
								onChange={(e) => handleHeightChange('feet', e)}
								className='w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300'
								placeholder='Feet'
							/>
							<span className='absolute right-4 top-3 text-gray-400'>ft</span>
						</div>
						<div className='relative w-1/2'>
							<input
								type='text'
								name={`${field}-inches`}
								value={height.inches}
								onChange={(e) => handleHeightChange('inches', e)}
								className='w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300'
								placeholder='Inches'
							/>
							<span className='absolute right-4 top-3 text-gray-400'>in</span>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div key={field} className='mb-6'>
				<label className='block text-sm font-medium mb-2 text-gray-300'>{label}</label>
				<input
					type={field === 'age' || field === 'workoutDays' || field === 'mealsPerDay' ? 'number' : 'text'}
					name={field}
					value={userData[field] as string}
					onChange={handleChange}
					className='w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300'
					placeholder={`Enter ${label}`}
				/>
			</div>
		);
	};

	return (
		<div className='bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl'>
			<h2 className='text-2xl font-bold mb-6 flex items-center text-red-500'>
				{icon} {title}
			</h2>
			{fields.map(renderField)}
		</div>
	);
};

export default QuestionnaireSection;
