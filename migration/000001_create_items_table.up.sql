CREATE TABLE IF NOT EXISTS items(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    qty SMALLINT,
    threshold SMALLINT,
    price BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
