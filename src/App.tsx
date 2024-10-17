import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import GeneratedPlan from './components/GeneratedPlan';

function App() {
	return (
		<Router>
			<div className='min-h-screen bg-gray-900 text-white'>
				<div className='container mx-auto px-4 py-8'>
					<h1 className='text-4xl font-bold mb-8 text-center'>Workout & Meal Plan Generation</h1>
					<Routes>
						<Route path='/' element={<Questionnaire />} />
						<Route path='/plan' element={<GeneratedPlan />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
