import React from 'react';
import './App.css';

const ComposerDetails = ({ composer, dailyComposer }) => {
  const normalizeArray = (array) => {
    if (Array.isArray(array)) {
      return array.map(v => v.toLowerCase().trim()).sort();
    }
    return array;
  };

  return (
    <div key={composer.id} className="p-4 mb-4">
      <div className="flex justify-between gap-1">
        {Object.entries(composer).map(([key, value], index) => {
          if (key === 'created_at' || key === 'updated_at' || key === 'id') return null;

          let normalizedComposerValue = normalizeArray(value);
          let normalizedDailyComposerValue = normalizeArray(dailyComposer[key]);

          let modifiedValue = value;
          if (key === 'birth_year') {
            if (dailyComposer[key] > composer[key]) {
              modifiedValue += " ⬆️";
            }
            if (dailyComposer[key] < composer[key]) {
              modifiedValue += " ⬇️";
            }
          }
          if (key === 'death_year') {
            if (dailyComposer[key] > composer[key]) {
              modifiedValue += " ⬆️";
            }
            if (dailyComposer[key] < composer[key]) {
              modifiedValue += " ⬇️";
            }
          }

          let boxClass = 'bg-red-500/78';

          const isMatch = JSON.stringify(normalizedDailyComposerValue) === JSON.stringify(normalizedComposerValue);

          const arrayMatch = Array.isArray(normalizedComposerValue) &&
                             normalizedComposerValue.some(v => normalizedDailyComposerValue.includes(v));

          if (isMatch) {
            boxClass = 'bg-green-500/78';
          } else if (arrayMatch) {
            boxClass = 'bg-yellow-500/78';
          }

          return (
            <div key={index}>
              <div
                className={`${boxClass} hover:opacity-80 flip-animation cursor-default text-center text-xs duration-300 sm:text-xxs md:text-md lg:text-sm xl:text-md flex items-center justify-center font-medium p-2 border-3 rounded-md h-16 w-22 sm:h-17 sm:w-25 md:w-25 md:h-20 lg:w-26 lg:h-15 xl:w-25 xl:h-15 `}
                style={{
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                {Array.isArray(modifiedValue) ? modifiedValue.join(', ') : modifiedValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComposerDetails;
