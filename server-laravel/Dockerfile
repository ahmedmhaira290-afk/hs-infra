FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev libonig-dev libzip-dev zip unzip curl git \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080
