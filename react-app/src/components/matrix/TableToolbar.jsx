import React from 'react';
import { Search, X } from 'lucide-react';

export const TableToolbar = ({
  searchQuery, setSearchQuery,
  filterType, setFilterType,
  filterStatus, setFilterStatus,
  filterSeverity, setFilterSeverity
}) => {
  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
      
      {/* Left: Universal Search & Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search IP, Host, Title, MITRE ID (e.g. T1048)..."
            className="bg-[#11171E] h-8 pl-8 pr-3 rounded-lg border border-[#1C2630] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2FD9C8] w-56 sm:w-72 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 text-gray-400 hover:text-white text-xs">✕</button>
          )}
        </div>

        {/* Threat Type Filter */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-gray-300 focus:outline-none focus:border-[#2FD9C8] cursor-pointer"
        >
          <option value="ALL">All Threat Types</option>
          <option value="EXFILTRATION">Exfiltration</option>
          <option value="C2 BEACONING">C2 Beaconing</option>
          <option value="DNS TUNNELING">DNS Tunneling</option>
          <option value="RECONNAISSANCE">Reconnaissance</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-gray-300 focus:outline-none focus:border-[#2FD9C8] cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        {/* Reset */}
        {(searchQuery || filterSeverity !== 'ALL' || filterType !== 'ALL' || filterStatus !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterSeverity('ALL');
              setFilterType('ALL');
              setFilterStatus('ALL');
            }}
            className="p-1.5 rounded-lg bg-[#141A21] border border-[#1C2630] text-gray-400 hover:text-white text-xs flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right: Severity Quick-Tabs */}
      <div className="flex items-center gap-2">
        <div className="flex bg-[#141A21] p-1 rounded-lg border border-[#1C2630] text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 rounded font-medium transition ${
                filterSeverity === s ? 'bg-[#2FD9C8] text-gray-950 font-bold shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
