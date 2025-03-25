#[starknet::contract]
pub mod ScavengerHunt {
    use starknet::event::EventEmitter;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
        StorageMapReadAccess, StorageMapWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::access::accesscontrol::AccessControlComponent;
    use AccessControlComponent::InternalTrait;
    use onchain::interface::{IScavengerHunt, Question, Levels, PlayerProgress, LevelProgress};
    use core::array::{ArrayTrait};
    use core::felt252;
    use onchain::utils::hash_byte_array;

    const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // SRC5
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[storage]
    struct Storage {
        questions: Map<u64, Question>,
        question_count: u64,
        questions_by_level: Map<(felt252, u8), u64>, // (levels, index) -> question_id
        question_per_level: u8,
        question_per_level_index: Map<felt252, u8>,
        player_progress: Map<ContractAddress, PlayerProgress>,
        player_level_progress: Map<
            (ContractAddress, felt252), LevelProgress,
        >, // (user, level) -> LevelProgress
        nft_contract_address: ContractAddress,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        QuestionAdded: QuestionAdded,
        QuestionUpdated: QuestionUpdated,
        PlayerInitialized: PlayerInitialized,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        LevelCompleted: LevelCompleted,
        AnswerSubmitted: AnswerSubmitted,
        NFTContractUpdated: NFTContractUpdated,
    }

    #[derive(Drop, starknet::Event)]
    pub struct QuestionAdded {
        pub question_id: u64,
        pub level: Levels,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayerInitialized {
        pub player_address: ContractAddress,
        pub level: felt252,
        pub is_initialized: bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct QuestionUpdated {
        pub question_id: u64,
        pub level: Levels,
    }

    #[derive(Drop, starknet::Event)]
    pub struct LevelCompleted {
        pub player: ContractAddress,
        pub completed_level: Levels,
        pub next_level: Levels,
    }

    #[derive(Drop, starknet::Event)]
    pub struct AnswerSubmitted {
        pub player: ContractAddress,
        pub question_id: u64,
        pub level: Levels,
        pub is_correct: bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct NFTContractUpdated {
        pub old_address: ContractAddress,
        pub new_address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(ADMIN_ROLE, admin);
    }

    #[abi(embed_v0)]
    impl ScavengerHuntImpl of IScavengerHunt<ContractState> {
        // Add a new question to the contract
        fn add_question(
            ref self: ContractState,
            level: Levels,
            question: ByteArray,
            answer: ByteArray,
            hint: ByteArray,
        ) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);

            let question_id = self.question_count.read()
                + 1; // Increment the question count and use it as the ID

            self.question_count.write(question_id); // Update the question count

            // Hash the answer ByteArray
            let hashed_answer = hash_byte_array(answer.clone()); // Clone to avoid ownership issues

            let new_question = Question { question_id, question, hashed_answer, level, hint };

            // Store the new question in the `questions` map
            self.questions.write(question_id, new_question);

            // Store the new question by level
            let question_per_level = self.question_per_level.read();
            let question_per_level_index = self.question_per_level_index.read(level.into());

            assert(question_per_level_index < question_per_level, 'question per level limit');

            self.questions_by_level.write((level.into(), question_per_level_index), question_id);
            self.question_per_level_index.write(level.into(), question_per_level_index + 1);

            // Emit event
            self.emit(QuestionAdded { question_id, level });
        }

        // Get a question by question_id
        fn get_question(self: @ContractState, question_id: u64) -> Question {
            // Retrieve the question from storage using the question_id
            self.questions.read(question_id)
        }

        fn set_question_per_level(ref self: ContractState, amount: u8) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            assert!(amount > 0, "Question per level must be greater than 0");
            self.question_per_level.write(amount);
        }

        fn get_question_per_level(self: @ContractState) -> u8 {
            self.question_per_level.read()
        }

        fn initialize_player_progress(ref self: ContractState, player_address: ContractAddress) {
            let player_progress = self.player_progress.entry(player_address).read();

            assert!(!player_progress.is_initialized, "Player already initialized");

            // initialize player progess
            self
                .player_progress
                .write(
                    player_address,
                    PlayerProgress {
                        address: player_address, current_level: Levels::Easy, is_initialized: true,
                    },
                );

            // set player current level
            self
                .player_level_progress
                .write(
                    (player_address, Levels::Easy.into()),
                    LevelProgress {
                        player: player_address,
                        level: Levels::Easy,
                        last_question_index: 0,
                        is_completed: false,
                        attempts: 0,
                        nft_minted: false,
                    },
                );

            self.emit(PlayerInitialized { player_address, level: 'EASY', is_initialized: true });
        }

        fn submit_answer(ref self: ContractState, question_id: u64, answer: ByteArray) -> bool {
            let caller = get_caller_address();

            // Check if player is initialized
            let player_progress = self.player_progress.read(caller);
            assert!(player_progress.is_initialized, "Player not initialized");

            // Validate question exists
            let question_data = self.questions.read(question_id);
            assert!(question_data.question_id == question_id, "Question not found");

            // Get and update level progress
            let mut level_progress = self
                .player_level_progress
                .read((caller, question_data.level.into()));

            // Hash the answer
            let hashed_answer = hash_byte_array(answer);
            let is_correct = question_data.hashed_answer == hashed_answer;

            // Increment attempts
            level_progress.attempts += 1;

            if is_correct {
                // Correct answer logic
                level_progress.last_question_index += 1;
                let total_questions = self.question_per_level.read();
                assert!(total_questions > 0, "Questions per level not set");

                // Check level completion
                if level_progress.last_question_index >= total_questions {
                    level_progress.is_completed = true;

                    // Update player's current level
                    let next_level = self.next_level(question_data.level);
                    self
                        .player_progress
                        .write(
                            caller,
                            PlayerProgress {
                                address: caller, current_level: next_level, is_initialized: true
                            }
                        );

                    // Emit level completion event
                    self
                        .emit(
                            LevelCompleted {
                                player: caller, completed_level: question_data.level, next_level
                            }
                        );
                }
            }

            // Update storage for attempts
            self.player_level_progress.write((caller, question_data.level.into()), level_progress);

            // Emit answer submission event
            self
                .emit(
                    AnswerSubmitted {
                        player: caller, question_id, level: question_data.level, is_correct
                    }
                );

            is_correct
        }

        fn request_hint(self: @ContractState, question_id: u64) -> ByteArray {
            // Retrieve the question from storage
            let question = self.questions.read(question_id);

            // Return the hint stored in the question
            question.hint
        }

        fn get_question_in_level(self: @ContractState, level: Levels, index: u8) -> ByteArray {
            let question_id = self.questions_by_level.read((level.into(), index));
            let question_struct = self.questions.read(question_id);
            question_struct.question
        }

        fn update_question(
            ref self: ContractState,
            question_id: u64,
            question: ByteArray,
            answer: ByteArray,
            level: Levels, // This would be updated in-time
            hint: ByteArray,
        ) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);

            // Check if the question exists
            let mut existing_question = self.questions.read(question_id);
            assert!(existing_question.question_id == question_id, "Question does not exist");

            // Hash the answer ByteArray
            let hashed_answer = hash_byte_array(answer.clone()); // Clone to avoid ownership issues
            // Copying the original level to avoid partial moves
            let original_level = existing_question.level;

            // Update the question details
            existing_question.question = question;
            existing_question.hashed_answer = hashed_answer;
            //TODO: support level update.
            existing_question.hint = hint;

            // Write the updated question back to storage
            self.questions.write(question_id, existing_question);

            // Emit an event
            self.emit(QuestionUpdated { question_id, level: original_level });
        }

        fn next_level(self: @ContractState, level: Levels) -> Levels {
            match level {
                Levels::Easy => Levels::Medium,
                Levels::Medium => Levels::Hard,
                Levels::Hard => Levels::Master,
                Levels::Master => Levels::Master,
            }
        }

        fn get_player_level(self: @ContractState, player: ContractAddress) -> Levels {
            let player_progress = self.player_progress.read(player);
            let player_level = player_progress.current_level;

            player_level
        }

        fn set_nft_contract_address(ref self: ContractState, new_address: ContractAddress) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            let old_address = self.nft_contract_address.read();
            self.nft_contract_address.write(new_address);
            self.emit(NFTContractUpdated { old_address, new_address });
        }

        fn get_nft_contract_address(self: @ContractState) -> ContractAddress {
            self.nft_contract_address.read()
        }
    }
}
