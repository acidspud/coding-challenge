CREATE TABLE IF NOT EXISTS users(
    id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

INSERT INTO users(
    id, 
    email, 
    "password", 
    created_at, 
    updated_at
) VALUES(
    1, 
    'test@gmail.com', 
    '$2a$04$5JR8wz0DklaLTosSHE6vT.0vjApvfxqr9V9EH5fN1sKBL2iqzdimG', 
    '2023-07-07 11:09:54.490', 
    '2023-07-07 11:09:54.490'
);
