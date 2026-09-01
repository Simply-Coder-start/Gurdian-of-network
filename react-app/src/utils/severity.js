/**
 * Centralized Severity & Threshold Mapping (Single Source of Truth)
 * Conforms to SOC passive monitoring specification.
 */

export const SEVERITY_LEVELS = {
  INFORMATIONAL: 'informational',
  SUSPICIOUS: 'suspicious',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const getSeverityFromScore = (scorePct) => {
  if (scorePct >= 95) return SEVERITY_LEVELS.CRITICAL;
  if (scorePct >= 80) return SEVERITY_LEVELS.HIGH;
  if (scorePct >= 60) return SEVERITY_LEVELS.MEDIUM;
  return SEVERITY_LEVELS.SUSPICIOUS;
};

export const getSeverityBadgeStyle = (severity = 'medium') => {
  const norm = severity.toLowerCase();
  switch (norm) {
    case 'critical':
      return {
        bg: 'bg-[#E13B3B]/15',
        border: 'border-[#E13B3B]/40',
        text: 'text-[#E13B3B]',
        dot: 'bg-[#E13B3B]',
        label: 'CRITICAL'
      };
    case 'high':
      return {
        bg: 'bg-[#E8622F]/15',
        border: 'border-[#E8622F]/40',
        text: 'text-[#E8622F]',
        dot: 'bg-[#E8622F]',
        label: 'HIGH'
      };
    case 'medium':
      return {
        bg: 'bg-[#E8A23D]/15',
        border: 'border-[#E8A23D]/40',
        text: 'text-[#E8A23D]',
        dot: 'bg-[#E8A23D]',
        label: 'MEDIUM'
      };
    case 'suspicious':
      return {
        bg: 'bg-[#C9A227]/15',
        border: 'border-[#C9A227]/40',
        text: 'text-[#C9A227]',
        dot: 'bg-[#C9A227]',
        label: 'SUSPICIOUS'
      };
    case 'informational':
    default:
      return {
        bg: 'bg-[#4C8DFF]/15',
        border: 'border-[#4C8DFF]/40',
        text: 'text-[#4C8DFF]',
        dot: 'bg-[#4C8DFF]',
        label: 'INFO'
      };
  }
};
