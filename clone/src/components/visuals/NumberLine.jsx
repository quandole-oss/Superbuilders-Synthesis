const strokeColors = {
  blue: "#3b82f6",
  emerald: "#10b981",
  purple: "#a855f7",
  cyan: "#06b6d4",
  rose: "#f43f5e",
};

const fillColors = {
  blue: "#3b82f6",
  emerald: "#10b981",
  purple: "#a855f7",
  cyan: "#06b6d4",
  rose: "#f43f5e",
};

export default function NumberLine({ start = 0, end = 10, firstNumber, secondNumber, operation = "add", color = "blue" }) {
  const range = end - start;
  const padding = 40;
  const width = 600;
  const lineY = 70;
  const tickH = 10;

  const stroke = strokeColors[color] || "#3b82f6";
  const fill = fillColors[color] || "#3b82f6";

  // Calculate result
  const result = operation === "add" ? firstNumber + secondNumber : firstNumber - secondNumber;

  // Position helper: maps a number to x coordinate
  function xPos(n) {
    return padding + ((n - start) / range) * (width - 2 * padding);
  }

  // Arc: from firstNumber to result
  const arcStart = xPos(firstNumber);
  const arcEnd = xPos(result);
  const arcMidX = (arcStart + arcEnd) / 2;
  const arcHeight = Math.min(40, Math.abs(arcEnd - arcStart) * 0.4);
  const arcMidY = lineY - arcHeight - 10;

  // Generate tick positions
  const ticks = [];
  // Limit ticks to avoid clutter — show every 1 if range <= 20, else every 5
  const step = range <= 20 ? 1 : 5;
  for (let i = start; i <= end; i += step) {
    ticks.push(i);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg viewBox={`0 0 ${width} 110`} width="100%" className="overflow-visible">
        {/* Main line */}
        <line x1={padding} y1={lineY} x2={width - padding} y2={lineY} stroke="#475569" strokeWidth="2" />

        {/* Ticks and labels */}
        {ticks.map((n) => {
          const x = xPos(n);
          const isHighlight = n === firstNumber || n === result;
          return (
            <g key={n}>
              <line
                x1={x} y1={lineY - tickH / 2}
                x2={x} y2={lineY + tickH / 2}
                stroke={isHighlight ? fill : "#64748b"}
                strokeWidth={isHighlight ? 2.5 : 1.5}
              />
              <text
                x={x} y={lineY + 24}
                textAnchor="middle"
                fill={isHighlight ? fill : "#94a3b8"}
                fontSize="11"
                fontWeight={isHighlight ? "bold" : "normal"}
              >
                {n}
              </text>
            </g>
          );
        })}

        {/* Start circle */}
        <circle cx={arcStart} cy={lineY} r="5" fill={fill} />

        {/* End circle */}
        <circle cx={arcEnd} cy={lineY} r="5" fill={fill} opacity="0.7" />

        {/* Arc showing the jump */}
        <path
          d={`M ${arcStart} ${lineY} Q ${arcMidX} ${arcMidY} ${arcEnd} ${lineY}`}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeDasharray="6 3"
          opacity="0.8"
        />

        {/* Arrowhead at end of arc */}
        <circle cx={arcEnd} cy={lineY} r="3" fill={fill} />

        {/* Label on arc */}
        <text
          x={arcMidX} y={arcMidY - 4}
          textAnchor="middle"
          fill={fill}
          fontSize="12"
          fontWeight="bold"
        >
          {operation === "add" ? `+${secondNumber}` : `−${secondNumber}`}
        </text>
      </svg>
    </div>
  );
}
