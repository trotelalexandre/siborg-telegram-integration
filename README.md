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
CHAIN_ID=8453
TEST_ENV=true // for testing purposes
BASE_URL="https://app.dsponsor.com"
WEBHOOK_URL="https://siborg-telegram-integration.vercel.app/api/main"
```

## Repository Architecture

This repository follows a modular architecture, dividing functionality into different folders and files for better organization and maintainability.

### Directory Structure

- **api/commands**: Contains command handlers that define the actions to be taken when specific bot commands are issued.

  - **api/commands/suggest**: Command suggestions or recommendations.
  - **api/commands/test**: Test commands used primarily in a testing environment to verify bot functionalities.

- **api/cron-task**: Contains scheduled tasks using cron jobs. This directory is used for scheduling recurring bot actions, such as fetching and displaying ads at regular intervals.

- **api/handlers**: Contains message and event handlers that process incoming messages and events from the bot. It is responsible for the logic behind different user interactions.

- **api/menus**: Defines interactive menus that the bot presents to users. This directory contains different menu configurations to handle various user actions and settings.

- **api/relayer**: Handles external API calls and integrations. This module is responsible for relaying data between the bot and external services, such as fetching ads or managing offers.

- **api/states**: Contains shared state variables and functions to manage the bot's state. This module ensures consistency across different parts of the application.

- **api/types**: Defines TypeScript types and interfaces used throughout the application for type safety and code clarity.

- **api/utils**: Utility functions and helpers that are used across various modules. These functions provide common functionality that can be reused.

### Main Files

- **bot.ts**: This file initializes and configures the bot instance using the `grammy` library. It sets up middleware, command handlers, and starts the bot.

- **env.ts**: A module to load and manage environment variables, ensuring they are accessible throughout the application.

- **main.ts**: The entry point of the application. It imports various components (commands, menus, handlers, etc.), initializes them, and starts the bot. It also handles global state variables and catches errors for robust error handling.

## How to Run

1. Clone the repository.
2. Install the necessary dependencies using `pnpm install`.
3. Set up your `.env` file with the appropriate configuration values.
4. Run the bot using `pnpm start`.
