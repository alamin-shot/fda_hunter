import React from 'react'

interface LogoutIconProps {
  active?: boolean;
}


export default function LogoutIcon({active=false}:LogoutIconProps) {
      const fillColor = active ? "#1D1F2C" : "#FFF";
  const strokeColor = active ? "#1D1F2C" : "#FFF";
  const strokeWidth = active ? "0" : "1.5";
  return (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 9L9 12M9 12L12 15M9 12H21" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M15 7.5V7C15 4.79086 13.2091 3 11 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H11C13.2091 21 15 19.2091 15 17V16.5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  )
}
