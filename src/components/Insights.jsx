import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

const Insights = ({ meetings = [] }) => {
    // Flatten all insights from all meetings
    const allInsights = meetings.flatMap(meeting =>
        (meeting.insights || []).map((insight, index) => ({
            id: `${meeting.meetingId}-${index}`,
            meetingId: meeting.meetingId,
            date: new Date(meeting.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            sourceMeeting: meeting.summary || "Untitled Meeting",
            content: insight.text,
        }))
    );

    return (
        <div className="h-full overflow-y-auto bg-gray-50/50 dark:bg-black transition-colors duration-200">
            <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" />
                    Insights & Recommendations
                </h1>

                {allInsights.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 p-8 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                        No insights found in recent meetings.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {allInsights.map((insight) => (
                            <div key={insight.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1 pr-4">{insight.sourceMeeting}</h3>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-shrink-0">{insight.date}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{insight.content}</p>

                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm cursor-pointer hover:underline">
                                    <span>View meeting details</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
