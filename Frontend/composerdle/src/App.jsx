import React, { useState, useEffect } from 'react';
import ComposerDetails from './ComposerDetails';
import { useReward } from 'react-rewards';




function App() {
  const { reward: confettiReward, isAnimating: isconfettiAnimating } = useReward('confettiReward', 'confetti');
  const [dailyComposer, setDailyComposer] = useState({});
  const [composers, setComposers] = useState(null);
  const [searchedComposers, setSearchedComposers] = useState([]);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredComposers, setFilteredComposers] = useState([]);
  const [isSearchOpen, setIsSearchOpen]=useState(true);


  const handleWin=()=>{
    setIsSearchOpen(false);
    confettiReward();


  }

  useEffect(() => {
    fetch('http://localhost:5000/composers/daily')
      .then((response) => response.json())
      .then((data) => {
        setDailyComposer(data);
      })
      .catch((error) => {
        setError('Error fetching data: ' + error.message);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/composers')
      .then((response) => response.json())
      .then((data) => {
        setComposers(data);
      })
      .catch((error) => {
        setError('Error fetching data: ' + error.message);
      });
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery === '') {
      setFilteredComposers([]);
      setIsDropdownOpen(false);
    } else {
      const filtered = composers.filter((c) =>
        c.name
          .toLowerCase()
          .split(' ')
          .some((word) => word.startsWith(searchQuery.toLowerCase()))
      );
      setFilteredComposers(filtered);
      setIsDropdownOpen(filtered.length >= 0);
    }
  };

  const handleSearchClick = (name) => {
    setQuery('');
    setIsDropdownOpen(false);

    const selectedComposer = composers.find((composer) => composer.name === name);

    if(selectedComposer.name==dailyComposer.name){
      handleWin();
    }
    if(!(selectedComposer in searchedComposers)){
      if (selectedComposer && !searchedComposers.some((composer) => composer.id === selectedComposer.id)) {
        setSearchedComposers((prevComposers) => [...prevComposers, selectedComposer]);
      }
    }

  };

  return (
    <div className="flex flex-col items-center w-6/6">

      <div className="mt-5 flex flex-col justify-center items-center w-full w-3/3 px-4">
        <h1 className="font-bold text-4xl hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer mb-4 text-center">
          Composerdle
        </h1>
        
        {/* Search Input */}
        <div className="w-full text-center relative mb-4">
          {isSearchOpen &&
          (
            <input
            className="input w-1/2 mt-4 p-2 border border-gray-300 rounded-md"
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search composers"
          />
          )}

          {isDropdownOpen && (
            <div className="absolute w-1/2 flex flex-col left-25/100 mt-1 max-h-48 overflow-auto bg-white shadow-lg border border-gray-300 rounded-md z-10">
              {filteredComposers.length > 0 ? (
                filteredComposers.map((composer) => (
                  <div
                    key={composer.id}
                    onClick={() => handleSearchClick(composer.name)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {composer.name}
                  </div>
                ))
              ) : (
                <div className="p-2 hover:bg-gray-200 cursor-pointer">No composers found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer List */}
      <div className="w-80/100 max-w-2xl overflow-x-auto ">
      {searchedComposers.length>0 &&(
      <div className="flex justify-start items-center ml-2">
      {Object.keys(dailyComposer).map((key, index) => {
          // Skip unwanted keys like created_at, updated_at, id, etc.
          if (key === 'created_at' || key === 'updated_at' || key === 'id') return null;
          
          return (
            <div
              key={index}
              className="cursor-default text-center text-sm sm:text-xxs md:text-lg lg:text-sm xl:text-md flex items-center justify-center font-medium p-4 h-7 sm:w-17 sm:h-10 md:w-16 md:h-8 lg:w-26 lg:h-8 xl:w-27 xl:h-10"
              >
              {key}
              
            </div>
            
          );
        })}
        </div>)
      }

        {searchedComposers.length > 0 && (
          <div className="flex flex-wrap justify-start flex-col-reverse ">
            {searchedComposers.map((searchedComposer) => (
              <ComposerDetails key={searchedComposer.id} composer={searchedComposer} dailyComposer={dailyComposer}/>
            ))}
          </div>
        )}
      

      </div>


      <span id="confettiReward" style={{ width: 1, height: 1 }} /> {/* This element is where the animation starts */}

    </div>
  );
}

export default App;
