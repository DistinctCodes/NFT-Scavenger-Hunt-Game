use snforge_std::DeclareResultTrait;
use starknet::ContractAddress;
use snforge_std::{declare, ContractClassTrait};
use openzeppelin_token::erc1155::interface::{IERC1155Dispatcher, IERC1155DispatcherTrait};

fn deploy_contract() -> ContractAddress {
    let token_uri: ByteArray = "https://scavenger_hunt_nft.com/your_id";
    let mut constructor_calldata: Array<felt252> = ArrayTrait::new();
    token_uri.serialize(ref constructor_calldata);

    let contract = declare("ScavengerHuntNFT").unwrap().contract_class();

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

fn deploy_mock_receiver() -> ContractAddress {
    let contract = declare("MockERC1155Receiver").unwrap().contract_class();

    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();

    contract_address
}

#[test]
fn test_constructor() {
    let contract_address = deploy_contract();

    let erc1155_token = IERC1155Dispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    let token_ids = array![1_u256].span();
    let values = array![10_u256].span();

    // Ensure `mint` is properly exposed
    // You might need a different dispatcher if `mint` is not part of IERC1155Dispatcher
    erc1155_token.mint(recipient, token_ids, values);

    let token_uri = erc1155_token.uri(1_u256);

    assert(token_uri == "https://scavenger_hunt_nft.com/your_id", 'wrong token uri');
}

#[test]
fn test_mint() {
    let contract_address = deploy_contract();

    let scavenger_hunt_nft = IERC1155Dispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    let token_ids = array![1_u256, 2_u256, 3_u256].span();

    let values = array![10_u256, 20_u256, 30_u256].span();

    scavenger_hunt_nft.mint(recipient, token_ids, values);

    assert(
        scavenger_hunt_nft.balance_of(recipient, 1_u256) == 10_u256, 'Wrong balance for token 1',
    );
    assert(
        scavenger_hunt_nft.balance_of(recipient, 2_u256) == 20_u256, 'Wrong balance for token 2',
    );
    assert(
        scavenger_hunt_nft.balance_of(recipient, 3_u256) == 30_u256, 'Wrong balance for token 3',
    );
}

#[test]
#[should_panic(expected: ('Invalid tokenID',))]
fn test_invalid_token_id() {
    let contract_address = deploy_contract();

    let scavenger_hunt_nft = IERC1155Dispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    let token_ids = array![5_u256].span();

    let values = array![50_u256].span();

    scavenger_hunt_nft.mint(recipient, token_ids, values);

    assert(scavenger_hunt_nft.balance_of(recipient, 5_u256) == 50_u256, 'Invalid Token ID');
}

#[test]
fn test_mint_nft() {
    let contract_address = deploy_contract();
    let scavenger_hunt_nft = IERC1155Dispatcher { contract_address };
    let recipient = deploy_mock_receiver();

    // Mint 1 copy per token ID (NFT behavior)
    let token_ids = array![1_u256, 2_u256, 3_u256].span();
    let values = array![1_u256, 1_u256, 1_u256].span(); // <-- 1 copy per token

    scavenger_hunt_nft.mint(recipient, token_ids, values);

    // Verify balances
    assert(scavenger_hunt_nft.balance_of(recipient, 1_u256) == 1_u256, 'Not an NFT');
    assert(scavenger_hunt_nft.balance_of(recipient, 2_u256) == 1_u256, 'Not an NFT');
}
