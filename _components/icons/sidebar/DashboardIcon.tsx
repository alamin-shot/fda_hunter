import React from 'react'

interface DashboardIconProps {
  active?: boolean;
}

export default function DashboardIcon({ active = false }: DashboardIconProps) {

  const fillColor = active ? "#1D1F2C" : "#FFF";
  const strokeColor = active ? "#2D6BB4" : "#E9E9EA";
  const strokeWidth = active ? "0" : "1.5";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fillRule="evenodd" clipRule="evenodd" d="M1.75 1.5C1.61193 1.5 1.5 1.61193 1.5 1.75V5.75C1.5 5.88807 1.61193 6 1.75 6H5.75C5.88807 6 6 5.88807 6 5.75V1.75C6 1.61193 5.88807 1.5 5.75 1.5H1.75ZM0 1.75C0 0.783502 0.783502 0 1.75 0H5.75C6.7165 0 7.5 0.783502 7.5 1.75V5.75C7.5 6.7165 6.7165 7.5 5.75 7.5H1.75C0.783502 7.5 0 6.7165 0 5.75V1.75Z" fill={fillColor}/>
  <path fillRule="evenodd" clipRule="evenodd" d="M11.75 1.5C11.6119 1.5 11.5 1.61193 11.5 1.75V5.75C11.5 5.88807 11.6119 6 11.75 6H15.75C15.8881 6 16 5.88807 16 5.75V1.75C16 1.61193 15.8881 1.5 15.75 1.5H11.75ZM10 1.75C10 0.783502 10.7835 0 11.75 0H15.75C16.7165 0 17.5 0.783502 17.5 1.75V5.75C17.5 6.7165 16.7165 7.5 15.75 7.5H11.75C10.7835 7.5 10 6.7165 10 5.75V1.75Z" fill={fillColor}/>
  <path fillRule="evenodd" clipRule="evenodd" d="M1.75 11.5C1.61193 11.5 1.5 11.6119 1.5 11.75V15.75C1.5 15.8881 1.61193 16 1.75 16H5.75C5.88807 16 6 15.8881 6 15.75V11.75C6 11.6119 5.88807 11.5 5.75 11.5H1.75ZM0 11.75C0 10.7835 0.783502 10 1.75 10H5.75C6.7165 10 7.5 10.7835 7.5 11.75V15.75C7.5 16.7165 6.7165 17.5 5.75 17.5H1.75C0.783502 17.5 0 16.7165 0 15.75V11.75Z" fill={fillColor}/>
  <path fillRule="evenodd" clipRule="evenodd" d="M11.75 11.5C11.6119 11.5 11.5 11.6119 11.5 11.75V15.75C11.5 15.8881 11.6119 16 11.75 16H15.75C15.8881 16 16 15.8881 16 15.75V11.75C16 11.6119 15.8881 11.5 15.75 11.5H11.75ZM10 11.75C10 10.7835 10.7835 10 11.75 10H15.75C16.7165 10 17.5 10.7835 17.5 11.75V15.75C17.5 16.7165 16.7165 17.5 15.75 17.5H11.75C10.7835 17.5 10 16.7165 10 15.75V11.75Z" fill={fillColor}/>
</svg>  
  )
}
