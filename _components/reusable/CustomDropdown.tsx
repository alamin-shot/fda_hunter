// components/CustomDropdown.tsx - FIXED VERSION
"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  portalTarget?: HTMLElement | null; // Optional portal target
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  portalTarget,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    position: "absolute" as "absolute" | "fixed",
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    // Check if we should use fixed positioning (for sidebar/modals)
    const shouldUseFixed =
      portalTarget ||
      containerRef.current?.closest("[data-portal-container]") ||
      triggerRef.current.closest("[data-portal-container]");

    if (shouldUseFixed) {
      // Fixed positioning relative to viewport
      setDropdownPosition({
        top: triggerRect.bottom,
        left: triggerRect.left,
        width: triggerRect.width,
        position: "fixed",
      });
    } else {
      // Absolute positioning relative to container
      setDropdownPosition({
        top: triggerRect.bottom - (containerRect?.top || 0),
        left: triggerRect.left - (containerRect?.left || 0),
        width: triggerRect.width,
        position: "absolute",
      });
    }
  };

  // Toggle dropdown and update position
  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      // Use requestAnimationFrame to ensure DOM updates
      requestAnimationFrame(() => {
        updateDropdownPosition();
      });
    }
  };

  // Close dropdown when clicking outside - IMPROVED VERSION
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is inside dropdown or trigger
      const isInsideDropdown = dropdownRef.current?.contains(target);
      const isInsideTrigger = triggerRef.current?.contains(target);

      if (!isInsideDropdown && !isInsideTrigger && isOpen) {
        setIsOpen(false);
      }
    };

    // Use capture phase
    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen]);

  // Close on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen]);

  // Update position on window resize/scroll and when dropdown opens
  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const handleResize = () => updateDropdownPosition();
    const handleScroll = () => updateDropdownPosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Focus first option when dropdown opens
      const firstButton = dropdownRef.current.querySelector(
        "button",
      ) as HTMLButtonElement;
      firstButton?.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);

  // Create dropdown content
  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className={`z-50 bg-[#0e121b] border border-white/10 
                 rounded-lg shadow-lg backdrop-blur-sm overflow-hidden
                 ${dropdownPosition.position === "fixed" ? "fixed" : "absolute"}`}
      style={{
        top:
          dropdownPosition.position === "fixed"
            ? `${dropdownPosition.top}px`
            : `${dropdownPosition.top}px`,
        left:
          dropdownPosition.position === "fixed"
            ? `${dropdownPosition.left}px`
            : `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: "300px",
        overflowY: "auto",
      }}
      role="listbox"
      aria-labelledby="dropdown-label"
    >
      <div className="py-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`w-full px-4 py-3 text-left transition-colors duration-150
                      hover:bg-white/10 active:bg-white/15 focus:bg-white/10 focus:outline-none
                      ${
                        option.value === value
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/90"
                      }`}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onChange(option.value);
                setIsOpen(false);
                triggerRef.current?.focus();
              }
            }}
            role="option"
            aria-selected={option.value === value}
            tabIndex={0}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      data-dropdown-container
    >
      {/* Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className="w-full px-4 py-3.5 text-left border border-[#687588] rounded-lg 
                 bg-transparent backdrop-blur-sm hover:bg-white/10 
                 focus:outline-none focus:border-none focus:ring-1 focus:ring-[#00f474] 
                 transition-all duration-200"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        id="dropdown-label"
      >
        <div className="flex justify-between items-center">
          <span
            className={`${selectedOption ? "text-white text-sm" : "text-white text-sm"}  `}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Render dropdown content */}
      {dropdownContent}
    </div>
  );
}
