import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Results from "./Results";
import Form from "./Form";
import { calculateAgeFromDateOfBirth } from "../utils/date";
import initPlayers from "../actionCreator/initPlayers";

const Finder = ({ players, dispatch }) => {
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [playersPositions, setPlayersPositions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetch(
      "https://football-players-b31f2.firebaseio.com/players.json?print=pretty"
    )
      .then(data => data.json())
      .then(data => {
        const mappedPlayers = data.map(player => ({
          ...player,
          age: calculateAgeFromDateOfBirth(player.dateOfBirth)
        }));
        initPlayers(mappedPlayers);
        setFilteredPlayers(mappedPlayers);
        setIsFetching(false);
        setPlayersPositions([...new Set(data.map(player => player.position))]);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const filterPlayers = ({ playerName, playerPosition, playerAge }) => {
    setFilteredPlayers(
      players.filter(player => {
        return (
          (!playerName ||
            player.name.toLowerCase().indexOf(playerName.toLowerCase()) > -1) &&
          (!playerPosition ||
            player.position
              .toLowerCase()
              .indexOf(playerPosition.toLowerCase()) > -1) &&
          (!playerAge || Number(playerAge) === player.age)
        );
      })
    );
  };

  return (
    <div className="finder">
      <div className="filter-bar">
        <Form onSubmit={filterPlayers} playersPositions={playersPositions} />
      </div>
      {!isFetching ? <Results players={filteredPlayers} /> : "Loading..."}
    </div>
  );
};

const mapStateToProps = ({ players }) => ({
  players
});

export default connect(mapStateToProps)(Finder);
