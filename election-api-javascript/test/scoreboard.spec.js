const fs = require("fs");
const request = require("supertest");
const { default: expressServer, resetScores } = require("../src/server");

const resultsSamplesPath = "./test/resources/sample-election-results";

function loadAndPostResultFile(server, num) {
  const fileNumber = new String(parseInt(num, 10)).padStart(3, "0");
  const result = fs.readFileSync(
    `${resultsSamplesPath}/result${fileNumber}.json`
  );
  return server.post("/result").send(JSON.parse(result));
}

async function loadResults(server, quantity) {
  const results = [];
  for (let count = 0; count < quantity; count += 1) {
    results.push(await loadAndPostResultFile(server, count + 1));
  }
  return results;
}

function fetchScoreboard(server) {
  return server.get("/scoreboard");
}

describe("Scoreboard Tests", () => {
  const server = request(expressServer);

  beforeEach(() => {
    resetScores();
  });

  test("first 5", async () => {
    await loadResults(server, 5);
    const scoreboard = await fetchScoreboard(server);
    expect(scoreboard).not.toBeNull();
    const response = scoreboard.body;
    expect(response.winner).toBe(null);
    expect(response.LD.seats).toBe(1);
    expect(response.LAB.seats).toBe(4);
  });

  test("first 100", async () => {
    await loadResults(server, 100);
    const scoreboard = await fetchScoreboard(server);
    expect(scoreboard).not.toBeNull();
    const response = scoreboard.body;

    // assert winner = noone
    expect(response.winner).toBe(null);
    // assert LD == 12
    expect(response.LD.seats).toBe(12);
    // assert LAB == 56
    expect(response.LAB.seats).toBe(56);
    // assert CON == 31
    expect(response.CON.seats).toBe(31);
    // assert SGP == 0
    expect(response.SGP.seats).toBe(0);
    // Bonus Task (total votes):
    // assert SGP == 1071
    expect(response.SGP.voteShare).toBe(1071);
  });

  test("first 554", async () => {
    await loadResults(server, 554);
    const scoreboard = await fetchScoreboard(server);
    expect(scoreboard).not.toBeNull();
    const response = scoreboard.body;
    // assert LD == 52
    expect(response.LD.seats).toBe(52);
    // assert LAB = 325
    expect(response.LAB.seats).toBe(325);
    // assert CON = 167
    expect(response.CON.seats).toBe(167);
    // assert IKHH = 1
    expect(response.IKHH.seats).toBe(1);
    // assert winner = LAB
    expect(response.winner).toBe("LAB");
    // Bonus Task (total votes):
    // assert IKHH == 18739
    expect(response.IKHH.voteShare).toBe(18739);
  });

  test("test all results", async () => {
    await loadResults(server, 650);
    const scoreboard = await fetchScoreboard(server);
    expect(scoreboard).not.toBeNull();
    const response = scoreboard.body;
    // assert LD == 62
    expect(response.LD.seats).toBe(62);
    // assert LAB == 349
    expect(response.LAB.seats).toBe(349);
    // assert CON == 210
    expect(response.CON.seats).toBe(210);
    // assert SDLP == 3
    expect(response.SDLP.seats).toBe(3);
    // assert winner = LAB
    expect(response.winner).toBe("LAB");
    // assert sum = 650
    expect(response.sum).toBe(650);
    // Bonus Task (total votes):
    // assert SDLP == 125626
    expect(response.SDLP.voteShare).toBe(125626);
  });
});
