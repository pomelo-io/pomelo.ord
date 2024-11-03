# 🚧 Notice: Pomelo is No Longer Available

Pomelo has concluded its journey. Together with the web3 community, we raised over **$3 million** to fund public goods and facilitated approximately **30,000 donations** to **652 projects**. We are grateful to have served the builders who created grants and brought their visions to life. Through quadratic funding, your support made a meaningful difference, helping matching partners meet the needs of their communities.

**Next Steps: Build with [Pinax](https://pinax.network)**

Pomelo users can start building with a **FREE Pinax Pro Plan**. Pinax provides comprehensive blockchain data services for dozens of chains, including **EOS**, **WAX**, and **Telos**. We encourage you to continue your journey by leveraging Pinax's advanced tools and services at https://pinax.network.

# `Pomelo` **Ordinals**
![License](https://img.shields.io/github/license/pomelo-io/pomelo.ord)
[![Antelope CDT](https://github.com/pomelo-io/pomelo.ord/actions/workflows/release.yml/badge.svg)](https://github.com/pomelo-io/pomelo.ord/actions/workflows/release.yml)
[![Blanc++ Vert](https://github.com/pomelo-io/pomelo.ord/actions/workflows/ci.yml/badge.svg)](https://github.com/pomelo-io/pomelo.ord/actions/workflows/ci.yml)

> Send [Pomelo NFT Astronauts](https://eos.atomichub.io/market?collection_name=pomelo&order=asc&schema_name=astronauts&sort=price&state=1&symbol=EOS&template_data:text.name=Pomelo%20Astronaut) to [Bitcoin Ordinals](https://ordinals.com/).

![ordinals](https://media.discordapp.net/attachments/1082502757686190190/1083534443836362782/Pixel_Astronauts_C1V1.png?width=1859&height=1115)

## Quickstart

1. Send NFT to `ord.pomelo`

```bash
# Send NFT to contract using Bitcoin Bech32 address as memo
$ cleos push action atomicassets transfer '["myaccount", "ord.pomelo", [2199024546311], "bc1pl5f3lr7ff8xhf2ra4znrfc4eg4gg8f3t2a6hw4w5rjw87p0tn9ssxtzrsk"]' -p myaccount
```

## Bitcoin Bech32 Wallet

- [**Hiro** Wallet](https://wallet.hiro.so/)
- [`ord`](https://github.com/casey/ord) (relies on Bitcoin Core)
