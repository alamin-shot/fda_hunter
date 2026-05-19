import React from 'react'

interface StaticsIconProps {
  active?: boolean;
}


export default function StaticsIcon({ active = false }: StaticsIconProps) {

    const fillColor = active ? "#1D1F2C" : "#FFF";
  const strokeColor = active ? "#1D1F2C" : "#FFF";
  const strokeWidth = active ? "0" : "1.5";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M4 9V20" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M8 4V20" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M12 11V20" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M16 7V20" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M20 14V20" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  )
}
