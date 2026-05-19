// components/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  rightComponent?: React.ReactNode;
  titleClass?: string;
  subtitleClass?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  className,
  rightComponent,
  titleClass = "text-[32px] text-[#C1C2C5] font-bold",
  subtitleClass = "text-xs text-[#909296] mt-3"
}) => {
  return (
    <div className={`flex flex-col md:flex-row  justify-between    w-full  ${className || ''}`}>
      {/* Left Side */}
      <div className="flex-1">
        <h1 className={titleClass}>
          {title}
        </h1>
        {subtitle && (
          <p className={subtitleClass}>
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Right Side - Optional */}
      {rightComponent && (
        <div className="flex-shrink-0   mt-2 md:mt-0">
          {rightComponent}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
