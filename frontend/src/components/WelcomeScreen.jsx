import React from "react";
import { Terminal, Code2, Database, Globe, Cpu, GitBranch } from "lucide-react";
import zeninlogo from "./ZEniNN.jpg"

// Capability cards shown on the welcome screen
const CAPABILITIES = [
  {
    icon: Code2,
    title: "Code & Algorithms",
    desc: "Debug code, review logic, or learn data structures",
  },
  {
    icon: Globe,
    title: "Web Development",
    desc: "React, Node.js, APIs, CSS — frontend to backend",
  },
  {
    icon: Database,
    title: "Databases",
    desc: "MongoDB, SQL, Redis, schema design & optimization",
  },
  {
    icon: Cpu,
    title: "System Design",
    desc: "Architecture patterns, scalability, microservices",
  },
  {
    icon: GitBranch,
    title: "DevOps & Cloud",
    desc: "Docker, CI/CD, AWS, deployment strategies",
  },
  {
    icon: Terminal,
    title: "CS Fundamentals",
    desc: "OS, networking, compilers, computer science theory",
  },
];

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 animate-fade-in">
      {/* Hero section */}
      <div className="text-center mb-10">
        {/* Animated logo */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
          <div className="absolute inset-0 bg-yellow-600 rounded-2xl opacity-20 animate-pulse-slow" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl flex items-center justify-center glow-yellow">
           <img className=" h-full w-full object-cover rounded-xl" src={zeninlogo} alt="" />
          </div>
        </div>

        <h2 className="font-display font-bold text-3xl text-white mb-2 glow-text">
          Welcome to ZeniN
        </h2>
        <p className="text-slate-400 text-base max-w-md leading-relaxed">
          Your AI-powered technical mentor. Ask ZeniN anything about programming,
          system design, databases, or software engineering.
        </p>

        {/* Domain badge */}
        <div className="inline-flex items-center gap-2 mt-4 bg-yellow-600 border border-brand-800 text-slate-950 text-xs font-medium px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          Technical domain only
        </div>
      </div>

      {/* Capabilities grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
        {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-surface-800 border border-surface-600 hover:border-brand-800 rounded-xl p-4 transition-all duration-200 hover:bg-surface-700 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon
                size={15}
                className="text-brand-500 group-hover:text-brand-400 transition-colors"
              />
              <span className="text-sm font-semibold text-slate-300 font-display">
                {title}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-700">
        Start by typing a question below or pick one of the suggested prompts
      </p>
    </div>
  );
}

export default WelcomeScreen;
