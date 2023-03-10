# `Pomelo` **Ordinals**
![License](https://img.shields.io/github/license/pomelo-io/pomelo.ord)
[![Antelope CDT](https://github.com/pomelo-io/pomelo.ord/actions/workflows/release.yml/badge.svg)](https://github.com/pomelo-io/pomelo.ord/actions/workflows/release.yml)
[![Blanc++ Vert](https://github.com/pomelo-io/pomelo.ord/actions/workflows/ci.yml/badge.svg)](https://github.com/pomelo-io/pomelo.ord/actions/workflows/ci.yml)

> Send [Pomelo NFT Astronauts](https://eos.atomichub.io/market?collection_name=pomelo&order=asc&schema_name=astronauts&sort=price&state=1&symbol=EOS&template_data:text.name=Pomelo%20Astronaut) to [Bitcoin Ordinals](https://ordinals.com/).

![ordinals](https://media.discordapp.net/attachments/1082502757686190190/1083060178385129572/800-min.png)

## Quickstart

1. Send NFT to `ord.pomelo`

```bash
# Send NFT to contract using Bitcoin Bech32 address as memo
$ cleos push action atomicassets transfer '["myaccount", "ord.pomelo", [2199024546311], "bc1pl5f3lr7ff8xhf2ra4znrfc4eg4gg8f3t2a6hw4w5rjw87p0tn9ssxtzrsk"]' -p myaccount
```
