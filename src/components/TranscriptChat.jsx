import React from 'react';

const TranscriptChat = ({ transcript }) => {
    if (!transcript) return null;

    // Split by newlines and remove empty lines
    const lines = transcript.split('\n').filter(l => l.trim() !== '');

    // Render speakers in uniform left-aligned blocks.

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

                return (
                    <div key={i} className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800/60 p-4 rounded-2xl text-sm text-gray-900 dark:text-gray-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {speaker}
                        </span>
                        <span className="leading-relaxed text-gray-800 dark:text-gray-200">
                            {text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptChat;
