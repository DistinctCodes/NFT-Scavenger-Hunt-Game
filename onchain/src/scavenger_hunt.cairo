#[starknet::contract]
mod ScavengerHunt {
    use onchain::interface::{IScavengerHunt};

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl ScavengerHuntImpl of IScavengerHunt<ContractState> {}
}
