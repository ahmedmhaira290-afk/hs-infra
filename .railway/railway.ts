import { defineRailway, preserve, project, service, postgres } from "railway/iac";

export default defineRailway(() => {
  const db = postgres("postgres");

  const api = service("backend", {
    rootDirectory: "server-laravel/",
    build: {
      builder: "nixpacks",
      nixpacksPlan: {
        providers: ["php", "node"],
        phases: {
          setup: {
            nixPkgs: ["php82", "php82Extensions.mbstring", "php82Extensions.pdo", "php82Extensions.pgsql", "php82Extensions.pdo_sqlite", "php82Extensions.fileinfo", "composer", "nodejs_22"],
          },
          install: {
            commands: [
              "composer install --no-interaction --optimize-autoloader --no-dev",
              "npm ci --prefix .. && npm run build --prefix .. && cp -r ../dist/* public/ 2>/dev/null; true",
            ],
          },
        },
      },
    },
    deploy: {
      startCommand: "php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT",
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
