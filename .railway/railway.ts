import { defineRailway, preserve, project, service, postgres } from "railway/iac";

export default defineRailway(() => {
  const db = postgres("postgres");

  const api = service("backend", {
    rootDirectory: "server-laravel/",
    build: {
      builder: "nixpacks",
      nixpacksPlan: {
        providers: ["php", "node"],
      },
    },
    deploy: {
      startCommand: "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    },
    env: {
      APP_ENV: "production",
      APP_DEBUG: "false",
      APP_KEY: preserve(),
      DB_CONNECTION: "pgsql",
      DB_HOST: db.env.PGHOST,
      DB_PORT: db.env.PGPORT,
      DB_DATABASE: db.env.PGDATABASE,
      DB_USERNAME: db.env.PGUSER,
      DB_PASSWORD: db.env.PGPASSWORD,
      CACHE_STORE: "array",
      SESSION_DRIVER: "file",
      LOG_LEVEL: "debug",
    },
  });

  return project("hs-infra", {
    resources: [db, api],
  });
});
