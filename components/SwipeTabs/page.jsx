"use client";
import { useState, useRef } from "react";

export default function SwipeTabs({ tabs, defaultTabs }) {
  const [currentTab, setCurrentTab] = useState(defaultTabs);
  const startX = useRef(0);
  const isMouseDown = useRef(false);
  const threshold = 50 * (tabs.length - 1);

  const handleTouchStart = (event) => {
    startX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const change = startX.current - touch.clientX;

    if (change > threshold) {
      nextTab();
      startX.current = touch.clientX;
    } else if (change < -threshold) {
      previousTab();
      startX.current = touch.clientX;
    }
  };

  const handleMouseDown = (event) => {
    isMouseDown.current = true;
    startX.current = event.clientX;
  };

  const handleMouseMove = (event) => {
    if (!isMouseDown.current) return;

    const change = startX.current - event.clientX;

    if (change > threshold) {
      nextTab();
      startX.current = event.clientX;
    } else if (change < -threshold) {
      previousTab();
      startX.current = event.clientX;
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const previousTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  return (
    <main>
      <div
        className="flex flex-col w-full h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Tab headers */}
        <div className="flex justify-center">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-2 px-4 w-1/${tabs.length} ${
                currentTab === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleTabClick(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className={`flex transform transition-transform duration-300`}
          style={{ transform: `translateX(-${currentTab * 100}%)` }}
        >
          {tabs.map((tab, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full p-8 pb-0 min-h-screen bg-white border border-gray-200 rounded-lg shadow"
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
