import { TimePointSec, Name } from "@greymass/eosio";
import { Blockchain } from "@proton/vert"
import { it, describe, beforeEach } from "node:test";
import assert from 'node:assert';

// Vert EOS VM
const blockchain = new Blockchain()

// contracts
const contract = blockchain.createContract('ord.pomelo', 'ord.pomelo', true);
const atomic = blockchain.createContract('atomicassets', './include/atomicassets/atomicassets', true);

blockchain.createAccounts('pomelo', 'myaccount`');

// one-time setup
beforeEach(async () => {
  blockchain.setTime(TimePointSec.from("2023-03-10T00:00:00.000"));
});

function getRow(asset_id) {
  const scope = Name.from('ord.pomelo').value.value;
  return contract.tables.ords(scope).getTableRow(BigInt(asset_id));
}

function getConfig() {
  const scope = Name.from('ord.pomelo').value.value;
  return contract.tables.config(scope).getTableRows()[0];
}

describe('ord.pomelo', () => {
  it("atomicassets", async () => {
    await atomic.actions.init([]).send();
    await atomic.actions.createcol(["pomelo", "pomelo", true, ["pomelo"], [], 0, []]).send("pomelo");
    await atomic.actions.createschema(["pomelo", "pomelo", "astronauts", [{"name": "name", "type": "string"}]]).send("pomelo");
    await atomic.actions.createtempl(["pomelo", "pomelo", "astronauts", true, true, 0, [{"key": "name", "value": ["string", "astronaut"]}]]).send("pomelo");
    await atomic.actions.mintasset(["pomelo", "pomelo", "astronauts", 1, "myaccount", [], [], []]).send("pomelo");
    await atomic.actions.mintasset(["pomelo", "pomelo", "astronauts", 1, "myaccount", [], [], []]).send("pomelo");
    await atomic.actions.mintasset(["pomelo", "pomelo", "astronauts", 1, "myaccount", [], [], []]).send("pomelo");
    await atomic.actions.mintasset(["pomelo", "pomelo", "astronauts", 1, "myaccount", [], [], []]).send("pomelo");

    assert.ok(true)
  });

  it("error: not started", async () => {
    await contract.actions.init(["2033-03-09T00:00:00.000", 1, 2]).send();
    const action = atomic.actions.transfer(["myaccount", "ord.pomelo", [1099511627776], "bc1pc0q062egd5jaty9nuzjr3g0aj9muenytkua0v26ylzew6r9ul03qrhhasp"]).send("myaccount");
    await expectToThrow(action, /Pomelo Ordinals deposits has not started./);
  });

  it("init", async () => {
    await contract.actions.init(["2023-03-09T00:00:00.000", 1, 2]).send();
    const config = getConfig();
    assert.deepEqual(config, {
      start_time: '2023-03-09T00:00:00',
      template_id: 1,
      max_per_account: 2
    })
  });

  it("transfer", async () => {
    await atomic.actions.transfer(["myaccount", "ord.pomelo", [1099511627776, 1099511627777], "bc1pc0q062egd5jaty9nuzjr3g0aj9muenytkua0v26ylzew6r9ul03qrhhasp"]).send("myaccount");
    assert.deepEqual(getRow(1099511627776), {
      asset_id: '1099511627776',
      from: 'myaccount',
      transfer_time: '2023-03-10T00:00:00',
      bech32_bitcoin_address: 'bc1pc0q062egd5jaty9nuzjr3g0aj9muenytkua0v26ylzew6r9ul03qrhhasp'
    })
    assert.deepEqual(getRow(1099511627777), {
      asset_id: '1099511627777',
      from: 'myaccount',
      transfer_time: '2023-03-10T00:00:00',
      bech32_bitcoin_address: 'bc1pc0q062egd5jaty9nuzjr3g0aj9muenytkua0v26ylzew6r9ul03qrhhasp'
    })
  });

  it("error: Invalid Bitcoin Bech32 Ordinals address length", async () => {
    const action = contract.actions.validate(["bc1qpcqmwnpw68mpv4qf5mdzcc9hd2jmh99vt6emq7"]).send();
    await expectToThrow(action, /Invalid Bitcoin Bech32 Ordinals address length./);
  });

  it("error: Invalid Bitcoin Bech32 Ordinals address prefix", async () => {
    const action = contract.actions.validate(["fo1pwahaf688kdvgxumq2al64r8kaqsllcdadkfmwqh84p88q5jyfdasdyl9uf"]).send();
    await expectToThrow(action, /Invalid Bitcoin Bech32 Ordinals address prefix./);
  });

  it("error: Invalid Bitcoin Bech32 Ordinals address version.", async () => {
    const action = contract.actions.validate(["bc4pwahaf688kdvgxumq2al64r8kaqsllcdadkfmwqh84p88q5jyfdasdyl9uf"]).send();
    await expectToThrow(action, /Invalid Bitcoin Bech32 Ordinals address version./);
  });
});

/**
 * Expect a promise to throw an error with a specific message.
 * @param promise - The promise to await.
 * @param {string} errorMsg - The error message that we expect to see.
 */
const expectToThrow = async (promise, errorMsg) => {
  try {
    await promise
    assert.fail('Expected promise to throw an error');
  } catch (e) {
    if ( errorMsg ) assert.match(e.message, errorMsg);
    else assert.fail('Expected promise to throw an error');
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}