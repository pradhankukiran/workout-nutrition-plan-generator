import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

function GeneratedPlan() {
  const location = useLocation();
  const { plan } = (location.state as { plan: string }) || { plan: '' };

  const sections: string[] = plan.split(/\d+\.\s+/).filter(Boolean);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          Back to Questionnaire
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <Printer className="mr-2" />
          Print Plan
        </button>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Your Personalized Fitness Plan
        </h1>
        {sections.map((section: string, index: number) => {
          const [title, ...content] = section.split('\n');
          return (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                {title.trim()}
              </h2>
              <div className="space-y-4">
                {content.map((paragraph: string, pIndex: number) => {
                  if (paragraph.trim().endsWith(':')) {
                    return (
                      <h3
                        key={pIndex}
                        className="text-xl font-medium text-gray-300 mt-4"
                      >
                        {paragraph.trim()}
                      </h3>
                    );
                  }
                  return (
                    <p key={pIndex} className="text-gray-300 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GeneratedPlan;
