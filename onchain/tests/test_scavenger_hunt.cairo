use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use onchain::interface::{IScavengerHuntDispatcher,Levels, IScavengerHuntDispatcherTrait};

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
fn test_add_question() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    dispatcher.set_question_per_level(5);

    let question = "A question";
    let answer = "An answer";
    let hint = "A hint";	

    dispatcher.add_question(Levels::Easy, question, answer, hint);
    // Retrieve the question and verify its properties
    let question_id = 0; // Assuming this is the first question added
    let added_question = dispatcher.get_question(question_id);

    assert!(added_question.question == "A question", "Wrong question");
    assert!(added_question.answer == "An answer", "Wrong answer");
    assert!(added_question.hint == "A hint", "Wrong hint");
}

