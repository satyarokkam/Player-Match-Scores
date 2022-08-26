const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(
        "server started and Listening at port http://localhost:3000/"
      );
    });
  } catch (error) {
    console.log(`error:${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

//get api

app.get("/players/", async (request, response) => {
  const getAllPlayers = `select * from player_details`;
  const getAllPlayersList = await db.all(getAllPlayers);
  response.send(getAllPlayersList.map((each) => convertDbObject(each)));
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayer = `select * from player_details where player_id=${playerId}`;

  const getPlayerResponse = await db.get(getPlayer);
  response.send(convertDbObject(getPlayerResponse));
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName } = request.body;

  console.log(playerName);

  const { playerId } = request.params;

  console.log(playerId);

  const updatePlayerName = `update player_details

    set player_name='${playerName}'

    where player_id=${playerId}
    `;

  console.log(updatePlayerName);

  const updateResponse = await db.run(updatePlayerName);

  response.send("Player Details Updated");
});
