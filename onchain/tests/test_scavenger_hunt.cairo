use starknet::{ContractAddress, contract_address_const};

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use onchain::interface::{IScavengerHuntDispatcher,Levels,IScavengerHuntDispatcherTrait};


fn deploy_contract() -> ContractAddress {
    let contract = declare("ScavengerHunt").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

fn PLAYER() -> ContractAddress {
    contract_address_const::<'PLAYER'>()
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
fn test_initialize_player_progress() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    let player_address = PLAYER(); 
    dispatcher.initialize_player_progress(player_address);

    let player_progress = dispatcher.get_player_progress(player_address);
    assert!(player_progress.is_initialized, "Player should be initialized");
    assert!(player_progress.current_level == Levels::Easy, "Player should be initialized at Easy level");
}
