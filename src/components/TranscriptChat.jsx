import React from 'react';

const TranscriptChat = ({ transcript }) => {
    if (!transcript) return null;

    // Split by newlines and remove empty lines
    const lines = transcript.split('\n').filter(l => l.trim() !== '');

    // To handle alternating colors/alignment dynamically (in case there are more than 2 speakers)
    // We will assign the first speaker we see to 'right' (blue) to represent the user/main host,
    // and others to 'left' (gray). Or stick to the prompt's instruction:
    // Prompt: Speaker 1 messages align LEFT, Speaker 2 messages align RIGHT.

    return (
        <div className="flex flex-col gap-4 mt-2">
            {lines.map((line, i) => {
                // Parse speaker name before the colon
                const splitIndex = line.indexOf(':');
                if (splitIndex === -1) {
                    // Fallback if there's no colon
                    return (
                        <div key={i} className="text-sm text-gray-500 italic text-center my-2">
                            {line}
                        </div>
                    );
                }

                const speaker = line.substring(0, splitIndex).trim();
                const text = line.substring(splitIndex + 1).trim();

                // Determine if speaker 1
                const isSpeaker1 = speaker.toLowerCase().includes('1');

                return (
                    <div
                        key={i}
                        className={`flex w-full ${isSpeaker1 ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-[75%] md:max-w-[60%] flex flex-col gap-1 p-3.5 rounded-2xl text-sm shadow-sm ${isSpeaker1
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                                    : 'bg-blue-600 dark:bg-blue-600 text-white rounded-tr-sm'
                                }`}
                        >
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isSpeaker1 ? 'text-gray-500 dark:text-gray-400' : 'text-blue-200'}`}>
                                {speaker}
                            </span>
                            <span className="leading-relaxed">
                                {text}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptChat;
