# BulkMute

The simple Discord bot to toggle server mute for all users in a voice channel at
once.

<details>
<summary>Show demo</summary>

![demo](https://user-images.githubusercontent.com/79352785/183247225-2fba2b7d-858a-4efc-aca7-9a075d46413b.gif)

</details>

## Usage

- `/about` :: Show about BulkMute bot
- `/bulkmute [mute?: boolean]` :: Toggle server mute for all users in a voice channel. (You
  should join some voice channel before.)
  
  **Example:** 
    * `/bulkmute` :: Toggle server mute
    * `/bulkmute True` :: Force mute
    * `/bulkmute False` :: Force unmute

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

[MIT &copy; 2022 Seraimu](https://github.com/sera1mu/bulkmute/blob/main/LICENSE)
