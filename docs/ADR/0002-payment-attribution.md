# ADR 0002: Attribute an invoice to a unique receiving address

- Status: Accepted as the design target; payment implementation pending
- Date: 2026-10-25
- Decision owner: Mahdi Farshid

## Context

An ordinary ERC-20 `Transfer` event has sender, recipient, and value, but no invoice identifier. A
transaction hash supplied by a caller does not prove that the caller owns the transfer. If invoices
share a recipient address, two payments of the same amount can be ambiguous.

## Decision

The merchant provisions a distinct public receiving address for each invoice outside PayFreo and
supplies it to the Core. PayFreo stores public addresses only. It must never derive addresses from a
seed or hold a private key. The address reservation is permanent: an expired or cancelled invoice
does not release its address for another invoice. Reject invoice creation if the address was used
before for that merchant and chain, including invoices in terminal states.

This design allows a verified transfer to be matched to one invoice by destination. It does not
prove who funded the transfer. A payer field or wallet-connected checkout can add intent evidence,
but it cannot replace destination uniqueness. The future verifier must additionally check the
configured chain, token contract, exact atomic amount, receipt success, canonical block membership,
event identity, invoice timing, and sufficient confirmations. The database must atomically prevent
one `(chainId, transactionHash, logIndex)` event from settling more than one invoice. Underpayments,
overpayments, and late payments require explicit handling and cannot silently mark an invoice paid.

The initial merchant integration must either submit a previously unused public address or fail
invoice creation. Address generation and wallet management belong to the merchant's own systems.

## Alternatives considered

| Model                                   | Reason not selected for the first verifier                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Shared address plus signed payer intent | Requires extra proof and still leaves disputed or unprompted transfers ambiguous.                            |
| Invoice-identified payment contract     | Carries the invoice ID explicitly, but changes the direct-transfer model and needs separate contract review. |

## Consequences and review gate

- Merchants need an external address provisioning process and must keep access to every receiving
  address they issue.
- Receiving addresses can reveal invoice and merchant activity on a public chain; document this
  privacy cost in checkout guidance.
- This record authorizes a design direction, not a claim that attribution or settlement code exists.
- Before implementing payment endpoints, specify the API contract, address ownership policy, state
  transitions, expiry semantics, and deterministic negative and race tests.

## References

- [Core scope](0001-scope.md)
- [Threat model](../THREAT_MODEL.md)
