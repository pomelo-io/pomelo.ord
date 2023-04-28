#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
#include <eosio/singleton.hpp>

using namespace eosio;
using namespace std;

class [[eosio::contract("ord.pomelo")]] ord : public eosio::contract {
public:
    using contract::contract;

    /**
     * ## TABLE `config`
     *
     * - `{time_point_sec} start_time` - start time (ex: "2023-03-09T00:00:00")
     * - `{int32_t} template_id` - allowed AtomicAsset template ID
     * - `{uint8_t} max_per_account` - maximum deposits per account
     *
     * ### example
     *
     * ```json
     * {
     *   "start_time": "2023-03-09T00:00:00",
     *   "template_id": 7022,
     *   "max_per_account": 2
     * }
     * ```
     */
    struct [[eosio::table("config")]] config_row {
        time_point_sec          start_time;
        int32_t                 template_id;
        uint8_t                 max_per_account;
    };
    typedef eosio::singleton< "config"_n, config_row > config_table;

    /**
     * ## TABLE `ords`
     *
     * ### params
     *
     * - `{uint64_t} asset_id` - AtomicAsset ID
     * - `{name} from` - sender account
     * - `{time_point_sec} transfer_time` - transfer time (ex: "2023-03-09T00:00:00")
     * - `{string} bech32_bitcoin_address` - Bitcoin Bech32 address
     *
     * ### example
     *
     * ```json
     * {
     *     "asset_id": 2199024546082,
     *     "from": "myaccount",
     *     "transfer_time": "2023-03-09T00:00:00",
     *     "bech32_bitcoin_address": "bc1pwahaf688kdvgxumq2al64r8kaqsllcdadkfmwqh84p88q5jyfdasdyl9uf"
     * }
     * ```
     */
    struct [[eosio::table("ords")]] ords_row {
        uint64_t            asset_id;
        name                from;
        time_point_sec      transfer_time;
        string              bech32_bitcoin_address;

        uint64_t primary_key() const { return asset_id; }
    };
    typedef eosio::multi_index< "ords"_n, ords_row> ords_table;

    [[eosio::action]]
    void init( const time_point_sec start_time, const int32_t template_id, const uint8_t max_per_account );

    [[eosio::action]]
    void validate( const string bech32_bitcoin_address );

    [[eosio::action]]
    void receipt( const name from, const uint64_t asset_id, const time_point_sec transfer_time, const string bech32_bitcoin_address ) {
        require_auth(get_self());
        require_recipient(from);
    }
    using receipt_action = eosio::action_wrapper<"receipt"_n, &ord::receipt>;

    [[eosio::action]]
    void withdraw( const uint64_t asset_id, const optional<string> memo );

    [[eosio::on_notify("*::transfer")]]
    void on_transfer( const name from, const name to, const asset quantity, const string memo );

    [[eosio::on_notify("atomicassets::transfer")]]
    void on_nft_transfer( const name from, const name to, const vector<uint64_t> asset_ids, const std::string memo );

private:
    void check_bech32_bitcoin_address( const string bech32_bitcoin_address );
    void check_max_per_account( const name account );
};