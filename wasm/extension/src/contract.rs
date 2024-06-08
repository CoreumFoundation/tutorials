#![allow(dead_code, unused_imports)]
use cosmwasm_std::{entry_point, StdError};
use cosmwasm_std::{BalanceResponse, BankQuery};
use cosmwasm_std::{Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use cw2::set_contract_version;
use std::ops::{Div, Sub};

use crate::error::ContractError;
use coreum_wasm_sdk::assetft::{
    self, FrozenBalanceResponse, Query, Token, TokenResponse, WhitelistedBalanceResponse,
};
use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries, CoreumResult};
/*
 */
use crate::msg::{
    ExecuteMsg, IBCPurpose, InstantiateMsg, MigrateMsg, QueryMsg, SudoMsg, TransferContext,
};
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
) -> CoreumResult<ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    DENOM.save(deps.storage, &msg.denom)?;

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
    sender: String,
    recipient: String,
    _commission_amount: Uint128,
    burn_amount: Uint128,
    _context: TransferContext,
) -> CoreumResult<ContractError> {
    let denom = DENOM.load(deps.storage)?;
    let token = query_token(deps.as_ref(), &denom)?;

    let transfer_msg = cosmwasm_std::BankMsg::Send {
        to_address: recipient.to_string(),
        amount: vec![Coin { amount, denom }],
    };

    let mut response = Response::new()
        .add_attribute("method", "execute_transfer")
        .add_message(transfer_msg);

    if !burn_amount.is_zero() {
        let new_burn_amount = match amount.u128() {
            0..=200 => burn_amount,
            201..=400 => burn_amount.div(Uint128::new(2)),
            _ => burn_amount.div(Uint128::new(5)),
        };

        let burn_message = CoreumMsg::AssetFT(assetft::Msg::Burn {
            coin: cosmwasm_std::coin(new_burn_amount.u128(), &token.denom),
        });

        response = response
            .add_attribute("burn_amount", new_burn_amount)
            .add_message(burn_message);

        if new_burn_amount.lt(&burn_amount) {
            let refund_amount = burn_amount.sub(new_burn_amount);

            let refund_burn_rate_msg = cosmwasm_std::BankMsg::Send {
                to_address: sender.to_string(),
                amount: vec![Coin {
                    amount: refund_amount,
                    denom: token.denom.to_string(),
                }],
            };

            response = response
                .add_attribute("burn_rate_refund", refund_amount.to_string())
                .add_message(refund_burn_rate_msg);
        }
    }

    Ok(response)
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

#[entry_point]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> CoreumResult<ContractError> {
    // No state migrations performed, just returned a Response
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {}
}
