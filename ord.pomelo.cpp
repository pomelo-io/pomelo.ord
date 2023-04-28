#include <gems/atomic.gems.hpp>

#include "ord.pomelo.hpp"

[[eosio::action]]
void ord::init( const time_point_sec start_time, const int32_t template_id, const uint8_t max_per_account )
{
    require_auth( get_self() );

    config_table _config( get_self(), get_self().value );
    auto config = _config.get_or_default();
    config.start_time = start_time;
    config.template_id = template_id;
    config.max_per_account = max_per_account;
    _config.set( config, get_self() );
}

[[eosio::action]]
void ord::validate( const string bech32_bitcoin_address )
{
    check_bech32_bitcoin_address(bech32_bitcoin_address);
}

[[eosio::action]]
void ord::withdraw( const uint64_t asset_id, const optional<string> memo )
{
    require_auth( get_self() );

    ord::ords_table _ords( get_self(), get_self().value );
    auto & ord = _ords.get( asset_id, "Asset ID not found" );
    check( ord.from == "unpack.gems"_n, "Cannot withdraw NFT asset unless unpack.gems");
    atomic::transfer_nft( get_self(), ord.from, {asset_id}, memo.value_or("") );
    _ords.erase( ord );
}

[[eosio::on_notify("*::transfer")]]
void ord::on_transfer( const name from, const name to, const asset quantity, const string memo )
{
    check(false, "This contract does not accept EOS token transfer.");
}

[[eosio::on_notify("atomicassets::transfer")]]
void ord::on_nft_transfer( const name from, const name to, const vector<uint64_t> asset_ids, const std::string memo )
{
    ords_table _ords( get_self(), get_self().value );
    config_table _config( get_self(), get_self().value );
    receipt_action receipt( get_self(), { get_self(), "active"_n });

    check(_config.exists(), "Pomelo Ordinals is not initialized.");
    auto config = _config.get();

    // Ordinals closed
    check(from == "unpack.gems"_n, "Pomelo Ordinals deposits has ended.");

    // validation
    check( config.start_time < current_time_point(), "Pomelo Ordinals deposits has not started." );
    check_bech32_bitcoin_address( memo );

    for ( auto asset_id : asset_ids ) {
        auto asset = atomic::get_asset( get_self(), asset_id );
        check( asset.template_id == config.template_id, "Invalid NFT asset template ID" );
        _ords.emplace( get_self(), [&]( auto & row ) {
            row.asset_id = asset_id;
            row.from = from;
            row.transfer_time = current_time_point();
            row.bech32_bitcoin_address = memo;
            receipt.send( from, asset_id, row.transfer_time, memo );
        });
    }
    check_max_per_account( from );
}

void ord::check_bech32_bitcoin_address( const string bech32_bitcoin_address )
{
    if ( bech32_bitcoin_address.substr(0, 2) != "bc" ) {
        check(false, "Invalid Bitcoin Bech32 Ordinals address prefix.");
    }
    if ( bech32_bitcoin_address.substr(2, 1) != "1" ) {
        check(false, "Invalid Bitcoin Bech32 Ordinals address version.");
    }
    if ( bech32_bitcoin_address.length() != 62 ) {
        check(false, "Invalid Bitcoin Bech32 Ordinals address length.");
    }
}

void ord::check_max_per_account( const name account )
{
    // exceptions
    if ( account == "unpack.gems"_n ) return;

    ords_table _ords( get_self(), get_self().value );
    config_table _config( get_self(), get_self().value );
    auto config = _config.get_or_default();

    uint8_t count = 0;
    for ( auto row : _ords ) {
        if ( row.from == account ) {
            count++;
        }
    }
    check( count <= config.max_per_account, "Maximum number of NFT assets per account has been reached." );
}
