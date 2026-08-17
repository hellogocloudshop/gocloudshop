# CLAUDE.md — GoCloudShop

Persistent instructions for Claude Code sessions working in this repository.
For architecture/coding conventions (stack, data flow, pricing rules,
migrations, auth, Telegram), see `AGENTS.md` — this file does not repeat
those; it defines the **Git/GitHub workflow** that applies to every task in
this project, permanently, unless the user explicitly says otherwise for a
specific task.

## Repository

- GitHub: `https://github.com/hellogocloudshop/gocloudshop.git`
- Branch: `main`
- Remote: `origin`

## Default workflow for every task

Whenever asked to create, modify, fix, update, refactor, improve, configure,
or otherwise change anything in this project — including short requests like
"update…", "fix…", "add…", "remove…", "design…", "improve…", "integrate…",
"configure…" — the completion of that task includes committing and pushing
it. Do not wait to be told to push; do not just say "you should run git
push" — actually run it, then report the result.

1. Work directly inside the existing project. Do not rebuild from scratch,
   do not create duplicate architectures/files, preserve the existing
   production setup unless a change is genuinely required by the task.
2. After the code change is complete, inspect the full `git status` and
   review the actual diff (`git diff --stat`, then `git diff`) before
   staging anything.
3. Run whatever validation applies and exists in `package.json` —
   typically `npx tsc --noEmit`, `npm run lint`, `npm run build`. Fix any
   failure caused by the change before committing.
4. Stage **only** the files that belong to the current task
   (`git add <specific files>`, never a blind `git add .` / `git add -A`
   when unrelated changes might be sitting in the working tree from
   something else). If the working tree contains changes this task didn't
   make, leave them alone — don't stage, commit, or discard them.
5. Before committing, verify no secrets are staged: no `.env`, `.env.local`,
   `.env.production`, API keys, NOWPayments API key/IPN secret, Supabase
   service-role key, database passwords, or other credentials. Confirm
   `.gitignore` still excludes them.
6. Commit with a clear, specific message describing the actual change (not
   a generic placeholder).
7. Push: `git push origin main` (or `git push -u origin main` if upstream
   tracking isn't set — it normally is).
8. Verify the push: `git status`, `git log -1 --oneline`, `git branch -vv`,
   and confirm the local commit hash matches `origin/main`.
9. Report: what changed, validation result, commit hash, confirmation
   `origin/main` was updated.

If a task genuinely produces no file changes (e.g. an audit that finds
everything already correct), skip the commit — never create an empty or
placeholder commit just to have something to push.

## Hard rules

- **Never** commit `.env`, `.env.local`, `.env.production`, or any file
  containing real secret values.
- **Never** commit NOWPayments API keys, the NOWPayments IPN secret,
  Supabase service-role keys, database passwords, or any other credential.
- **Never** put a secret in a `NEXT_PUBLIC_*` variable, client bundle, log
  line, commit message, or this file.
- **Never** print/echo a real secret value in terminal output or in a
  response to the user — not even partially.
- **Never** force-push (`--force` / `--force-with-lease`), reset `main`'s
  history, or delete the branch, without the user explicitly asking for that
  specific action in that specific message.
- **Never** switch git remotes/accounts or change GitHub authentication
  without the user's explicit permission.

## If the push fails

Do not report success. Read the actual error and explain it plainly:

- **Auth/permission error** — state that GitHub authentication or write
  access needs attention; don't attempt to switch accounts unprompted.
- **Non-fast-forward / remote has commits not present locally** — run
  `git fetch origin` and inspect before doing anything else; do not force
  push; explain what's diverged and ask how to proceed.
- **Merge conflict** — stop and explain the conflict clearly rather than
  overwriting either side.

## Notes specific to this project

- Ordering is via "Order via Telegram" buttons (see `TelegramOrderButton.tsx`
  and `src/lib/telegram.ts`) — every order/lead is captured in the `orders`
  table (via `createOrder()`, `src/lib/actions/orders.ts`) before the
  Telegram deep link opens.
- Database migrations for this project live in `supabase/migrations/*.sql`,
  numbered sequentially — never edit an already-shipped migration, add a new
  one. Migrations are committed to Git but are **not** applied to the live
  database by a `git push` — that's always a separate, manual step the user
  runs against their real Supabase project.
