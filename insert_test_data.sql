# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, first, last, email, hashedPassword) VALUES
  ('gold', 'Gold', 'Smiths', 'gold@gold.com', '$2b$10$/KZPUQ.nV0bvuwNbqC.M2OJT4a1Er0wkoGhLZYlBr8pXvFAWpLHcC');