import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';

function GeneratedPlan() {
	const location = useLocation();
	const [plan, setPlan] = useState<string[]>([]);
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		if (location.state) {
			const { plan: newPlan, isComplete: newIsComplete } = location.state as {
				plan: string[];
				isComplete: boolean;
			};
			setPlan(newPlan);
			setIsComplete(newIsComplete);
		}
	}, [location.state]);

	return (
		<div className='min-h-screen bg-[#26282e] text-[#f6f7f8]'>
			<div className='max-w-5xl mx-auto pt-10 px-6'>
				<div className='flex justify-between items-center mb-8'>
					<Link to='/' className='flex items-center text-[#dd293b] hover:text-[#f6f7f8] transition-colors duration-300'>
						<ArrowLeft className='mr-2 w-6 h-6' />
						<span className='font-bold text-xl'>Back to Home</span>
					</Link>
				</div>
				<div className='bg-[#f6f7f8] p-10 rounded-3xl shadow-2xl'>
					{plan.map((section: string, index: number) => {
						const [title, ...content] = section.split('\n');
						return (
							<div key={index} className='mb-14'>
								<h2 className='text-4xl font-bold mb-8 text-[#dd293b] border-b-2 border-[#dd293b] pb-3'>
									{title.trim()}
								</h2>
								<div className='space-y-6'>
									{content.map((paragraph: string, pIndex: number) => {
										if (paragraph.trim().endsWith(':')) {
											return (
												<h3 key={pIndex} className='text-3xl font-bold text-[#26282e] mt-8 mb-4'>
													{paragraph.trim()}
												</h3>
											);
										}
										return (
											<p key={pIndex} className='text-[#26282e] text-xl font-semibold leading-relaxed'>
												{paragraph.trim()}
											</p>
										);
									})}
								</div>
							</div>
						);
					})}
					{!isComplete && (
						<div className='flex items-center justify-center text-[#dd293b] mt-10'>
							<Loader className='animate-spin mr-3 w-8 h-8' />
							<span className='text-2xl font-bold'>Loading more content...</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default GeneratedPlan;
