import React from "react";
import { useTheme } from "next-themes";

const EyeIcon = ({ size = 24, isActive = false, ...props }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light" || theme === undefined;
  const color = isLightTheme ? "#101828" : "#A1A1A1";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {isActive && (
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#22E9AD" }} />
            <stop offset="100%" style={{ stopColor: "#9846FE" }} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M21.2571 10.962C21.7311 11.582 21.7311 12.419 21.2571 13.038C19.7641 14.987 16.1821 19 12.0001 19C7.81806 19 4.23606 14.987 2.74306 13.038C2.51211 12.7413 2.38672 12.376 2.38672 12C2.38672 11.624 2.51211 11.2587 2.74306 10.962C4.23606 9.013 7.81806 5 12.0001 5C16.1821 5 19.7641 9.013 21.2571 10.962Z"
        stroke={isActive ? "url(#gradient)" : color}
        strokeOpacity={isActive ? 1 : 0.7}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={isActive ? "url(#gradient)" : color}
        strokeOpacity={isActive ? 1 : 0.7}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EyeIcon;

