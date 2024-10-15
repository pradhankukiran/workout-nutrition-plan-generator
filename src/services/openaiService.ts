import axios from 'axios';
import { UserData } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const API_URL = 'https://api.openai.com/v1/chat/completions';

interface PlanRequest extends UserData {
	planType: string;
	timeFrame: string;
}

async function processPrompt(systemPrompt: string, prompt: string): Promise<string> {
	try {
		const response = await axios.post(
			API_URL,
			{
				model: 'gpt-4',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: prompt },
				],
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
		throw new Error('Failed to generate plan section');
	}
}

export async function generatePlan(data: PlanRequest): Promise<string> {
	const systemPrompt = `You are a professional fitness and nutrition coach. Your task is to generate a comprehensive, personalized ${
		data.planType
	} for a ${data.age}-year-old ${data.gender.toLowerCase()} client. You must generate a structured, personalized plan that spans ${
		data.timeFrame
	}, focusing on helping the client achieve their primary goal.`;

	const prompts = [
		`1. Generate a catchy name for the fitness program that incorporates the client's name and main goal.

    2. Create a client profile with the following information:
       - Name: ${data.name}
       - Current Fitness Level: ${data.fitnessLevel}
       - Exercise Preferences: ${data.trainingType}
       - Schedule: ${data.workoutDays} days per week
       - Specific Goals: ${data.fitnessGoal}
       - Injury History:  ${data.injury || 'None reported'}
    
    3. Create a nutrition profile for the client:
       - Primary nutrition goal: [Relate to the ${data.fitnessGoal} goal]
       - Number of meals: ${data.mealsPerDay} per day
       - Favorite foods: ${data.favoriteFoods}
       - Dietary restrictions: ${data.dietaryRestrictions}
       - Allergies: ${data.allergies}
    
    4. Provide the client's personal information:
       - Gender: ${data.gender}
       - Age: ${data.age}
       - Weight: ${data.weight} lbs
       - Height: ${data.height.feet}'${data.height.inches}"
    
    5. Write a 3-4 paragraph introduction to the program that:
       - Welcomes the client by name
       - Outlines the overall structure of the ${data.timeFrame} plan
       - Mentions how the plan will progress through different phases
       - Emphasizes the tailored approach to both workouts and nutrition
       - Relates to the client's specific goals and preferences
       - Provides encouragement and sets a positive tone for the journey ahead
    
    Ensure all generated data is consistent and appropriate for a realistic fitness plan.`,
		`Create a detailed "Training Plan Overview" for the ${data.timeFrame} period, focusing on ${data.fitnessGoal}.`,
		`Create a detailed ${data.timeFrame} ${data.trainingType} workout plan for a ${data.gender}, age ${data.age}, with a goal of ${
			data.fitnessGoal
		}. The individual's current fitness level is ${data.fitnessLevel}, and they prefer ${
			data.trainingType
		} style workouts. They can commit to ${
			data.workoutDays
		} workouts per week, each lasting about the required minutes depending upon their ${
			data.fitnessLevel
		}. Include any relevant injury considerations if reported: ${data.injury || 'None reported'}.
    The plan should include:
    
    An overview of the entire program, broken down into 2-week phases.
    For each phase:
    a. A brief description of the focus and objectives
    b. A weekly workout schedule
    c. Detailed workout descriptions for each day, including:
    
    Specific exercises
    Number of sets and repetitions or duration
    Rest periods (if applicable)
    Any necessary equipment
    d. Progression strategies as the weeks advance
    
    
    Tips for proper form and technique
    Suggestions for warm-up and cool-down routines
    Advice on rest and recovery
    Modifications for ${data.fitnessLevel} fitness levels
    
    Additionally, provide a brief explanation of how this plan supports the individual's specific goals and how it can be adjusted if needed.
    Format the output in a clear, easy-to-read structure using markdown for headings and bullet points. Include a motivational message at the beginning and end of the plan.`,
		`Generate a detailed, data-dense nutrition plan for {duration} weeks, divided into 4-week phases. The plan should be tailored for a user with the following characteristics and preferences:

    User Profile:
    - Current weight: ${data.weight}lbs
    - Height: ${data.height.feet}'${data.height.inches}"
    - Age: ${data.age}
    - Gender: ${data.gender}
    - Activity level: ${data.fitnessLevel}
    - Fitness goal: ${data.fitnessGoal}
    
    Workout Information:
    - Workout type: ${data.trainingType} 
    - Workout frequency: ${data.workoutDays} workouts per week
    
    Dietary Preferences:
    - Number of meals per day: ${data.mealsPerDay}
    - Favorite foods: ${data.favoriteFoods}
    - Disliked foods: ${data.dislikedFoods}
    - Dietary restrictions: ${data.dietaryRestrictions}
    - Allergies: ${data.allergies}
    
    For each 4-week phase, provide the following comprehensive information:

Phase Overview:

Detailed nutritional focus and goals
Precise daily calorie and macronutrient targets (in grams and percentages)
In-depth explanation of adjustments from the previous phase, including scientific rationale


Weekly Meal Plan:

Highly detailed daily meal plans for each week, including:

Breakfast
Lunch
Dinner
Snacks (2-3 options per day)


For each meal and snack, provide:

Exact portion sizes in grams/ounces and household measurements
Complete list of ingredients with precise quantities
Detailed preparation methods and cooking instructions
Macronutrient breakdown (protein, carbs, fats) for each item


Ensure maximum variety with no meal repetitions within a week
Include a diverse range of foods, cooking methods, and cuisines


Nutritional Breakdown:

Comprehensive daily and weekly totals for:

Calories
Protein (g and % of total calories)
Carbohydrates (g and % of total calories)
Fats (g and % of total calories)
Fiber (g)
Essential micronutrients (vitamins and minerals)


Provide detailed averages and clearly explain progressive changes throughout the phase
Include visual representations (tables or charts) of macronutrient distributions


Phase Summary:

In-depth explanation of the nutritional strategy
Detailed analysis of how the plan supports the user's fitness goals and complements the workout plan
Evidence-based expected outcomes and benefits
Potential challenges and strategies to overcome them


Grocery List:

Exhaustive list of ingredients needed for the entire phase
Organized by food categories (proteins, carbs, fruits, vegetables, dairy, fats, spices, etc.)
Include precise quantities for each item (in grams/ounces and household measurements)
Suggest specific brands or varieties where relevant


Meal Timing and Workout Nutrition:

Provide a detailed schedule for meal and snack timing in relation to workouts
Include specific pre- and post-workout nutrition recommendations
Explain the rationale behind the timing of nutrient intake


Hydration Plan:

Daily water intake goals
Suggestions for optimal hydration around workouts
Include any recommended electrolyte supplementation


Supplement Recommendations:

If applicable, provide a list of recommended supplements
Include dosages, timing, and scientific rationale for each supplement


Meal Prep Guide:

Detailed instructions for batch cooking and meal prepping
Storage guidelines and shelf life for prepared meals
Time-saving tips and techniques


Progress Tracking:

Provide a template for tracking daily food intake, weight, and body measurements
Include guidelines for adjusting the plan based on progress


Recipe Variations:

For each week, include 2-3 alternative recipes for main meals to add variety
Ensure all alternatives fit within the same macronutrient profile



Ensure that the plan is meticulously detailed, scientifically grounded, and adapts progressively over the ${data.timeFrame} weeks to optimize results and prevent plateaus. The final product should be a comprehensive, professional-grade nutrition plan`,
	];

	let fullPlan = '';

	for (const prompt of prompts) {
		try {
			const sectionContent = await processPrompt(systemPrompt, prompt);
			fullPlan += sectionContent + '\n\n';
		} catch (error) {
			console.error('Error generating plan section:', error);
		}
	}

	if (!fullPlan) {
		throw new Error('Failed to generate any plan sections');
	}

	return fullPlan.trim();
}
