use starknet::ContractAddress;

#[starknet::interface]
pub trait IERC1155<TContractState> {
    // IERC1155
    fn balance_of(self: @TContractState, account: ContractAddress, token_id: u256) -> u256;
    fn balance_of_batch(
        self: @TContractState, accounts: Span<ContractAddress>, token_ids: Span<u256>,
    ) -> Span<u256>;
    fn safe_transfer_from(
        ref self: TContractState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        value: u256,
        data: Span<felt252>,
    );
    fn safe_batch_transfer_from(
        ref self: TContractState,
        from: ContractAddress,
        to: ContractAddress,
        token_ids: Span<u256>,
        values: Span<u256>,
        data: Span<felt252>,
    );
    fn is_approved_for_all(
        self: @TContractState, owner: ContractAddress, operator: ContractAddress,
    ) -> bool;
    fn set_approval_for_all(ref self: TContractState, operator: ContractAddress, approved: bool);

    // ISRC5
    fn supports_interface(self: @TContractState, interface_id: felt252) -> bool;

    // IERC1155MetadataURI
    fn uri(self: @TContractState, token_id: u256) -> ByteArray;

    // IERC1155Camel
    fn balanceOf(self: @TContractState, account: ContractAddress, tokenId: u256) -> u256;
    fn balanceOfBatch(
        self: @TContractState, accounts: Span<ContractAddress>, tokenIds: Span<u256>,
    ) -> Span<u256>;
    fn safeTransferFrom(
        ref self: TContractState,
        from: ContractAddress,
        to: ContractAddress,
        tokenId: u256,
        value: u256,
        data: Span<felt252>,
    );
    fn safeBatchTransferFrom(
        ref self: TContractState,
        from: ContractAddress,
        to: ContractAddress,
        tokenIds: Span<u256>,
        values: Span<u256>,
        data: Span<felt252>,
    );
    fn isApprovedForAll(
        self: @TContractState, owner: ContractAddress, operator: ContractAddress,
    ) -> bool;
    fn setApprovalForAll(ref self: TContractState, operator: ContractAddress, approved: bool);

    fn mint(
        ref self: TContractState,
        recipient: ContractAddress,
        token_ids: Span<u256>,
        values: Span<u256>,
    );
}
