# Cinema Web App Frontend

## Setup

This project use yarn as package manager. If you don't have yarn installed, you can install it by running:

```bash
npm install -g yarn
```

### Install dependencies

```bash
yarn install
```

### Setup third party services

This project uses Google Maps and Paypal services. You need to setup the following services:

- [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Paypal](https://developer.paypal.com/docs/checkout/)

### Environment variables

Go to src/utils/config.ts and setup the following variables:

**GOOGLE_MAP_API_KEY**: Google Maps API key to use the map component.
Example: `export const GOOGLE_MAP_API_KEY = google_maps_api_key;`
**PAYPAL_CLIENT_ID**: Paypal client id to use the paypal payment component.
Example: `export const PAYPAL_CLIENT_ID = paypal_client_id;`

## Running the app

```bash
# Start the app in development mode
$ yarn start

# Build the app for production
$ yarn build

# Run the app in production mode
$ yarn start:prod
```
