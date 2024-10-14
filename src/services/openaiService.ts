import axios from 'axios';
import { UserData } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
console.log('All env variables:', import.meta.env);
const API_URL = 'https://api.openai.com/v1/chat/completions';

interface PlanRequest extends UserData {
	planType: string;
	timeFrame: string;
}

export async function generatePlan(data: PlanRequest): Promise<string> {
	const prompt = `Generate a comprehensive, professional, and personalized ${data.planType} for a ${
		data.age
	}-year-old ${data.gender.toLowerCase()} with the following profile:

Client Profile:
- Height: ${data.height.feet}'${data.height.inches}"
- Weight: ${data.weight} lbs
- Fitness Level: ${data.fitnessLevel}
- Available Workout Days: ${data.workoutDays} days per week
- Primary Fitness Goal: ${data.fitnessGoal}
- Existing Injuries or Limitations: ${data.injury || 'None reported'}
- Preferred Training Type: ${data.trainingType}
- Meals Per Day: ${data.mealsPerDay}
- Allergies: ${data.allergies || 'None reported'}
- Dietary Restrictions: ${data.dietaryRestrictions || 'None reported'}
- Favorite Foods: ${data.favoriteFoods}
- Disliked Foods: ${data.dislikedFoods}

The plan should cover a ${data.timeFrame} period and include the following sections:

1. Executive Summary
   - Brief overview of the client's profile
   - Key goals and strategies

2. ${
		data.planType === 'Training & Nutrition plan'
			? `Fitness Program
   - Detailed weekly workout schedules
   - Day-by-day exercise routines, including:
     * Warm-up protocols
     * Main exercises with sets, reps, and target intensity
     * Cool-down and stretching routines
   - Progressive overload strategy
   - Adaptation and recovery considerations`
			: ''
	}

3. Nutrition Plan
   - Calculated daily caloric needs and macronutrient distribution
   - Meal-by-meal breakdown for each day of the week, including:
     * Specific food items and portions
     * Macronutrient totals per meal
     * Hydration recommendations
   - List of approved foods and alternatives
   - Strategies for dining out and social situations

4. Supplement Recommendations
   - Essential supplements with dosage and timing
   - Optional supplements based on specific goals

5. Progress Tracking
   - Key performance indicators to monitor
   - Measurement frequency and methods
   - Adjustments based on progress scenarios

6. Lifestyle and Habit Recommendations
   - Sleep optimization strategies
   - Stress management techniques
   - Daily habits to support goals

7. Motivation and Adherence
   - Goal-setting framework
   - Strategies for maintaining motivation
   - Accountability measures

8. Frequently Asked Questions
   - Anticipate and address common client concerns

Please provide a meticulously structured, easy-to-follow plan that addresses all aspects of the client's fitness journey, taking into account their specific needs, preferences, and potential challenges.`;

	try {
		const response = await axios.post(
			API_URL,
			{
				model: 'gpt-4',
				messages: [{ role: 'user', content: prompt }],
				max_tokens: 3000,
				temperature: 0.7,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${API_KEY}`,
				},
			}
		);

		return response.data.choices[0].message.content.trim();
	} catch (error) {
		console.error('Error calling OpenAI API:', error);
		throw new Error('Failed to generate plan');
	}
}
