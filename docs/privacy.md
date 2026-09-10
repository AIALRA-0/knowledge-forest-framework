# Privacy

The public demo uses browser-local storage for progress, activity summaries, theme preference, and feedback

The framework contains no telemetry, analytics, advertising, or remote progress sync

Clearing the site's browser storage removes these local demo records. Raw event identifiers, identity fields, and private payloads are not displayed by the learning statistics interface

An instance may add a storage adapter; it must document data purpose, retention, deletion, access control, export, and migration

Do not commit:

- learner identity or personal history without explicit intent
- private progress
- emails, local usernames, paths, hosts, or addresses
- credentials, tokens, cookies, certificates, or authentication configuration
- private research caches or restricted course files

Run the sanitization audit before every public release
