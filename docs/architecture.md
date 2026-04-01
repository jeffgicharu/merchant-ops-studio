# Architecture Notes

## Context

Merchant operations sits at the intersection of support, risk, treasury, and account management. The core problem is not a lack of raw data. It is that the data, workflows, and decisions are spread across too many systems.

This frontend is structured as a unified operating surface where teams can move from signal to decision without losing context.

## Design goals

- show the health of the merchant base at a glance
- keep queues and detail views close together
- make workflow state changes obvious and low-friction
- keep the frontend easy to connect to a real backend later
- preserve a consistent visual language across different operational domains

## Folder structure

- `src/app`: router and provider setup
- `src/components`: reusable layout, chart, and UI primitives
- `src/data`: seed data used to bootstrap the local scenario
- `src/features`: route-level feature modules
- `src/lib`: typed domain models, selectors, formatting helpers, and the mock client
- `src/styles`: global styles and design tokens

## Thought process behind the state layer

`OpsDataProvider` is the boundary between the UI and the data layer. It handles:

- initial snapshot loading
- workflow actions
- banner/error feedback
- data refresh after actions

The intent was to keep route components focused on presentation, filtering, and operator actions rather than fetch orchestration. For the current scope, a typed context layer is enough. It keeps the architecture simple without introducing a heavier global state library too early.

## Why the data client is mocked first

The app uses a local mock client so the repository can be run without a backend. That client mirrors REST-like operations:

- `loadSnapshot`
- `updateDisputeStatus`
- `updateRiskCase`
- `updateSettlementStatus`
- `resetSnapshot`

This was a deliberate product decision:

- it allows the workflow and information architecture to be validated first
- it makes the project runnable in isolation
- it keeps integration concerns localized

Swapping to a real API should mostly involve replacing `src/lib/merchantOpsClient.ts`.

## Tradeoffs

- `localStorage` persistence is good for a self-contained environment but does not model multi-user consistency
- the seeded dataset gives realistic operational context but is still a fixed scenario
- there is no authentication or server authorization layer yet because the current focus is workflow design
