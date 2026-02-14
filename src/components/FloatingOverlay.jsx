import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Lightbulb, CheckSquare, AlertTriangle, X, Minus,
  Maximize2, GripHorizontal, Bot, Clock, Zap, ChevronRight
} from 'lucide-react';
import './FloatingOverlay.css';

// ─── Mock Feed Data ───
const mockInsights = [
  { id: 1, time: '2m ago', text: 'Speaker mentioned Q4 deadline — conflicts with current sprint velocity.', type: 'warning' },
  { id: 2, time: '5m ago', text: 'Key decision: Team agreed to adopt microservices for the payment module.', type: 'info' },
  { id: 3, time: '8m ago', text: 'Action item detected: "Send updated wireframes by Friday."', type: 'action' },
  { id: 4, time: '12m ago', text: 'Sentiment shift detected — David expressed concerns about timeline feasibility.', type: 'warning' },
];

const mockTasks = [
  { id: 1, text: 'Send updated wireframes by Friday', assignee: 'You', priority: 'high' },
  { id: 2, text: 'Review queuing microservice docs', assignee: 'David', priority: 'medium' },
  { id: 3, text: 'Update Q4 budget spreadsheet', assignee: 'Sarah', priority: 'low' },
  { id: 4, text: 'Finalize CRM platform list', assignee: 'Marcus', priority: 'high' },
];

const mockRisks = [
  { id: 1, text: 'Legacy endpoint rate-limiting may add 15% to QA timeline', severity: 'high', area: 'Engineering' },
  { id: 2, text: 'Budget increase not yet approved by finance', severity: 'medium', area: 'Finance' },
  { id: 3, text: 'Mobile mockup deadline at risk — designer OOO Thursday', severity: 'high', area: 'Design' },
];

// ─── Priority / Severity Colors ───
const priorityColors = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const insightTypeIcons = {
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  info: <Lightbulb size={14} className="text-blue-400" />,
  action: <CheckSquare size={14} className="text-emerald-400" />,
};

// ─── Timer Hook ───
function useTimer(isRunning) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!isRunning) return;
    setSeconds(0);
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ─── Main Component ───
const FloatingOverlay = ({ isCapturing, onStopCapture }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const overlayRef = useRef(null);
  const timer = useTimer(isCapturing);

  // ─── Drag Logic ───
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('[data-no-drag]')) return;
    setIsDragging(true);
    const rect = overlayRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.current.y)),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.classList.add('floating-dragging');
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('floating-dragging');
    };
  }, [isDragging]);

  // Reset position when expanding/collapsing
  useEffect(() => {
    if (expanded) {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 370),
        y: Math.min(prev.y, window.innerHeight - 500),
      }));
    }
  }, [expanded]);

  if (!isCapturing) return null;

  // ─── Bubble (Collapsed) ───
  if (!expanded) {
    return (
      <div
        ref={overlayRef}
        className="fixed z-[9999]"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500 pulse-ring" />

        {/* Bubble */}
        <div
          className="floating-bubble relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 transition-transform duration-200"
          onClick={() => setExpanded(true)}
        >
          <Bot size={24} className="text-white" />

          {/* Recording indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 rec-dot" />
        </div>

        {/* Timer label */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap">
          🔴 {timer}
        </div>
      </div>
    );
  }

  // ─── Panel (Expanded) ───
  const tabs = [
    { id: 'insights', label: 'Insights', icon: Lightbulb, count: mockInsights.length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: mockTasks.length },
    { id: 'risks', label: 'Risks', icon: AlertTriangle, count: mockRisks.length },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed z-[9999] floating-panel"
      style={{ left: position.x, top: position.y }}
    >
      <div className="w-[360px] h-[480px] rounded-2xl overflow-hidden flex flex-col bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">

        {/* ─── Header ─── */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-semibold leading-tight">SyncMind</div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full rec-dot" />
                <span className="font-mono">{timer}</span>
                <span className="text-gray-600">•</span>
                <span>Listening</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1" data-no-drag>
            <button
              onClick={() => setExpanded(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={onStopCapture}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Stop Capture"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex border-b border-white/5 px-2 pt-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-no-drag
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-t-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white bg-white/5 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2" data-no-drag>
          {activeTab === 'insights' && (
            <div className="tab-content-enter space-y-2">
              {mockInsights.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{insightTypeIcons[item.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-gray-200 leading-relaxed">{item.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tab-content-enter space-y-2">
              {mockTasks.map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className="mt-1 w-4 h-4 rounded border border-gray-600 flex-shrink-0 cursor-pointer hover:border-blue-500 transition-colors" />
                      <div>
                        <p className="text-[13px] text-gray-200">{task.text}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Assigned: {task.assignee}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="tab-content-enter space-y-2">
              {mockRisks.map(risk => (
                <div key={risk.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={14} className={`mt-0.5 flex-shrink-0 ${risk.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                    <div className="flex-1">
                      <p className="text-[13px] text-gray-200 leading-relaxed">{risk.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${priorityColors[risk.severity]}`}>
                          {risk.severity}
                        </span>
                        <span className="text-[10px] text-gray-500">{risk.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <Zap size={10} className="text-blue-400" />
            <span>AI processing — 4 insights captured</span>
          </div>
          <button
            onClick={onStopCapture}
            data-no-drag
            className="text-[10px] text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
          >
            Stop <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingOverlay;
