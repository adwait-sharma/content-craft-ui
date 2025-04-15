import React from 'react';

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={`${className} transform transition-transform hover:rotate-12 duration-500 ease-in-out`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="purpleRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#805AD5' }}>
            <animate
              attributeName="stop-color"
              values="#805AD5; #9F7AEA; #805AD5"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" style={{ stopColor: '#B83280' }}>
            <animate
              attributeName="stop-color"
              values="#B83280; #D53F8C; #B83280"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style={{ stopColor: '#E53E3E' }}>
            <animate
              attributeName="stop-color"
              values="#E53E3E; #F56565; #E53E3E"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="url(#purpleRedGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 