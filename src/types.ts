export interface UserData {
	name: string;
	gender: string;
	age: string;
	weight: string;
	height: {
		feet: string;
		inches: string;
	};
	fitnessLevel: string;
	workoutDays: string;
	fitnessGoal: string;
	injury: string;
	trainingType: string;
	mealsPerDay: string;
	allergies: string;
	dietaryRestrictions: string;
	favoriteFoods: string;
	dislikedFoods: string;
}

export interface PlanSelection {
	planType: string;
	timeFrame: string;
}
