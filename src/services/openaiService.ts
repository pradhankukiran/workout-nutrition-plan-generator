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
		`4. Create a personalized ${data.timeFrame}  program overview for ${data.fitnessGoal}. The overview should:
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

		`5. Divide the total timeframe of ${data.timeFrame} weeks into phases of 4 weeks each, focusing on the user's fitness goal (${data.fitnessGoal}) and fitness level (${data.fitnessLevel}). Provide an overview for each phase with a motivational heading and a brief description (50-60 words).

    For each phase (e.g., "Phase 1: Weeks 1-4", "Phase 2: Weeks 5-8", "Phase 3: Weeks 9-12"):
    1. Divide each phase into two sub-phases of 2 weeks each (e.g., "Weeks 1-2", "Weeks 3-4").
    2. For each sub-phase, provide a **detailed** workout plan for ${data.workoutDays} workout days per week, ensuring that **each day has a unique workout**:
       - Include a minimum of 3 different exercises for each day, tailored to ${data.trainingType}.
       - Provide the number of sets and reps for every exercise, adjusted to the user's fitness level (${data.fitnessLevel}).
       - Each workout day must include different exercises from the previous day (no repeating "similar structure" without specifics).
       - Specify additional details like rest times, intensity, and workout focus (e.g., form, endurance, strength).
    3. Ensure that no day in any phase or sub-phase says "Repeat similar structure" or "Repeat Day 1 workout". Every workout day must be fully unique, with at least 3 exercises and their respective sets and reps.
    
    ### Example of Detailed Daily Workout Plan:
    **Week 1, Day 1:**
    - Warm-up: 5-10 minutes cardio or mobility drills
    - **Exercise 1**: Deadlifts (3 sets of 8 reps)
    - **Exercise 2**: Barbell Bench Press (3 sets of 10 reps)
    - **Exercise 3**: Pull-ups (3 sets of 8 reps)
    - Rest: 60-90 seconds between sets
    
    **Week 1, Day 2:**
    - Warm-up: 5-10 minutes dynamic stretching
    - **Exercise 1**: Squats (3 sets of 10 reps)
    - **Exercise 2**: Dumbbell Curls (3 sets of 12 reps)
    - **Exercise 3**: Weighted Lunges (3 sets of 10 reps)
    - Rest: 60-90 seconds between sets
    
    **Week 1, Day 3:** (Provide completely new exercises)
    - Warm-up: 5-10 minutes cycling or light jogging
    - **Exercise 1**: Overhead Press (3 sets of 10 reps)
    - **Exercise 2**: Bent-over Rows (4 sets of 8 reps)
    - **Exercise 3**: Russian Twists (3 sets of 20 reps)
    - Rest: 60-90 seconds between sets
    
    (Continue detailing every single workout day...)
    
    ### Plan Structure:
    - **Phase 1 (Weeks 1-4)**:
      - Weeks 1-2: [Insert detailed workout plan for every workout day in these two weeks]
      - Weeks 3-4: [Insert detailed workout plan for every workout day in these two weeks]
    - **Phase 2 (Weeks 5-8)**:
      - Weeks 5-6: [Insert detailed workout plan for every workout day in these two weeks]
      - Weeks 7-8: [Insert detailed workout plan for every workout day in these two weeks]
    - **Phase 3 (Weeks 9-12)**:
      - Weeks 9-10: [Insert detailed workout plan for every workout day in these two weeks]
      - Weeks 11-12: [Insert detailed workout plan for every workout day in these two weeks]
    
    ### Final Output:
    Provide a detailed workout plan for all ${data.timeFrame} weeks, ensuring every single workout day has at least 3 unique exercises, sets, and reps. No day should use placeholder text such as "Repeat similar structure" or "Repeat Day 1 workout". Every day must be fully detailed, with unique exercises, and must progress according to the user’s fitness goal and training type.
    `,
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
