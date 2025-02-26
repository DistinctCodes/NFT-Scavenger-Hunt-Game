use starknet::ContractAddress;
use onchain::interface::{Levels};

#[starknet::interface]
pub trait IScavengerHuntNFT<TContractState> {
    fn mint_level_badge(ref self: TContractState, recipient: ContractAddress, level: Levels,);

    fn get_token_id_for_level(self: @TContractState, level: Levels) -> u256;

    fn has_level_badge(self: @TContractState, owner: ContractAddress, level: Levels) -> bool;
}

#[starknet::contract]
mod ScavengerHuntNFT {
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc1155::{ERC1155Component, ERC1155HooksEmptyImpl};
    use starknet::ContractAddress;
    use super::{Levels};
    use starknet::storage::Map;

    component!(path: ERC1155Component, storage: erc1155, event: ERC1155Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc1155: ERC1155Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        level_to_token_id: Map<felt252, u256> // Maps Levels (as felt) to token IDs
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC1155Event: ERC1155Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, token_uri: ByteArray) {
        // Initialize ERC-1155 with metadata URI
        self.erc1155.initializer(token_uri);

        // Store levels as `felt252` keys and token IDs as `u256` values
        self.level_to_token_id.write(Levels::Easy.into(), u256 { low: 1, high: 0 });
        self.level_to_token_id.write(Levels::Medium.into(), u256 { low: 2, high: 0 });
        self.level_to_token_id.write(Levels::Hard.into(), u256 { low: 3, high: 0 });
        self.level_to_token_id.write(Levels::Master.into(), u256 { low: 4, high: 0 });
    }

    #[abi(embed_v0)]
    impl ERC1155Impl = ERC1155Component::ERC1155MixinImpl<ContractState>;

    impl ERC1155InternalImpl = ERC1155Component::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ScavengerHuntNFTImpl of super::IScavengerHuntNFT<ContractState> {
        // Mint a level badge (exactly one token)
        fn mint_level_badge(ref self: ContractState, recipient: ContractAddress, level: Levels,) {
            // Get token ID for the specified level
            let token_id = self.get_token_id_for_level(level);

            // Check if recipient already has this badge
            let balance = self.erc1155.balance_of(recipient, token_id);
            assert(balance == u256 { low: 0, high: 0 }, 'Already has this badge');

            // Mint exactly one token
            self
                .erc1155
                .mint_with_acceptance_check(
                    recipient, token_id, u256 { low: 1, high: 0 }, array![].span()
                );
        }

        // Function to get token ID for a level
        fn get_token_id_for_level(self: @ContractState, level: Levels) -> u256 {
            let level_felt = level.into(); // Convert Levels to felt252
            self.level_to_token_id.read(level_felt)
        }

        // Check if a player has a specific level badge
        fn has_level_badge(self: @ContractState, owner: ContractAddress, level: Levels) -> bool {
            let token_id = self.get_token_id_for_level(level);
            let balance = self.erc1155.balance_of(owner, token_id);
            balance > u256 { low: 0, high: 0 }
        }
    }
}
