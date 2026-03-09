import React from 'react';
import { ArrowLeft, ArrowRight, Mic, Brain, Zap, Shield, FileText, Users, BarChart2, CheckSquare, Bell, Cloud, Search, Lock } from 'lucide-react';
import { GLSLHills } from './ui/glsl-hills';

const FeaturesPage = ({ onBack, onGetSoftware, onLaunch }) => {

    const coreFeatures = [
        {
            icon: Mic,
            color: 'blue',
            title: 'Real-Time Audio Capture',
            desc: 'The SyncMInd desktop app silently records audio from any meeting — in-person, Zoom, Teams, Google Meet, or any other platform — running quietly in your Windows system tray.',
        },
        {
            icon: Brain,
            color: 'purple',
            title: 'AI Transcription',
            desc: 'Every word is transcribed with speaker identification. Raw audio is processed through our AWS Lambda AI pipeline and converted to structured, readable text within seconds of your meeting ending.',
        },
        {
            icon: FileText,
            color: 'pink',
            title: 'Automatic Summaries',
            desc: 'Get a concise meeting summary automatically generated after every call. No more scrolling through long transcripts — the key decisions and takeaways are highlighted for you.',
        },
        {
            icon: CheckSquare,
            color: 'green',
            title: 'Action Item Extraction',
            desc: 'AI identifies and extracts action items from the conversation automatically. Every task, commitment, and follow-up is surfaced and displayed clearly in your dashboard.',
        },
        {
            icon: BarChart2,
            color: 'yellow',
            title: 'Meeting Insights',
            desc: 'Get a high-level view across all your meetings — track how much time you spend in calls, identify recurring topics, and spot trends in your team\'s conversations over time.',
        },
        {
            icon: Users,
            color: 'blue',
            title: 'Speaker Identification',
            desc: 'Transcripts are broken down by speaker so you always know who said what. Each section of the conversation is clearly attributed to the correct participant.',
        },
    ];

    const dashboardFeatures = [
        {
            icon: Search,
            title: 'Search Across Meetings',
            desc: 'Instantly search through all your past meeting transcripts and summaries to find any detail, decision, or discussion.',
        },
        {
            icon: Bell,
            title: 'Real-Time Updates',
            desc: 'The dashboard polls for new meetings automatically — results appear within moments of your recording finishing processing.',
        },
        {
            icon: Cloud,
            title: 'Cloud Synced',
            desc: 'All your data is stored securely in AWS DynamoDB. Access your meetings from any browser, anywhere.',
        },
        {
            icon: Lock,
            title: 'Per-User Privacy',
            desc: 'Every user\'s meeting data is completely isolated. Only you can see your own recordings, transcripts, and insights.',
        },
        {
            icon: Zap,
            title: 'Instant Processing',
            desc: 'Serverless processing means there\'s no queue. Your meeting is processed the moment it\'s uploaded, regardless of load.',
        },
        {
            icon: Shield,
            title: 'Secure by Default',
            desc: 'All data is encrypted in transit and at rest. Your conversations stay private — always.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white relative overflow-auto">

            {/* GLSL Hills Background */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <GLSLHills width="100%" height="100%" speed={0.3} />
            </div>

            {/* Dark gradient overlay */}
            <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">

                {/* Navbar */}
                <div className="flex justify-between items-center px-8 pt-8 pb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    {/* spacer */}
                    <div />

                    <button
                        onClick={onGetSoftware}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                    >
                        Get the Software <ArrowRight size={14} />
                    </button>
                </div>

                {/* Hero */}
                <div className="max-w-4xl mx-auto px-8 pt-16 pb-16 text-center">
                    <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 }} className="mb-6">
                        <span className="italic font-thin" style={{ fontSize: '0.8em' }}>Everything you need,<br /></span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">built right in.</span>
                    </h1>

                    <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        From silent audio capture to AI-generated summaries and action items — SyncMInd handles the entire meeting intelligence pipeline for you.
                    </p>

                    <button
                        onClick={onLaunch}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-all backdrop-blur-sm"
                    >
                        Open Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                <div className="max-w-6xl mx-auto px-8 pb-20">

                    {/* Core Features */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-white text-center mb-2">Core Features</h2>
                        <p className="text-gray-500 text-center mb-10">From your mic to your dashboard — fully automated.</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {coreFeatures.map((f, i) => (
                                <div key={i} className="p-7 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all group">
                                    <div className={`w-12 h-12 bg-${f.color}-500/20 border border-${f.color}-500/20 rounded-xl flex items-center justify-center text-${f.color}-400 mb-5 group-hover:scale-110 transition-transform`}>
                                        <f.icon size={22} />
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Features */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-white text-center mb-2">Dashboard Features</h2>
                        <p className="text-gray-500 text-center mb-10">Your meeting intelligence hub — smart, fast, and private.</p>
                        <div className="grid md:grid-cols-3 gap-5">
                            {dashboardFeatures.map((f, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0 border border-white/10">
                                        <f.icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How the pipeline works */}
                    <div className="mb-20 p-10 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl">
                        <h2 className="text-2xl font-bold text-white mb-2 text-center">The SyncMInd Pipeline</h2>
                        <p className="text-gray-500 text-sm text-center mb-10">Four steps from conversation to insight.</p>
                        <div className="grid md:grid-cols-4 gap-6 relative">
                            {[
                                { num: '01', title: 'Record', desc: 'Desktop app captures audio silently in the background.', icon: Mic },
                                { num: '02', title: 'Upload', desc: 'Audio is securely uploaded to AWS when the meeting ends.', icon: Cloud },
                                { num: '03', title: 'Process', desc: 'Lambda + AI transcribes, summarises, and extracts action items.', icon: Brain },
                                { num: '04', title: 'Deliver', desc: 'Results appear in your dashboard — ready to review and share.', icon: Zap },
                            ].map((step, i) => (
                                <div key={i} className="text-center relative">
                                    <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4">
                                        <step.icon size={24} />
                                    </div>
                                    <span className="text-blue-500 font-bold text-xs block mb-1">{step.num}</span>
                                    <h3 className="font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center p-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl backdrop-blur-sm">
                        <h2 className="text-3xl font-bold text-white mb-3">Ready to experience it?</h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">Download SyncMInd for Windows and let it handle your next meeting — automatically.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onGetSoftware}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
                            >
                                Get the Software <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={onLaunch}
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
                            >
                                Open Dashboard <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                </div>

                <footer className="text-center py-8 text-gray-600 text-xs border-t border-white/5">
                    &copy; 2026 SyncMInd Inc. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default FeaturesPage;
