-- Create blogs database
CREATE TABLE blogs (
    id serial primary key,
    author text,
    url text not null,
    title text not null,
    likes int default 0
);
-- Insert two blogs to the database
INSERT INTO blogs (author, url, title, likes) 
VALUES ('Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 5);
INSERT INTO blogs (author, url, title, likes)
VALUES ('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 7);