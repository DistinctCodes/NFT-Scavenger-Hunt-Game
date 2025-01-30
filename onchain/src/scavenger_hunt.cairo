#[starknet::contract]
mod ScavengerHunt {
    use starknet::ContractAddress;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Map
    };
    use onchain::interface::{IScavengerHunt, Question, Levels, PlayerProgress, LevelProgress};
    use openzeppelin_access::ownable::OwnableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[storage]
    struct Storage {
        questions: Map<u64, Question>,
        question_count: u64,
        questions_by_level: Map<(Levels, u64), u64>, // (levels, index) -> question_id
        question_per_level: u8,
        player_progress: Map<ContractAddress, PlayerProgress>,
        player_level_progress: Map<
            (ContractAddress, Levels), LevelProgress
        >, // (user, level) -> LevelProgress
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.ownable.initializer(admin);   
    }

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ScavengerHuntImpl of IScavengerHunt<ContractState> {
       
        fn set_question_per_level(ref self: ContractState, amount: u8) {
            self.ownable.assert_only_owner();
            assert!(amount > 0, "Question per level must be greater than 0");
            self.question_per_level.write(amount);
        }

        fn get_question_per_level(self: @ContractState, amount: u8) -> u8 {
            self.ownable.assert_only_owner();
            self.question_per_level.read()
        }

        fn add_question(
            ref self: ContractState,
            level: Levels,
            question: ByteArray,
            answer: ByteArray,
            hint: ByteArray,
        ) {
            self.ownable.assert_only_owner();
            let question_id = self.question_count.read();
            let question = Question {
                question_id,
                question,
                answer,
                level,
                hint,
            };
            self.questions.write(question_id, question);
            self.questions_by_level.write((level, question_id), question_id);
            self.question_count.write(question_id + 1);
        }
    }
}