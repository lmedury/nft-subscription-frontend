export const APPROVAL_PROGRAM = `#pragma version 6
txn ApplicationID
int 0
==
bnz main_l20
txn OnCompletion
int OptIn
==
bnz main_l19
txn OnCompletion
int UpdateApplication
==
bnz main_l18
txn OnCompletion
int DeleteApplication
==
bnz main_l17
txn OnCompletion
int CloseOut
==
bnz main_l16
txn OnCompletion
int ClearState
==
bnz main_l15
txna ApplicationArgs 0
byte "update_global_state"
==
bnz main_l14
txna ApplicationArgs 0
byte "subscribe"
==
bnz main_l13
txna ApplicationArgs 0
byte "accept_nft"
==
bnz main_l12
txna ApplicationArgs 0
byte "destroy_nft"
==
bnz main_l11
err
main_l11:
int 1
byte "expiry"
app_local_get
global LatestTimestamp
<
assert
txna Assets 0
int 1
byte "asset_id"
app_local_get
==
assert
itxn_begin
int acfg
itxn_field TypeEnum
txna Assets 0
itxn_field ConfigAsset
global CurrentApplicationAddress
itxn_field ConfigAssetClawback
global CurrentApplicationAddress
itxn_field ConfigAssetManager
itxn_next
int axfer
itxn_field TypeEnum
txna Accounts 1
itxn_field AssetSender
int 10
itxn_field AssetAmount
global CurrentApplicationAddress
itxn_field AssetReceiver
txna Assets 0
itxn_field XferAsset
itxn_next
int acfg
itxn_field TypeEnum
txna Assets 0
itxn_field ConfigAsset
itxn_submit
int 1
return
main_l12:
int 0
byte "accepted"
app_local_get
int 0
==
assert
txna Assets 0
int 0
byte "asset_id"
app_local_get
==
assert
itxn_begin
int axfer
itxn_field TypeEnum
txn Sender
itxn_field AssetReceiver
int 10
itxn_field AssetAmount
txna Assets 0
itxn_field XferAsset
itxn_submit
int 0
byte "accepted"
int 1
app_local_put
int 1
return
main_l13:
global GroupSize
int 2
==
assert
gtxn 0 Receiver
byte "receiver_address"
app_global_get
==
assert
gtxn 0 Amount
txna ApplicationArgs 1
btoi
byte "subscription_price"
app_global_get
*
==
assert
gtxn 0 TypeEnum
int pay
==
assert
gtxn 1 TypeEnum
int appl
==
assert
gtxn 1 Sender
gtxn 0 Sender
==
assert
itxn_begin
int acfg
itxn_field TypeEnum
int 10
itxn_field ConfigAssetTotal
int 1
itxn_field ConfigAssetDecimals
byte "unit_name"
app_global_get
itxn_field ConfigAssetUnitName
byte "asset_name"
app_global_get
itxn_field ConfigAssetName
byte "asset_url"
app_global_get
itxn_field ConfigAssetURL
global CurrentApplicationAddress
itxn_field ConfigAssetManager
txn Sender
itxn_field ConfigAssetClawback
itxn_submit
int 0
byte "asset_id"
itxn CreatedAssetID
app_local_put
int 0
byte "expiry"
global LatestTimestamp
txna ApplicationArgs 1
btoi
byte "duration"
app_global_get
*
+
app_local_put
int 0
byte "accepted"
int 0
app_local_put
int 1
return
main_l14:
txn Sender
global CreatorAddress
==
assert
txna ApplicationArgs 1
txna ApplicationArgs 2
app_global_put
int 1
return
main_l15:
int 0
return
main_l16:
int 0
return
main_l17:
txn Sender
global CreatorAddress
==
assert
int 1
return
main_l18:
txn Sender
global CreatorAddress
==
assert
int 1
return
main_l19:
int 1
return
main_l20:
byte "unit_name"
txna ApplicationArgs 0
app_global_put
byte "asset_name"
txna ApplicationArgs 1
app_global_put
byte "asset_url"
txna ApplicationArgs 2
app_global_put
byte "subscription_price"
txna ApplicationArgs 3
btoi
app_global_put
byte "duration"
txna ApplicationArgs 4
btoi
app_global_put
byte "receiver_address"
txna Accounts 1
app_global_put
int 1
return`