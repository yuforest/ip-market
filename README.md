## Environment Variables Setup

1. Create a `.env` file in the root directory of the project from `.env.sample`

2. Set the following environment variables:

### DATABASE_URL

- This project uses PostgreSQL as its database
- You can use services like [Neon](https://neon.tech), [Supabase](https://supabase.com), or any PostgreSQL provider

### NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID, NEXT_DYNAMIC_BEARER_TOKEN

- Create/login to your account on [Dynamic](https://www.dynamic.xyz/)
- Create a new environment or select an existing one from the dashboard
- Obtain the environment ID and bearer token from the "API Keys" section on the environment details page

### PRIVATE_KEY

- Securely obtain the private key from your Web3 wallet (like MetaMask)
- **Warning**: Never share your private key publicly

### OPENAI_API_KEY

- Create/login to your account on [OpenAI](https://platform.openai.com/)
- Generate a new API key from the API key section

## Add tokens

### Seller

- Add ETH on Minato testnet to your wallet

### Buyer

- Add ETH and USDC on Minato testnet to your wallet

## Prepare DB

run `npm run db:migrate`

## Started Application

Run the development server:

```bash
npm run dev
```

## Drizzle commands

After changing `db/schema.ts`,
Run `npm run db:generate` (to generate migration files) and `npm run db:migrate` (to execute migrations) to reflect the schema changes in the database.
You can use `npm run db:studio` to operate the database through a GUI.
