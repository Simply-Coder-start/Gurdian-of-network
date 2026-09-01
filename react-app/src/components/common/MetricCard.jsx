import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const MetricCard = ({
  title,
  value,
  delta,
  subtitle,
  icon: Icon,
  color = 'primary',
  children,
  badgeText,
  onClick
}) => {
  const isPositive = (delta || '').startsWith('+');

  const borderColor =
    color === 'error'
      ? 'hover:border-error/40'
      : color === 'warning'
      ? 'hover:border-warning/40'
      : color === 'healthy'
      ? 'hover:border-healthy/40'
      : 'hover:border-primary/40';

  const iconColor =
    color === 'error'
      ? 'text-error'
      : color === 'warning'
      ? 'text-warning'
      : color === 'healthy'
      ? 'text-healthy'
      : 'text-primary';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`group relative bg-[#0D1318] border border-[#1C2630] ${borderColor} rounded-xl p-4 shadow-sm flex flex-col justify-between transition-colors duration-200 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-gray-400 group-hover:text-gray-300 uppercase tracking-wider font-semibold transition-colors">
          {title}
        </span>
        {Icon && (
          <div className="p-1 rounded-md bg-[#131B22] border border-[#1F2B37]">
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          </div>
        )}
      </div>

      {/* Card Body: Metric Value or Custom Children */}
      {children ? (
        <div>{children}</div>
      ) : (
        <div className="my-2">
          <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white block">
            {value}
          </span>
        </div>
      )}

      {/* Card Footer: Delta & Subtitle */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <div className="flex items-center gap-1.5 font-mono">
          {delta && (
            <span
              className={`font-semibold ${
                color === 'error'
                  ? 'text-error'
                  : isPositive
                  ? 'text-primary'
                  : 'text-warning'
              }`}
            >
              {delta}
            </span>
          )}
          {subtitle && (
            <span className="text-gray-500 text-[11px] truncate">
              {subtitle}
            </span>
          )}
        </div>

        {badgeText && (
          <span className="text-[10px] font-mono text-gray-500">
            {badgeText}
          </span>
        )}
      </div>
    </motion.div>
  );
};
