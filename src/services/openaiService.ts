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

export async function generatePlan(data: PlanRequest, onUpdate: (section: string) => void): Promise<void> {
	const systemPrompt = `You are an expert fitness and nutrition coach specializing in creating highly personalized workout and meal plans. Your goal is to provide clear, structured, and detailed plans based on the user’s profile, needs, fitness level, and goals.`;

	const prompts = [
		`1. Generate a section with the following elements:
    Title:  "${data.timeFrame} PLAN" in a large, bold font.
Subtitle:  "${data.name}" in a slightly smaller but still prominent font.`,
		`2. Generate a section with the following elements:
    At the top, generate a catchy program name based on the ${data.fitnessGoal} (e.g., for weight loss, a name like "Shred & Burn" or "Lean Machine").
    Leave space below the program name.
    Center the text "${data.fitnessGoal}" in all caps and bold font to emphasize the main goal of the plan (e.g., WEIGHT LOSS, MUSCLE GAIN, etc.).
    After another small space, center the text "${data.workoutDays} DAY SPLIT" to indicate the workout frequency.`,
		`3. Generate a structured section with the following elements:

    Profile Section:
    Header: “${data.name}'S PROFILE”
    Show the following personal information:
    Gender: ${data.gender}
    Age: ${data.age}
    Weight: ${data.weight}
    Height: ${data.height.feet}' ${data.height.inches}"
    
    Training Section:
    Header: “TRAINING”
    Present the following information in a bulleted list format:
    Current Fitness Level: ${data.fitnessLevel}
    Exercise Preferences: ${data.trainingType}
    Schedule: ${data.workoutDays} per week
    Specific Goals: ${data.fitnessGoal}
    Injury History: ${data.injury}
    
    Nutrition Section:
    Header: “NUTRITION”
    Display the following details:
    Primary Fitness Goal: ${data.fitnessGoal}
    Number of Meals: ${data.mealsPerDay}
    Current Diet: {data.currentDiet}
    Favorite Foods: ${data.favoriteFoods}
    Diskliked Food: ${data.dislikedFoods}
    Dietary Restrictions: ${data.dietaryRestrictions}
    Allergies: ${data.allergies}
    
    
   `,
		`Create a personalized ${data.timeFrame}  program overview for ${data.fitnessGoal}. The overview should:

   Begin with a friendly, encouraging introduction addressing the client by name: ${data.name}.
   Outline the program's goals and overall approach.
   Divide the program into phases depending upon the ${data.timeFrame} weeks that will be apt for workouts and training related to ${data.fitnessGoal}.
   For each phase, describe:
   
   The types of exercises (e.g., weightlifting, running) and their frequency
   How the intensity will progress
   Nutrition guidelines, including how to incorporate the client's favorite foods
   Expected outcomes or milestones
   
   Mention specific details like:
   Intermittent fasting schedule
   Interval training
   Adjustments to portion sizes and ingredients
   
   Use an encouraging, motivational tone throughout.The tone should be professional, informative, and objective. Avoid using first-person perspective or directly addressing the client.
   Conclude with a statement of confidence in the client's ability to succeed.
   The content should be conversational, personal, and tailored to the individual's preferences and goals. Aim for about 300-400 words in total. Dont use any closing or sign-off at the end`,
	];

	for (const prompt of prompts) {
		try {
			const sectionContent = await processPrompt(systemPrompt, prompt);
			onUpdate(sectionContent);
		} catch (error) {
			console.error('Error generating plan section:', error);
			onUpdate('Error generating this section. Please try again.');
		}
	}
}
