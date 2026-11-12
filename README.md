# NFL Cairo Weekly Hub

This is a new, honest automatic version. It updates schedule, Cairo kickoff time, median spread, total, market favorite, no-vig market confidence and best-game ranking.

## Setup
1. Create a GitHub repository and upload all files, preserving folders.
2. In repository Settings > Secrets and variables > Actions, add `ODDS_API_KEY`.
3. Get the key from The Odds API.
4. Open Actions > Update NFL weekly hub > Run workflow.
5. Enable GitHub Pages: Settings > Pages > Deploy from branch > main / root.

## Schedule
The workflow refreshes Thursday, Saturday and Sunday. Cron runs in UTC. Cairo display conversion is handled in the browser with `Africa/Cairo`, including daylight-saving changes.

## What is automatic
- upcoming NFL games
- kickoff times in Cairo
- median US-book spread and total
- normalized market favorite probability
- bookmaker count
- best-game ranking and filters

## What is not faked
The site does not automatically scrape prediction articles and call them “models.” To add editorial picks later, use licensed feeds or a manual `data/editorial.json` file with source attribution.
