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
  const storeResults = store.getAll();

  // id, name, seqNo, partyResults
  const result = storeResults.reduce(
    (obj, { partyResults }) => {
      obj.sum++;
      let winner = "";
      let winnerShare = 0;

      partyResults.forEach(({ party, share, votes }) => {
        if (!obj.hasOwnProperty(party)) obj[party] = { seats: 0, voteShare: 0 };

        obj[party].voteShare += votes;

        if (share > winnerShare) {
          winner = party;
          winnerShare = share;
        }
      });

      obj[winner].seats++;

      return obj;
    },
    {
      winner: null,
      sum: 0,
    }
  );

  for (let party in result) {
    if (result[party]?.seats >= 325) result.winner = party;
  }

  return result;
}

module.exports = { getResult, newResult, reset, scoreboard };
