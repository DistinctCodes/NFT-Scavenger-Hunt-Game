use starknet::{ContractAddress, contract_address_const};

use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
    stop_cheat_caller_address,
};

use onchain::interface::{IScavengerHuntDispatcher, IScavengerHuntDispatcherTrait, Question, Levels};
use onchain::utils::hash_byte_array;


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

    let question_per_level = dispatcher.get_question_per_level();
    assert!(question_per_level == 5, "Expected 5 questions per level, got {}", question_per_level);
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_set_question_per_level_should_panic_with_missing_role() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    dispatcher.set_question_per_level(5);

    let question_per_level = dispatcher.get_question_per_level();
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

    let hashed_answer = hash_byte_array(answer.clone());
    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
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
        retrieved_question.hashed_answer == hashed_answer,
        "Expected answer '{}', got '{}'",
        hashed_answer,
        retrieved_question.hashed_answer,
    );
    assert!(
        retrieved_question.hint == hint,
        "Expected hint '{}', got '{}'",
        hint,
        retrieved_question.hint,
    );
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
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Retrieve the hint for the question
    let question_id = 1; // Assuming the first question has ID 1
    let retrieved_hint = dispatcher.request_hint(question_id);

    // Verify that the retrieved hint matches the expected hint
    assert!(retrieved_hint == hint, "Expected hint '{}', got '{}'", hint, retrieved_hint);
}

#[test]
fn test_get_question_in_level() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    let level = Levels::Easy;
    let question = "What is the capital of France?";
    let answer = "Paris";
    let hint = "It starts with 'P'";
    let index = 0;

    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    let retrieved_question = dispatcher.get_question_in_level(level, index);

    assert!(
        retrieved_question == question,
        "Expected question '{}', got '{}'",
        question,
        retrieved_question,
    );
}

#[test]
fn test_update_question() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define initial test data
    let level = Levels::Easy;
    let question = "What is the capital of France?";
    let answer = "Paris";
    let hint = "It starts with 'P'";

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Define updated test data
    let updated_question = "What is the capital of Germany?";
    let updated_answer = "Berlin";
    let updated_hint = "It starts with 'B'";

    let hashed_updated_answer = hash_byte_array(updated_answer.clone());

    // Update the question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher
        .update_question(
            1, updated_question.clone(), updated_answer.clone(), level, updated_hint.clone(),
        );
    stop_cheat_caller_address(contract_address);

    // Retrieve the updated question
    let retrieved_question: Question = dispatcher.get_question(1);

    // Assertions to verify the question was updated correctly
    assert!(
        retrieved_question.question == updated_question,
        "Expected question '{}', got '{}'",
        updated_question,
        retrieved_question.question,
    );
    assert!(
        retrieved_question.hashed_answer == hashed_updated_answer,
        "Expected answer '{}', got '{}'",
        hashed_updated_answer,
        retrieved_question.hashed_answer,
    );
    assert!(
        retrieved_question.hint == updated_hint,
        "Expected hint '{}', got '{}'",
        updated_hint,
        retrieved_question.hint,
    );
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_update_question_should_panic_with_missing_role() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define initial test data
    let level = Levels::Easy;
    let question = "What is the capital of France?";
    let answer = "Paris";
    let hint = "It starts with 'P'";

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Define updated test data
    let updated_question = "What is the capital of Germany?";
    let updated_answer = "Berlin";
    let updated_hint = "It starts with 'B'";

    // Attempt to update the question without admin role
    dispatcher
        .update_question(
            1, updated_question.clone(), updated_answer.clone(), level, updated_hint.clone(),
        );
}

#[test]
#[should_panic(expected: "Question does not exist")]
fn test_update_question_should_panic_if_question_does_not_exist() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data for updating a non-existent question
    let invalid_question_id = 1; // This question ID does not exist yet
    let question = "What is the capital of France?";
    let answer = "Paris";
    let level = Levels::Easy;
    let hint = "It starts with 'P'";

    // Attempt to update a non-existent question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.update_question(invalid_question_id, question, answer, level, hint);
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_level_progression() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Set test player address (simulate a user)
    let player_address = USER();

    // Define test data
    let level = Levels::Easy;
    let question = "Who is the pirate king?"; // ByteArray
    let answer = "Gol d Roger"; // ByteArray
    let hint = "It starts with 'G'"; // ByteArray

    //let hashed_answer = hash_byte_array(answer.clone());

    // Add a question to the contract
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(2); // Assume 2 questions per level
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    dispatcher.add_question(level, "What is One Piece?", "A treasure", "It is the ultimate prize");
    stop_cheat_caller_address(contract_address);

    // Retrieve the total number of questions per level
    let total_questions = dispatcher.get_question_per_level();

    assert!(total_questions == 2, "Expected 2 questions per level, got {}", total_questions);

    // Ensure player starts at Easy level

    let player_progress = dispatcher.get_player_progress.read(player_address, 0);

    assert_eq!(player_progress.current_level, Levels::Easy, "Player should start at Easy level");
    //  // Answer all questions correctly in the Easy level
//  for question_id in 1..=total_questions {
//      let result = dispatcher.submit_answer(question_id, answer.////clone());
//      assert!(result, "Answer should be correct for question {}", question_id);
//  }
//  // After completing the last question, check if the level progressed
//  let updated_progress = dispatcher.get_player_progress(player_address);
//  assert_eq!(
//      updated_progress.current_level,
//      Levels::Medium,
//      "Player should progress to Medium level after completing Easy"
//  );
}
// #[test]
// fn test_no_progression_on_partial_completion() {
//     let contract_address = deploy_contract();
//     let dispatcher = IScavengerHuntDispatcher { contract_address };

//     let player_address = get_caller_address();

//     // Setup test level
//     let level = Levels::Easy;
//     dispatcher.set_question_per_level(3);
//     dispatcher.add_question(level, "Q1?", "A1", "H1");
//     dispatcher.add_question(level, "Q2?", "A2", "H2");
//     dispatcher.add_question(level, "Q3?", "A3", "H3");

//     // Answer only 2 out of 3 correctly
//     dispatcher.submit_answer(1, "A1".to_string());
//     dispatcher.submit_answer(2, "A2".to_string());

//     let progress = dispatcher.get_player_progress(player_address);
//     assert_eq!(
//         progress.current_level,
//         Levels::Easy,
//         "Player should still be at Easy since all questions were not answered"
//     );
// }

// #[test]
// fn test_multiple_level_progressions() {
//     let contract_address = deploy_contract();
//     let dispatcher = IScavengerHuntDispatcher { contract_address };
//     let player_address = get_caller_address();

//     dispatcher.set_question_per_level(2);

//     let levels = [Levels::Easy, Levels::Medium, Levels::Hard];
//     for &level in &levels {
//         dispatcher.add_question(level, "Q1?", "A1", "H1");
//         dispatcher.add_question(level, "Q2?", "A2", "H2");
//     }

//     // Answer all questions for each level and check progression
//     for level in levels.iter() {
//         for question_id in 1..=2 {
//             dispatcher.submit_answer(question_id, "A1".to_string());
//         }

//         let progress = dispatcher.get_player_progress(player_address);
//         assert_eq!(
//             progress.current_level,
//             dispatcher.next_level(*level),
//             "Player should progress to the next level after completing all questions"
//         );
//     }
// }

// #[test]
// fn test_incorrect_answer_does_not_progress() {
//     let contract_address = deploy_contract();
//     let dispatcher = IScavengerHuntDispatcher { contract_address };
//     let player_address = get_caller_address();

//     dispatcher.set_question_per_level(1);
//     dispatcher.add_question(Levels::Easy, "Q1?", "Correct", "Hint");

//     // Submit incorrect answer
//     let result = dispatcher.submit_answer(1, "Wrong".to_string());
//     assert!(!result, "Submitting an incorrect answer should fail");

//     let progress = dispatcher.get_player_progress(player_address);
//     assert_eq!(
//         progress.current_level,
//         Levels::Easy,
//         "Player should still be at Easy level after an incorrect answer"
//     );
// }

// #[test]
// fn test_max_level_does_not_progress() {
//     let contract_address = deploy_contract();
//     let dispatcher = IScavengerHuntDispatcher { contract_address };
//     let player_address = get_caller_address();

//     dispatcher.set_question_per_level(2);
//     dispatcher.set_player_level(player_address, Levels::Master);

//     dispatcher.add_question(Levels::Master, "Final Q1?", "Final A1", "H1");
//     dispatcher.add_question(Levels::Master, "Final Q2?", "Final A2", "H2");

//     dispatcher.submit_answer(1, "Final A1".to_string());
//     dispatcher.submit_answer(2, "Final A2".to_string());

//     let progress = dispatcher.get_player_progress(player_address);
//     assert_eq!(
//         progress.current_level,
//         Levels::Master,
//         "Player should remain at Master level after completing all questions"
//     );
// }


