INSERT INTO users (id, name, email, password) 
VALUES (1, 'Andrew', 'andrewzapotochny@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
(2, 'Mike', 'mike@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
(3, 'Reid', 'reid@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) 
VALUES (1, 1, 'Property 1', 'Description', 'www.google.com', 'www.google.com', 100, 1, 2, 2, 'Canada', 'King', 'Toronto', 'Ontario', 'ABC345'),
(2, 2, 'Property 2', 'Description', 'www.google.com', 'www.google.com', 100, 1, 2, 2, 'Canada', 'King', 'Toronto', 'Ontario', 'ABC345'), 
(3, 3, 'Property 3', 'Description', 'www.google.com', 'www.google.com', 100, 1, 2, 2, 'Canada', 'King', 'Toronto', 'Ontario', 'ABC345');

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) 
VALUES (1,'2018-09-11', '2018-09-26',1, 1),
(2, '2019-01-04', '2019-02-01', 2, 2),
(3, '2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1, 1, 5, 'Good thanks'),
(2, 2, 2, 2, 5, 'Awesome thanks'),
(3, 3, 3, 3, 4, 'Ok thanks');