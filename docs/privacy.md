# Privacy

The public demo uses browser-local storage for progress and feedback

The framework contains no telemetry, analytics, advertising, or remote progress sync

An instance may add a storage adapter; it must document data purpose, retention, deletion, access control, export, and migration

Do not commit:

- learner identity or personal history without explicit intent
- private progress
- emails, local usernames, paths, hosts, or addresses
- credentials, tokens, cookies, certificates, or authentication configuration
- private research caches or restricted course files

Run the sanitization audit before every public release
