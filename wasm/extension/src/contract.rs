#![allow(dead_code, unused_imports)]
use cosmwasm_std::{entry_point, StdError};
use cosmwasm_std::{BalanceResponse, BankQuery};
use cosmwasm_std::{Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use cw2::set_contract_version;
use std::ops::Div;

use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, IBCPurpose, InstantiateMsg, MigrateMsg, QueryMsg, SudoMsg, TransferContext,
};
use crate::state::{DENOM, PARENT_DENOM};
use coreum_wasm_sdk::assetft::{
    self, FrozenBalanceResponse, Query, Token, TokenResponse, WhitelistedBalanceResponse,
};
use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries, CoreumResult};

// version info for migration info
const CONTRACT_NAME: &str = env!("CARGO_PKG_NAME");
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> CoreumResult<ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    DENOM.save(deps.storage, &msg.denom)?;

    PARENT_DENOM.save(
        deps.storage,
        &msg.issuance_msg.parent_denom.unwrap_or_default(),
    )?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut<CoreumQueries>,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> CoreumResult<ContractError> {
    match msg {}
}

#[entry_point]
pub fn sudo(deps: DepsMut<CoreumQueries>, env: Env, msg: SudoMsg) -> CoreumResult<ContractError> {
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
    }
}

pub fn sudo_extension_transfer(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    amount: Uint128,
    _sender: String,
    recipient: String,
    _commission_amount: Uint128,
    _burn_amount: Uint128,
    _context: TransferContext,
) -> CoreumResult<ContractError> {
    let denom = DENOM.load(deps.storage)?;
    let token = query_token(deps.as_ref(), &denom)?;

    if let Some(features) = &token.features {
        if features.contains(&assetft::WHITELISTING) {
            assert_whitelisting(deps.as_ref(), &recipient, &token.denom, amount)?;
        }
    }

    let transfer_msg = cosmwasm_std::BankMsg::Send {
        to_address: recipient.to_string(),
        amount: vec![Coin { amount, denom }],
    };

    let response = Response::new()
        .add_attribute("method", "execute_transfer")
        .add_message(transfer_msg);

    Ok(response)
}

fn assert_whitelisting(
    deps: Deps<CoreumQueries>,
    account: &str,
    denom: &str,
    amount: Uint128,
) -> Result<(), ContractError> {
    let parent_denom = PARENT_DENOM.load(deps.storage).unwrap_or_default();
    if !parent_denom.is_empty() {
        let whitelisted_balance = query_whitelisted_balance(deps, account, &parent_denom)?;
        if whitelisted_balance.amount.gt(&Uint128::zero()) {
            return Ok(());
        }
    }

    let bank_balance = query_bank_balance(deps, account, denom)?;
    let whitelisted_balance = query_whitelisted_balance(deps, account, denom)?;

    if amount + bank_balance.amount > whitelisted_balance.amount {
        return Err(ContractError::WhitelistingError {});
    }

    Ok(())
}

fn query_token(deps: Deps<CoreumQueries>, denom: &str) -> StdResult<Token> {
    let token: TokenResponse = deps.querier.query(
        &CoreumQueries::AssetFT(Query::Token {
            denom: denom.to_string(),
        })
        .into(),
    )?;

    Ok(token.token)
}

fn query_bank_balance(deps: Deps<CoreumQueries>, account: &str, denom: &str) -> StdResult<Coin> {
    let bank_balance: BalanceResponse = deps.querier.query(
        &BankQuery::Balance {
            address: account.to_string(),
            denom: denom.to_string(),
        }
        .into(),
    )?;

    Ok(bank_balance.amount)
}

fn query_whitelisted_balance(
    deps: Deps<CoreumQueries>,
    account: &str,
    denom: &str,
) -> StdResult<Coin> {
    let whitelisted_balance: WhitelistedBalanceResponse = deps.querier.query(
        &CoreumQueries::AssetFT(Query::WhitelistedBalance {
            account: account.to_string(),
            denom: denom.to_string(),
        })
        .into(),
    )?;
    Ok(whitelisted_balance.balance)
}

#[entry_point]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> CoreumResult<ContractError> {
    // No state migrations performed, just returned a Response
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {}
}
