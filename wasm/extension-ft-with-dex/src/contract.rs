#![allow(dead_code, unused_imports)]
use cosmwasm_std::{entry_point, StdError};
use cosmwasm_std::{BalanceResponse, BankQuery};
use cosmwasm_std::{Coin, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use cw2::set_contract_version;
use std::ops::Div;
use crate::error::ContractError;
/*
 */
use crate::msg::{DEXOrder, ExecuteMsg, IBCPurpose, InstantiateMsg, MigrateMsg, QueryMsg, SudoMsg, TransferContext};
use crate::state::DENOM;

// version info for migration info
const CONTRACT_NAME: &str = env!("CARGO_PKG_NAME");
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    DENOM.save(deps.storage, &msg.denom)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {}
}

#[entry_point]
pub fn sudo(deps: DepsMut, env: Env, msg: SudoMsg) -> Result<Response, ContractError> {
    match msg {
        SudoMsg::ExtensionTransfer {
            sender,
            recipient,
            transfer_amount,
            commission_amount,
            burn_amount,
            context,
        } => sudo_extension_transfer(
            deps,
            env,
            transfer_amount,
            sender,
            recipient,
            commission_amount,
            burn_amount,
            context,
        ),
        SudoMsg::ExtensionPlaceOrder {
            order,
            expected_to_spend,
            expected_to_receive,
        } => sudo_extension_place_order(order, expected_to_spend, expected_to_receive),
    }
}

pub fn sudo_extension_transfer(
    _deps: DepsMut,
    _env: Env,
    _amount: Uint128,
    _sender: String,
    _recipient: String,
    _commission_amount: Uint128,
    _burn_amount: Uint128,
    _context: TransferContext,
) -> Result<Response, ContractError> {
    Ok(Response::new())
}

pub fn sudo_extension_place_order(
    _order: DEXOrder,
    _expected_to_spend: Coin,
    _expected_to_receive: Coin,
) -> Result<Response, ContractError> {
    Ok(Response::new())
}

#[entry_point]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> Result<Response, ContractError> {
    // No state migrations performed, just returned a Response
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {}
}
