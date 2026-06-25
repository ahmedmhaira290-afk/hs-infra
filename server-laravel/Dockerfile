FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libsqlite3-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql pdo_sqlite bcmath intl

COPY --from=composer/composer:2-bin /composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-interaction --optimize-autoloader --no-dev --no-scripts

COPY . .

RUN composer run post-autoload-dump --no-interaction 2>/dev/null; \
    php artisan key:generate --force

EXPOSE 9000

CMD php artisan serve --host=0.0.0.0 --port=$PORT
