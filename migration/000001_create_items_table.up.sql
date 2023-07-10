CREATE TABLE IF NOT EXISTS items(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    qty SMALLINT,
    threshold SMALLINT,
    price BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

INSERT INTO items
(id, "name", qty, threshold, price, created_at, updated_at)
VALUES(1, 'ItemA', 11, 9, 2099, '2023-07-10 13:01:07.264', '2023-07-10 13:36:16.891');
INSERT INTO items
(id, "name", qty, threshold, price, created_at, updated_at)
VALUES(4, 'ItemD', 10, 9, 22200, '2023-07-09 19:20:18.213', '2023-07-10 13:37:03.356');
INSERT INTO items
(id, "name", qty, threshold, price, created_at, updated_at)
VALUES(5, 'ItemE', 10, 9, 2250, '2023-07-10 13:01:53.827', '2023-07-10 13:37:46.457');
INSERT INTO items
(id, "name", qty, threshold, price, created_at, updated_at)
VALUES(2, 'ItemB', 7, 9, 2099, '2023-07-10 13:02:48.946', '2023-07-10 13:38:40.871');
INSERT INTO items
(id, "name", qty, threshold, price, created_at, updated_at)
VALUES(3, 'ItemC', 9, 9, 30000000, '2023-07-09 19:19:31.292', '2023-07-10 13:41:02.873');
