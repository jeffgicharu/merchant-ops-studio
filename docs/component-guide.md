# UI System Notes

## Design principles

The UI is meant for operators working through live queues, not for casual browsing. That drove a few design choices:

- dense layouts over oversized decorative spacing
- strong hierarchy so critical states stand out quickly
- repeated action patterns so each module feels familiar
- status colors used for meaning, not decoration

## Shared primitives

The app intentionally uses a small component system:

- `Badge`: status chips for risk, health, and workflow states
- `Button`: shared action styles for primary, secondary, and ghost actions
- `Panel`: card container with consistent padding, borders, and accent treatment
- `MetricCard`: KPI presentation component
- `PageHeader`: shared page intro layout
- `DataTable`: typed generic table used across business modules

## Why these components were extracted

The goal was not to abstract everything. Components were extracted only where the same operational pattern appeared in multiple places. For example:

- status badges are reused across disputes, merchants, risk, and settlements
- panels provide a common structural container for dense information
- the generic table supports queue-style screens without duplicating markup

This keeps the interface consistent while avoiding unnecessary indirection.

## Design direction

The visual direction avoids the common generic dashboard look. It uses:

- a warm editorial background instead of flat white
- a dark navigation rail for contrast
- display typography for hierarchy
- restrained accent colors for state and emphasis

The intention was to make the workspace feel like a purposeful internal product rather than a generated admin template.
