const { default: resultStore } = require("./resultsService");

const store = resultStore();

function getResult(id) {
  return store.getResult(id);
}

function newResult(result) {
  store.newResult(result);
  return {};
}

function reset() {
  store.reset();
}

function scoreboard() {
  try {
    const storeResults = store.getAll();

    return storeResults.reduce(
      (resultObj, { partyResults }) => {
        resultObj.sum++;
        let winningParty = "";
        let winnerShare = 0;

        partyResults.forEach(({ party, share, votes }) => {
          if (!resultObj.seats.hasOwnProperty(party)) {
            resultObj.seats[party] = 0;
            resultObj.voteShare[party] = 0;
          }

          resultObj.voteShare[party] += votes;

          if (share > winnerShare) {
            winningParty = party;
            winnerShare = share;
          }
        });

        resultObj.seats[winningParty]++;

        if (resultObj.seats[winningParty] >= 325)
          resultObj.winner = winningParty;

        return resultObj;
      },
      {
        sum: 0,
        winner: null,
        seats: {},
        voteShare: {},
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getResult, newResult, reset, scoreboard };
