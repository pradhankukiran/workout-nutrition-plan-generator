import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Dumbbell, Utensils, FileText, Calendar, ChevronRight } from 'lucide-react';
import QuestionnaireSection from './QuestionnaireSection';
import PlanSelectionSection from './PlanSelectionSection';
import { UserData } from '../types';
import { generatePlan } from '../services/openaiService';

function Questionnaire() {
	const navigate = useNavigate();
	const [userData, setUserData] = useState<UserData>({
		name: '',
		gender: '',
		age: '',
		weight: '',
		height: { feet: '', inches: '' },
		fitnessLevel: '',
		workoutDays: '',
		fitnessGoal: '',
		injury: '',
		trainingType: '',
		mealsPerDay: '',
		allergies: '',
		dietaryRestrictions: '',
		favoriteFoods: '',
		dislikedFoods: '',
	});

	const [planType, setPlanType] = useState('');
	const [timeFrame, setTimeFrame] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleGeneratePlan = async () => {
		setIsLoading(true);
		const planSections: string[] = [];

		try {
			await generatePlan({ ...userData, planType, timeFrame }, (section) => {
				planSections.push(section);
				navigate('/plan', { state: { plan: planSections, isComplete: false } });
			});

			navigate('/plan', { state: { plan: planSections, isComplete: true } });
		} catch (error) {
			console.error('Error generating plan:', error);
			alert('An error occurred while generating the plan. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold text-center mb-12 text-red-500'>Personalized Fitness Questionnaire</h1>
			<form onSubmit={(e) => e.preventDefault()} className='space-y-12'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<QuestionnaireSection
						title='PERSONAL INFO'
						icon={<User className='mr-2 w-6 h-6' />}
						fields={['name', 'gender', 'age', 'weight', 'height']}
						userData={userData}
						setUserData={setUserData}
					/>
					<QuestionnaireSection
						title='TRAINING'
						icon={<Dumbbell className='mr-2 w-6 h-6' />}
						fields={['fitnessLevel', 'workoutDays', 'fitnessGoal', 'injury', 'trainingType']}
						userData={userData}
						setUserData={setUserData}
					/>
					<QuestionnaireSection
						title='NUTRITION'
						icon={<Utensils className='mr-2 w-6 h-6' />}
						fields={['mealsPerDay', 'allergies', 'dietaryRestrictions', 'favoriteFoods', 'dislikedFoods']}
						userData={userData}
						setUserData={setUserData}
					/>
				</div>
				<div className='max-w-4xl mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<PlanSelectionSection
							title='PLAN TYPE'
							icon={<FileText className='mr-2 w-6 h-6' />}
							options={['Training & Nutrition plan', 'Nutrition plan only']}
							selectedOption={planType}
							onSelect={setPlanType}
						/>
						<PlanSelectionSection
							title='TIME FRAME'
							icon={<Calendar className='mr-2 w-6 h-6' />}
							options={['4 weeks', '8 weeks', '12 weeks']}
							selectedOption={timeFrame}
							onSelect={setTimeFrame}
						/>
					</div>
				</div>
				<div className='flex justify-center mt-12'>
					<button
						type='button'
						onClick={handleGeneratePlan}
						disabled={isLoading}
						className={`bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 flex items-center ${
							isLoading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					>
						{isLoading ? 'Generating Plan...' : 'Generate Your Plan'}
						<ChevronRight className='ml-2 w-6 h-6' />
					</button>
				</div>
			</form>
		</div>
	);
}

export default Questionnaire;
