-- Run these commands in your PostgreSQL terminal (psql):

CREATE DATABASE callsquare;
CREATE USER callsquare_user WITH PASSWORD '123456789';
GRANT ALL PRIVILEGES ON DATABASE callsquare TO callsquare_user;
