import { ERC721Transfer } from "./generated/schema";

import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent,
} from "./generated/erc721/IERC721";

import { events, transactions } from "@amxx/graphprotocol-utils";

import { fetchAccount } from "@openzeppelin/subgraphs/src/fetch/account";

import {
  fetchERC721,
  fetchERC721Token,
  fetchERC721Operator,
} from "@openzeppelin/subgraphs/src/fetch/erc721";

export function handleTransfer(event: TransferEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchERC721Token(contract, event.params.tokenId);
    let from = fetchAccount(event.params.from);
    let to = fetchAccount(event.params.to);

    token.owner = to.id;

    contract.save();
    token.save();

    let ev = new ERC721Transfer(events.id(event));
    ev.transaction = transactions.log(event).id;
    ev.timestamp = event.block.timestamp;
    ev.contract = contract.id;
    ev.token = token.id;
    ev.from = from.id;
    ev.to = to.id;
    ev.save();
  }
}
