use cw_storage_plus::Item;

pub const DENOM: Item<String> = Item::new("state");
pub const PARENT_DENOM: Item<String> = Item::new("parent_denom");
