use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use onchain::interface::{IScavengerHuntDispatcher, IScavengerHuntDispatcherTrait, Question, Levels};

fn deploy_contract() -> ContractAddress {
    let contract = declare("ScavengerHunt").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_set_question_per_level() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    dispatcher.set_question_per_level(5);

    let question_per_level = dispatcher.get_question_per_level(0);
    assert!(question_per_level == 5, "Expected 5 questions per level, got {}", question_per_level);
}

#[test]
fn test_add_and_get_question() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy;
    let level_as_felt = level.into();
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    dispatcher.add_question(level_as_felt, question.clone(), answer.clone(), hint.clone());

    // Retrieve the question
    let retrieved_question: Question = dispatcher
        .get_question(1); // Assuming the first question has ID 1

    // Assertions to verify the question was added correctly
    assert!(
        retrieved_question.question_id == 1,
        "Expected question ID 1, got {}",
        retrieved_question.question_id,
    );
    assert!(
        retrieved_question.question == question,
        "Expected question '{}', got '{}'",
        question,
        retrieved_question.question,
    );
    assert!(
        retrieved_question.answer == answer,
        "Expected answer '{}', got '{}'",
        answer,
        retrieved_question.answer,
    );
    assert!(
        retrieved_question.hint == hint,
        "Expected hint '{}', got '{}'",
        hint,
        retrieved_question.hint,
    );
}

#[test]
fn test_add_and_get_question2() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy; // Example: Easy level as an enum variant
    let level_as_felt = level.into(); // Convert level to felt252

    let question = "What is the capital of France?"; // Question
    let answer = "Paris"; // Answer
    let hint = "It starts with 'P'"; // Hint

    // Add a question
    dispatcher.add_question(level_as_felt, question.clone(), answer.clone(), hint.clone());

    // Since we are adding the first question, we assume it will have ID 1
    let question_id = 1;

    // Retrieve the question by its ID
    let retrieved_question: Question = dispatcher.get_question(question_id);

    // Assertions to verify the question was added correctly
    assert!(
        retrieved_question.question_id == question_id,
        "Expected question ID {}, got {}",
        question_id,
        retrieved_question.question_id,
    );
    assert!(
        retrieved_question.question == question,
        "Expected question '{}', got '{}'",
        question,
        retrieved_question.question,
    );
    assert!(
        retrieved_question.answer == answer,
        "Expected answer '{}', got '{}'",
        answer,
        retrieved_question.answer,
    );
    assert!(
        retrieved_question.hint == hint,
        "Expected hint '{}', got '{}'",
        hint,
        retrieved_question.hint,
    );
}

