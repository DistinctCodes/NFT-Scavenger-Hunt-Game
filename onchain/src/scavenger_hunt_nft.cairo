use starknet::ContractAddress;
use onchain::interface::{Levels};

#[starknet::interface]
pub trait IGameAsset<TContractState> {
    fn mint(
        ref self: TContractState,
        recipient: ContractAddress,
        token_ids: Span<u256>,
        values: Span<u256>,
    );
}

#[starknet::contract]
mod GameAsset {
    use AccessControlComponent::InternalTrait;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc1155::{ERC1155Component, ERC1155HooksEmptyImpl};
    use openzeppelin::access::accesscontrol::AccessControlComponent;
    use starknet::ContractAddress;
    use super::{Levels};
    use starknet::storage::Map;

    component!(path: ERC1155Component, storage: erc1155, event: ERC1155Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);

    // Roles
    const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc1155: ERC1155Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        level_to_token_id: Map<felt252, u256> // Maps Levels (as felt) to token IDs
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC1155Event: ERC1155Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress, token_uri: ByteArray) {
        // Initialize ERC-1155 with metadata URI
        self.erc1155.initializer(token_uri);

        // Initialize AccessControl
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(MINTER_ROLE, admin);

        // Map levels to token IDs
        self.level_to_token_id.write('EASY', u256 { low: 1, high: 0 });
        self.level_to_token_id.write('MEDIUM', u256 { low: 2, high: 0 });
        self.level_to_token_id.write('HARD', u256 { low: 3, high: 0 });
        self.level_to_token_id.write('MASTER', u256 { low: 4, high: 0 });
    }

    #[abi(embed_v0)]
    impl ERC1155Impl = ERC1155Component::ERC1155MixinImpl<ContractState>;

    impl ERC1155InternalImpl = ERC1155Component::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;

    #[abi(embed_v0)]
    impl GameAssetImpl of super::IGameAsset<ContractState> {
        fn mint(
            ref self: ContractState,
            recipient: ContractAddress,
            token_ids: Span<u256>,
            values: Span<u256>,
        ) {
            // Ensure caller has MINTER_ROLE
            self.accesscontrol.assert_only_role(MINTER_ROLE);

            // Mint tokens
            self
                .erc1155
                .batch_mint_with_acceptance_check(recipient, token_ids, values, array![].span());
        }
    }

    // Helper function to get token ID for a level
    #[generate_trait]
    impl GameAssetInternalImpl of IGameAssetInternal {
        fn get_token_id_for_level(self: @ContractState, level: Levels) -> u256 {
            let level_felt = level.into(); // Convert Levels to felt252
            self.level_to_token_id.read(level_felt)
        }
    }
}
