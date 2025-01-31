#[starknet::contract]
mod ScavengerHunt {
    use starknet::ContractAddress;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapWriteAccess,Map,
        StorageMapReadAccess,
    };
    use onchain::interface::{IScavengerHunt, Question, Levels, PlayerProgress, LevelProgress};

    #[storage]
    struct Storage {
        questions: Map<u64, Question>,
        question_count: u64,
        questions_by_level: Map<(Levels, u64), u64>, // (levels, index) -> question_id
        question_per_level: u8,
        player_progress: Map<ContractAddress, PlayerProgress>,
        player_level_progress: Map<(ContractAddress, felt252), LevelProgress>, // (user, level) -> LevelProgress
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl ScavengerHuntImpl of IScavengerHunt<ContractState> {
        //TODO: restrict to admin
        fn set_question_per_level(ref self: ContractState, amount: u8) {
            assert!(amount > 0, "Question per level must be greater than 0");
            self.question_per_level.write(amount);
        }

        fn get_question_per_level(self: @ContractState, amount: u8) -> u8 {
            self.question_per_level.read()
        }

        fn initialize_player_progress(ref self: ContractState, player_address: ContractAddress) {
            // Check if player is already initialized
            let player_progress = self.player_progress.read(player_address);
            assert!(!player_progress.is_initialized, "Player already initialized");

            // Create a new PlayerProgress struct for the player
            let new_player_progress = PlayerProgress {
                address: player_address,
                current_level: Levels::Easy,
                is_initialized: true,
            };

            // Store the new player progress
            self.player_progress.write(player_address, new_player_progress);

            // Initialize the progress for Easy level
            let level_progress =  LevelProgress {
                player: player_address,
                level: Levels::Easy,
                last_question_index: 0,
                is_completed: false,
                attempts: 0,
                nft_minted: false,
            };

            self.player_level_progress.write((player_address,Levels::Easy.into()), level_progress);
        }
        
    }
}
