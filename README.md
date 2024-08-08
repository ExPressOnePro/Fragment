# Online Shop

This is an online shop application built with Laravel for the backend and React for the frontend. The application allows users to browse products, read reviews, and make purchases.

## Features

- User authentication and authorization
- Product listing with categories and subcategories
- Product search functionality
- Product reviews with ratings
- Top-rated products display
- Add to cart functionality
- Filter products by rating and category

## Installation

### Prerequisites

- PHP >= 7.4
- Composer
- Node.js >= 12.x
- NPM or Yarn
- MySQL or any other supported database

### Steps

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/online-shop.git
    cd online-shop
    ```

2. Install backend dependencies:

    ```sh
    composer install
    ```

3. Install frontend dependencies:

    ```sh
    npm install
    ```

4. Create a copy of the `.env` file:

    ```sh
    cp .env.example .env
    ```

5. Generate the application key:

    ```sh
    php artisan key:generate
    ```

6. Set up your database in the `.env` file and run migrations with seeders:

    ```sh
    php artisan migrate --seed
    ```

7. Build the frontend assets:

    ```sh
    npm run dev
    ```

8. Start the local development server:

    ```sh
    php artisan serve
    ```

## Running Tests

The project includes both unit and feature tests. To run the tests, use the following command:

```sh
php artisan test
