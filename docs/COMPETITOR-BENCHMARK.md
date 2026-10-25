# Self-hosted payment project comparison

**Research date:** 2026-10-25. This is a documentation comparison, not a measured deployment
benchmark. No competitor installation, throughput test, cost measurement, or security audit was run.
Features may differ by version and deployment configuration; verify them again before making public
comparative claims.

| Project       | Verified documentation                                                                                                                                                                                                                   | Relationship to PayFreo's proposed scope                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| BTCPay Server | [Developer documentation](https://docs.btcpayserver.org/Developers/) describes a REST API and plugin architecture; [architecture documentation](https://docs.btcpayserver.org/Development/) describes self-hosted deployment components. | An established self-hosted payment system with a broader ecosystem. PayFreo must not claim to be the first self-hosted processor.            |
| Bitcart       | [Introduction](https://docs.bitcart.ai/) describes self-hosting, an API/SDK, and fresh invoice addresses.                                                                                                                                | Unique invoice addresses are established practice, not a PayFreo invention.                                                                  |
| PayRam        | [Introduction](https://docs.payram.com/) describes a self-hosted stablecoin and cryptocurrency payment stack; [payment API documentation](https://docs.payram.com/features/payment-apis) describes API keys and webhooks.                | Stablecoin payment APIs and self-hosting already exist; PayFreo's narrow receive-only Core is a design hypothesis, not a measured advantage. |

## Reproducible benchmark still needed

For each project, record the exact version or commit, operating system, machine resources, database
and chain configuration, installation commands, elapsed setup time, idle and load resource use, test
payment scenario, and any failures. Run the same scenario for PayFreo when a verified testnet
payment exists. Until then, avoid speed, cost, security, or setup-time comparisons.
