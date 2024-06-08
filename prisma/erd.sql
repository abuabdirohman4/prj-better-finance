-- Table: clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Table: categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id),
    name VARCHAR(255) NOT NULL
);

-- Table: category_groups
CREATE TABLE category_groups (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id),
    name VARCHAR(255) NOT NULL
);

-- Table: category_group_membership
CREATE TABLE category_group_membership (
    category_id INT REFERENCES categories(id),
    group_id INT REFERENCES category_groups(id),
    PRIMARY KEY (category_id, group_id)
);

-- Table: monthly_category_budgets
CREATE TABLE monthly_category_budgets (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    client_id INT REFERENCES clients(id),
    year INT NOT NULL,
    month INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    UNIQUE (category_id, client_id, year, month)
);

-- Table: transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    client_id INT REFERENCES clients(id),
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL
);
