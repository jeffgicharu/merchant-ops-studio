# Quality Strategy

## Why these tests come first

Operations software tends to fail in workflow edges: the wrong state transition, stale context after an update, or an action that appears to succeed but leaves the UI inconsistent.

The first automated checks therefore focus on visible operator behavior rather than isolated implementation details.

## Current automated coverage

The repository includes integration-style UI tests for:

- overview rendering
- dispute status updates

These tests focus on user-visible behavior, not implementation details.

## Recommended next additions

- merchant filtering and detail-rail selection
- settlement hold and release actions
- risk assignment workflows
- accessibility checks on navigation and forms

## Manual verification worth adding

- responsive review on laptop and tablet breakpoints
- keyboard navigation across filters and action buttons
- empty, loading, and error-state review for each route
- cross-route consistency of status labels and color meaning

## CI

The CI workflow runs linting, tests, and the production build so regressions are caught automatically.
