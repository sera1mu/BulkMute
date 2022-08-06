# BulkMute

The simple Discord bot to toggle server mute for all users in a voice channel at once.

## Usage

- `/about` :: Show about BulkMute bot
- `/bulkmute` :: Toggle server mute for all users in a voice channel. (You should join some voice channel before.)

## Selfhosting

**Dependencies:**

- deno
- git
- Discord Account

You need to create your bot from
[Discord Developer Portal](https://discord.com/developers/applications) before
hosting.

1. Clone repository

```
git clone https://github.com/sera1mu/BulkMute.git
cd BulkMute
git switch main
```

2. Set your bot token to environment variable `BM_TOKEN`

```
BM_TOKEN=YOUR_BOT_TOKEN
```

3. Cache modules

```
deno cache src/boot.ts
```

4. Start

```
deno task start
```

## License

[MIT (c) 2022 Seraimu](https://github.com/sera1mu/bulkmute/blob/main/LICENSE)
