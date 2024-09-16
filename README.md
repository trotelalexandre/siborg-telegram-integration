# siborg-telegram-integration

## Table of contents

<!-- TOC -->

- [siborg-telegram-integration](#siborg-telegram-integration)
  - [Table of contents](#table-of-contents)
  - [Configuration](#configuration)
    - [Example](#example)
  - [Repository Architecture](#repository-architecture)
    - [Directory Structure](#directory-structure)
    - [Main Files](#main-files)
  - [How to Run](#how-to-run)

## Configuration

Please add the Telegram Bot Token in the `.env` file.

### Example

```env
TELEGRAM_BOT_TOKEN="[YOURTOKEN]"
CHAIN_ID="8453"
TEST_ENV="true" // for testing purposes
BASE_URL="https://app.dsponsor.com"
WEBHOOK_URL="https://siborg-telegram-integration-737j.vercel.app/api/main"
THIRDWEB_PRIVATE_KEY=[YOUR_KEY]
```

## Repository Architecture

This repository follows a modular architecture, dividing functionality into different folders and files for better organization and maintainability.

### Directory Structure

- **src/commands**: Contains command handlers that define the actions to be taken when specific bot commands are issued.

  - **src/commands/suggest**: Command suggestions or recommendations.
  - **src/commands/test**: Test commands used primarily in a testing environment to verify bot functionalities.

- **api**: Contains scheduled tasks using cron jobs. This directory is used for scheduling recurring bot actions, such as fetching and displaying ads at regular intervals. It is the API of the application that can be triggered by Vercel Cron Jobs.

- **src/menus**: Defines interactive menus that the bot presents to users. This directory contains different menu configurations to handle various user actions and settings.

- **src/relayer**: Handles external API calls and integrations. This module is responsible for relaying data between the bot and external services, such as fetching ads or managing offers.

- **src/types**: Defines TypeScript types and interfaces used throughout the application for type safety and code clarity.

- **src/utils**: Utility functions and helpers that are used across various modules. These functions provide common functionality that can be reused.

### Main Files

- **src/bot.ts**: This file initializes and configures the bot instance using the `grammy` library. It sets up middleware, command handlers, and starts the bot.

- **src/env.ts**: A module to load and manage environment variables, ensuring they are accessible throughout the application.

- **api/main.ts**: The entry point of the application. It starts the bot using the Webhook connection mode. See Grammy docs for more details.

- **vercel.json**: This file allows to configure the Vercel Cron Jobs. You can set the path to the api functions and the frequency.

## How to Run

1. Clone the repository.
2. Install the necessary dependencies using `pnpm install`.
3. Set up your `.env` file with the appropriate configuration values.
4. Run the bot using `pnpm start`.
