use starknet::ContractAddress;
use starknet::get_caller_address;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait };

use onchain::interface::{IScavengerHuntDispatcher, IScavengerHuntDispatcherTrait, Question, Levels ,LevelProgress };

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
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());

    // Retrieve the question
    let question_id = 1; // Assuming the first question has ID 1
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

#[test]
fn test_submit_answer() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy;
    let question = "What is 2 + 2?"; 
    let correct_answer = "4"; 
    let wrong_answer = "5"; 
    let hint = "It's an even number"; 

    // Add a question
    dispatcher.add_question(level, question.clone(), correct_answer.clone(), hint.clone());

    // first question is assigned ID 1
    let question_id = 1;

    // Submit a wrong answer first
    let result_wrong = dispatcher.submit_answer(question_id, wrong_answer.clone());
    assert!(!result_wrong, "expected_sub_with_wrong_ans");

    // Submit  correct answer
    let result_correct = dispatcher.submit_answer(question_id, correct_answer.clone());
    assert!(
        result_correct, "expected_sub_with_correct_ans"
    );

    // Verify the player's progress has been updated
    let caller_address = get_caller_address(); 
    let level_progress = dispatcher.get_player_level_progress(caller_address, level);

    assert!(
        level_progress.last_question_index == 1,
        "expected_last_question_index_1 got {}",
        level_progress.last_question_index
    );

    assert!(
        level_progress.attempts == 2,
        "Expected_attempt_to_be 2 got {}",
        level_progress.attempts
    );

    assert!(
        !level_progress.is_completed,
        "Expected_level_to_be_incomp_but_it_marked_completed"
    );

    // Submit another correct answer 
    let total_questions = dispatcher.get_question_per_level(0);
    for _ in 1..total_questions {
        dispatcher.submit_answer(question_id, correct_answer.clone());
    }

    let updated_progress = dispatcher.get_player_level_progress(caller_address, level);
    assert!(updated_progress.is_completed, "Exp_level_completed_but_was_not");
}
