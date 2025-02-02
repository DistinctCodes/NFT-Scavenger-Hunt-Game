use starknet::{ContractAddress, contract_address_const};

use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
    stop_cheat_caller_address,
};

use onchain::interface::{IScavengerHuntDispatcher, IScavengerHuntDispatcherTrait, Question, Levels};

fn ADMIN() -> ContractAddress {
    contract_address_const::<'ADMIN'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'USER'>()
}

fn deploy_contract() -> ContractAddress {
    let contract = declare("ScavengerHunt").unwrap().contract_class();
    let mut constructor_calldata: Array::<felt252> = array![];
    Serde::serialize(@ADMIN(), ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}

#[test]
fn test_set_question_per_level() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    stop_cheat_caller_address(contract_address);

    let question_per_level = dispatcher.get_question_per_level(0);
    assert!(question_per_level == 5, "Expected 5 questions per level, got {}", question_per_level);
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_set_question_per_level_should_panic_with_missing_role() {
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
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

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
fn test_request_hint() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    start_cheat_caller_address(contract_address, USER());

    // Define test data
    let level = Levels::Easy;
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());

    // Retrieve the hint for the question
    let question_id = 1; // Assuming the first question has ID 1
    let retrieved_hint = dispatcher.request_hint(question_id);

    // Verify that the retrieved hint matches the expected hint
    assert!(retrieved_hint == hint, "Expected hint '{}', got '{}'", hint, retrieved_hint);
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_add_and_get_question_should_panic_with_missing_role() {
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
}

#[test]
fn test_submit_answer() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy;
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());

    // Assign the required role to the caller
    start_cheat_caller_address(contract_address, USER()); 
    

    // Submit the correct answer
    let result = dispatcher.submit_answer(0, answer.clone());
    assert(result == true, 'The answer should be correct');

    // Submit an incorrect answer
    let wrong_answer = "London"; // ByteArray
    let result = dispatcher.submit_answer(0, wrong_answer);
    assert(result == false, 'The answer should be incorrect');
    stop_cheat_caller_address(contract_address); 
    
}

