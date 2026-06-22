// Dashboard icon SVG — replace the book icon in Login.jsx
// 4 cards representing: stats, trends, users, success
const DashboardIcon = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer glow */}
    <circle cx="60" cy="60" r="56" fill="#3C3489" opacity="0.5" />
    {/* Inner bg */}
    <circle cx="60" cy="60" r="46" fill="#3C3489" />

    {/* Top-left: bar chart card */}
    <rect x="24" y="24" width="30" height="28" rx="6" fill="#7F77DD" />
    <rect
      x="29"
      y="42"
      width="4"
      height="6"
      rx="1"
      fill="#EEEDFE"
      opacity="0.5"
    />
    <rect
      x="35"
      y="37"
      width="4"
      height="11"
      rx="1"
      fill="#EEEDFE"
      opacity="0.8"
    />
    <rect x="41" y="33" width="4" height="15" rx="1" fill="#EEEDFE" />

    {/* Top-right: trend line card */}
    <rect x="66" y="24" width="30" height="28" rx="6" fill="#7F77DD" />
    <polyline
      points="71,44 78,38 85,41 92,33"
      stroke="#1D9E75"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="92" cy="33" r="2.5" fill="#1D9E75" />

    {/* Bottom-left: users card */}
    <rect x="24" y="66" width="30" height="30" rx="6" fill="#7F77DD" />
    <circle cx="39" cy="77" r="5" fill="#EEEDFE" opacity="0.9" />
    <path
      d="M29 91c0-5.523 4.477-8 10-8s10 2.477 10 8"
      stroke="#EEEDFE"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.9"
    />

    {/* Bottom-right: success/accent card */}
    <rect
      x="66"
      y="66"
      width="30"
      height="30"
      rx="6"
      fill="#1D9E75"
      opacity="0.85"
    />
    <polyline
      points="74,81 80,87 92,75"
      stroke="#EEEDFE"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Center subtle cross */}
    <circle cx="60" cy="60" r="3" fill="#EEEDFE" opacity="0.4" />
    <line
      x1="54"
      y1="52"
      x2="54"
      y2="68"
      stroke="#EEEDFE"
      strokeWidth="0.8"
      opacity="0.2"
    />
    <line
      x1="52"
      y1="60"
      x2="68"
      y2="60"
      stroke="#EEEDFE"
      strokeWidth="0.8"
      opacity="0.2"
    />
  </svg>
);

export default DashboardIcon;
