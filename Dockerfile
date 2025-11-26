# PHP 8.2 con FPM
FROM php:8.2-fpm

# Instalar extensiones necesarias para Laravel + SQLite
RUN apt-get update && apt-get install -y \
    zip unzip curl sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/html

# Comando por defecto
CMD ["php-fpm"]
