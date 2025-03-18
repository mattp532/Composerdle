import React, { useState, useEffect, useRef } from "react";
import ComposerDetails from "./ComposerDetails";
import { useReward } from "react-rewards";
import Logo from "./assets/Logo.png";

function App() {
  const { reward: confettiReward, isAnimating: isconfettiAnimating } =
    useReward("confettiReward", "confetti");
  const [dailyComposer, setDailyComposer] = useState({});
  const [composers, setComposers] = useState(null);
  const [searchedComposers, setSearchedComposers] = useState([]);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredComposers, setFilteredComposers] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [isWinScreenOpen, setIsWinScreenOpen] = useState(false);
  const [tries, setTries] = useState(0);
  const [portraitUrl, setPortraitUrl] = useState(null);
  const [nextComposerCountdown, setNextComposerCountdown] = useState("");

  const winScreenRef = useRef(null);
  const handleWin = () => {
    setIsSearchOpen(false);
    setTimeout(() => {
      confettiReward();
    }, 3000);
    setTimeout(() => {
      setIsWinScreenOpen(true);
    }, 5000);
  };

  useEffect(() => {
    if (dailyComposer.name) {
      const nameParts = dailyComposer.name.split(" ");
      const lastName = nameParts[nameParts.length - 1];

      fetch(`https://api.openopus.org/composer/list/search/${lastName}.json`)
        .then((response) => response.json())
        .then((data) => {
          if (data.composers && data.composers.length > 0) {
            const portraitUrl = data.composers[0].portrait;
            setPortraitUrl(portraitUrl);
          }
        })
        .catch((error) => {
          setError("Error fetching data: " + error.message);
        });
    }
  }, [dailyComposer.name]);

  useEffect(() => {
    if (isWinScreenOpen && winScreenRef.current) {
      winScreenRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isWinScreenOpen]);

  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    const timeRemaining = nextMidnight - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNextComposerCountdown(calculateTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/composers/daily")
      .then((response) => response.json())
      .then((data) => {
        setDailyComposer(data);
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/composers")
      .then((response) => response.json())
      .then((data) => {
        setComposers(data);
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
      });
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery === "") {
      setFilteredComposers([]);
      setIsDropdownOpen(false);
    } else {
      const filtered = composers.filter(
        (c) =>
          c.name
            .toLowerCase()
            .split(" ")
            .some((word) => word.startsWith(searchQuery.toLowerCase())) &&
          !searchedComposers.some((composer) => composer.id === c.id)
      );
      setFilteredComposers(filtered);
      setIsDropdownOpen(filtered.length >= 0);
    }
  };

  const handleSearchClick = (name) => {
    setQuery("");
    setIsDropdownOpen(false);

    const selectedComposer = composers.find(
      (composer) => composer.name === name
    );

    if (selectedComposer.name === dailyComposer.name) {
      handleWin();
      setTries(tries + 1);
    }
    if (
      !searchedComposers.some((composer) => composer.id === selectedComposer.id)
    ) {
      setSearchedComposers((prevComposers) => [
        ...prevComposers,
        selectedComposer,
      ]);
      setTries(tries + 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mt-2 flex flex-col justify-center items-center w-full px-4">
        <div className="flex flex-row justify-center items-center">
          <div className="cursor-default mr-2 font-bold text-4xl xl:text-5xl hover:scale-103 transition-all duration-350 ease-in-out text-center">
            Composerdle
          </div>
          <img
            className="w-16 xl:w-23 hover:scale-105 duration-350"
            src={Logo}
            alt=""
          />
        </div>

        <div className="w-full text-center relative mb-2">
          {isSearchOpen && (
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
                <div className="p-2 hover:bg-gray-200 cursor-pointer">
                  No composers found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-2xl xl:max-w-2xl overflow-x-auto">
        {searchedComposers.length > 0 && (
          <div className="flex ml-7 space-x-6 sm:space-x-10 lg:space-x-3 lg:ml-3 xl:space-x-1 xl:ml-2 ">
            {Object.keys(dailyComposer).map((key, index) => {
              if (key === "created_at" || key === "updated_at" || key === "id")
                return null;

              return (
                <div
                  key={index}
                  className="border-b-2 border-white cursor-default text-center text-sm duration-300 sm:text-xxs md:text-md lg:text-sm xl:text-md flex items-center justify-center font-medium p-2 box-border w-24 h-12 sm:w-24 md:w-24 lg:w-30 xl:w-30"
                >
                  {key}
                </div>
              );
            })}
          </div>
        )}

        <div>
          {searchedComposers.length > 0 && (
            <div className="flex flex-col">
              <div className="flex flex-wrap justify-start flex-col-reverse">
                {searchedComposers.map((searchedComposer) => (
                  <ComposerDetails
                    key={searchedComposer.id}
                    composer={searchedComposer}
                    dailyComposer={dailyComposer}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <span id="confettiReward" style={{ width: 1, height: 1 }} />
      {isWinScreenOpen && (
        <div
          ref={winScreenRef}
          className="card border flex items-center bg-red-50 flex-col w-100 pb-20 mt-5 hover:opacity-93"
        >
          <h1 className="font-bold text-3xl xl:text-4xl mb-2 mt-7">Bravo!</h1>
          <div className="font-bold">You guessed</div>
          <div className="font-bold text-2xl">{dailyComposer.name}</div>
          <img
            src={portraitUrl}
            alt=""
            className="mt-4 mb-4 w-35 border-4 border-solid rounded-md"
          />
          <div>You are the xnd to guess the composer today</div>
          <div>
            You guessed in <span className="font-bold text-blue-500">{tries}</span>{" "}
            {tries === 1 ? "try" : "tries"}
          </div>
          <div className="font-bold text-lg mt-3">Next composer in</div>
          <div className="font-bold text-3xl mt-1">{nextComposerCountdown}</div>
        </div>
      )}
      <div className="py-10"></div>
    </div>
  );
}

export default App;
