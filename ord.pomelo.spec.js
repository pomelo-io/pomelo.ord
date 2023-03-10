import { TimePointSec } from "@greymass/eosio";
import { Blockchain } from "@proton/vert"
import { it, describe, beforeEach } from "node:test";
import assert from 'node:assert';

// Vert EOS VM
const blockchain = new Blockchain()

// contracts
const contract = blockchain.createContract('ord.pomelo', 'ord.pomelo', true);

// one-time setup
beforeEach(async () => {
  blockchain.setTime(TimePointSec.from(new Date()));
});

describe('ord.pomelo', () => {
  it("init", async () => {
    await contract.actions.init(["2023-03-09T00:00:00.000", 7022]).send();
    assert.ok(true)
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