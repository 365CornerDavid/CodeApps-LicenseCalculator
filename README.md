# Power Apps Code App

This repository contains a Power Apps Code App built with React, TypeScript, and Vite.

The project is intended for source control and team collaboration. Repository users can clone the codebase, restore dependencies locally, and run the application in their own development environment.

Project has been created after following Microsoft documentation: [Quickstart:Create a code app from scratch](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch).

## Licensing Calculator Application
The application is a Power Platform licensing cost calculator that compares User Assigned Licensing (UAL) and Pay-as-you-go (PAYG) models for Power Apps and Power Automate. It includes features such as:
* daily and cumulative cost comparisons, 
* monthly summaries, 
* cost breakdown charts

Project has been created just for demonstration purposes and is not intended for production use. It may contain simplified logic and hardcoded values to illustrate key concepts. Always refer to official Microsoft documentation for accurate licensing information and calculations.
#SharingIsCaring #PowerApps #CodeApps

## Prerequisites

Before working with this repository, make sure the following tools and access are available:

- Node.js LTS
- npm
- Git
- Visual Studio Code
- Power Platform environment with Code Apps enabled
- Power Platform CLI

> Note:
> Depending on your setup and the version of the Power Apps client library for code apps, some workflows may also use the newer npm-based CLI experience described in Microsoft documentation.

## Repository contents

This repository is expected to contain:

- application source code
- project configuration files
- `package.json`
- `package-lock.json`

This repository does **not** store local dependency folders such as:

- `node_modules`

Dependencies are restored locally after cloning the repository.

## Local setup
Go to folder were you want to create folder with the repo clone.
Open terminal from folder and execute:

## Clone the repository

```bash
git clone https://github.com/365CornerDavid/CodeApps-LicenseCalculator.git
cd CodeApps-LicenseCalculator
```

## Install dependencies

For a clean and repeatable installation, use:
```bash
npm ci
```
If needed, you can also use:
```bash
npm install
```
## Run the project locally

Start the development server:
```bash
npm run dev
```
## Build the project

Create a production build:
```bash
npm run build | pac code push
```
Lint the project

Run linting:
```bash
npm run lint
```
## Power Platform authentication

If your local workflow requires connection to a Power Platform environment, authenticate first and select the target environment.

Example:
```bash
pac auth create
pac env select --environment <ENVIRONMENT-ID>
```

Replace <ENVIRONMENT-ID> with the target Power Platform environment ID.
