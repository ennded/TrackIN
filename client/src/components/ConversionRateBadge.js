const ConversionRateBadge = ({ total, accepted }) => {
  const rate = total > 0 ? (accepted / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="text-green-500"
            strokeWidth="8"
            strokeDasharray={`${rate} 100`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-700">
          {Math.round(rate)}%
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-500">Conversion Rate</p>
        <p className="text-sm font-semibold text-gray-700">
          {accepted}/{total} Success
        </p>
      </div>
    </div>
  );
};
export default ConversionRateBadge;
