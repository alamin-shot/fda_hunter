import React from 'react'

interface WalletIconProps {
  active?: boolean;
}

export default function WalletIcon({active=false}:WalletIconProps) {

 const fillColor = active ? "#1D1F2C" : "#FFF";
  const strokeColor = active ? "#1D1F2C" : "#FFF";
  const strokeWidth = active ? "0" : "1.5"; 

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M2.00098 12C2.00098 8.46252 2.00098 6.69377 3.05378 5.5129C3.22217 5.32403 3.40776 5.14935 3.60844 4.99087C4.86311 4 6.7424 4 10.501 4H13.501C17.2596 4 19.1389 4 20.3935 4.99087C20.5942 5.14935 20.7798 5.32403 20.9482 5.5129C22.001 6.69377 22.001 8.46252 22.001 12C22.001 15.5375 22.001 17.3062 20.9482 18.4871C20.7798 18.676 20.5942 18.8506 20.3935 19.0091C19.1389 20 17.2596 20 13.501 20H10.501C6.7424 20 4.86311 20 3.60844 19.0091C3.40776 18.8506 3.22217 18.676 3.05378 18.4871C2.00098 17.3062 2.00098 15.5375 2.00098 12Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M9.99902 16H11.499" stroke={strokeColor} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M14.499 16H17.999" stroke={strokeColor} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M2.00098 9H22.001" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round"/>
</svg>
  )
}
