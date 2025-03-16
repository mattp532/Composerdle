import React from 'react';

const ComposerDetails = ({ composer, dailyComposer }) => {
  return (
    <div key={composer.id} className="p-4 mb-4">
      <div className="flex justify-between gap-1">
        {Object.entries(composer).map(([key, value], index) => {
          if (key === 'created_at' || key === 'updated_at' || key === 'id') return null;

          let normalizedComposerValue = value;
          if (Array.isArray(value)) {
            normalizedComposerValue = value.join(', ').toLowerCase().trim();
          } else if (typeof value === 'string') {
            normalizedComposerValue = value.trim().toLowerCase();
          }

          let normalizedDailyComposerValue = dailyComposer[key];
          if (Array.isArray(dailyComposer[key])) {
            normalizedDailyComposerValue = dailyComposer[key].join(', ').toLowerCase().trim();
          } else if (typeof dailyComposer[key] === 'string') {
            normalizedDailyComposerValue = dailyComposer[key].trim().toLowerCase();
          }

          // Compare birth_year to apply UP or DOWN
          let modifiedValue = value;
          if (key === 'birth_year') {
            if (dailyComposer[key] > composer[key]) {
              modifiedValue += " ⬆️";  // Show if dailyComposer's birth year is larger
            }
            if (dailyComposer[key] < composer[key]) {
              modifiedValue += " ⬇️";  // Show if dailyComposer's birth year is smaller
            }
          }
          if (key === 'death_year') {
            if (dailyComposer[key] > composer[key]) {
              modifiedValue += " ⬆️";  // Show if dailyComposer's birth year is larger
            }
            if (dailyComposer[key] < composer[key]) {
              modifiedValue += " ⬇️";  // Show if dailyComposer's birth year is smaller
            }
          }

          // Conditionally check if the attribute matches dailyComposer (after normalization)
          const isMatch = normalizedDailyComposerValue === normalizedComposerValue;
          const boxClass = isMatch ? 'bg-green-500/78' : 'bg-red-500/78';

          // Log values for debugging purposes

          return (
            <div
              key={index}
              className={`${boxClass} cursor-default text-center text-sm duration-300 sm:text-xxs md:text-lg lg:text-sm xl:text-md flex items-center justify-center font-medium p-2 border-3 rounded-md w-24 h-16 sm:w-20 sm:h-20 md:w-16 md:h-16 lg:w-26 lg:h-26 xl:w-25 xl:h-15 hover:opacity-80`}
              >
              {Array.isArray(modifiedValue) ? modifiedValue.join(', ') : modifiedValue}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComposerDetails;
