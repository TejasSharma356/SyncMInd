import React from 'react';

const speakerColors = [
    'text-blue-600 dark:text-blue-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-purple-600 dark:text-purple-400',
    'text-orange-600 dark:text-orange-400',
    'text-pink-600 dark:text-pink-400',
    'text-cyan-600 dark:text-cyan-400'
];

const TranscriptChat = ({ transcript }) => {
    if (!transcript) return null;

    // Split by newlines and remove empty lines
    const lines = transcript.split('\n').filter(l => l.trim() !== '');

    const grouped = [];
    let currentBlock = null;

    lines.forEach(line => {
        const splitIndex = line.indexOf(':');

        // Group consecutive lines from the same speaker and handle multi-line text
        if (splitIndex !== -1 && line.substring(0, splitIndex).toLowerCase().includes('speaker')) {
            const speaker = line.substring(0, splitIndex).trim();
            const text = line.substring(splitIndex + 1).trim();

            if (currentBlock && currentBlock.speaker === speaker) {
                currentBlock.text += ' ' + text;
            } else {
                if (currentBlock) grouped.push(currentBlock);
                currentBlock = { type: 'speaker', speaker, text: text };
            }
        } else {
            if (currentBlock) {
                currentBlock.text += ' ' + line.trim();
            } else {
                grouped.push({ type: 'fallback', text: line.trim() });
            }
        }
    });

    if (currentBlock) grouped.push(currentBlock);

    return (
        <div className="flex flex-col items-start gap-6 mt-4">
            {grouped.map((block, i) => {
                if (block.type === 'fallback') {
                    return (
                        <div key={i} className="text-base text-gray-500 italic text-center my-4 w-full">
                            {block.text}
                        </div>
                    );
                }

                // Extract a number from "Speaker 1" to assign consistent colors
                const match = block.speaker.match(/\d+/);
                const speakerNum = match ? parseInt(match[0], 10) : 1;
                const colorClass = speakerColors[(speakerNum - 1) % speakerColors.length];

                return (
                    <div key={i} className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-800/60 p-6 rounded-3xl text-lg w-full max-w-4xl shadow-sm border border-gray-100 dark:border-gray-800/50">
                        <span className={`text-sm font-bold uppercase tracking-wider ${colorClass}`}>
                            {block.speaker}
                        </span>
                        <span className="leading-relaxed text-gray-800 dark:text-gray-200">
                            {block.text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptChat;
