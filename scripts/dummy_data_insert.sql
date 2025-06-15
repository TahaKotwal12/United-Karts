-- ====================================================================
-- DUMMY DATA INSERTION SCRIPT
-- ====================================================================

-- Insert sample users (customers, restaurant owners, delivery partners, admin)
INSERT INTO core_mstr_united_kart_users (email, phone, password_hash, first_name, last_name, role, status, email_verified, phone_verified) VALUES
-- Admin
('admin@unitedkart.com', '9999999999', 'hashed_password_1', 'Admin', 'User', 'admin', 'active', true, true),
-- Restaurant Owners
('restaurant1@example.com', '8888888888', 'hashed_password_2', 'John', 'Smith', 'restaurant_owner', 'active', true, true),
('restaurant2@example.com', '7777777777', 'hashed_password_3', 'Sarah', 'Johnson', 'restaurant_owner', 'active', true, true),
-- Delivery Partners
('delivery1@example.com', '6666666666', 'hashed_password_4', 'Mike', 'Brown', 'delivery_partner', 'active', true, true),
('delivery2@example.com', '5555555555', 'hashed_password_5', 'Lisa', 'Davis', 'delivery_partner', 'active', true, true),
-- Customers
('customer1@example.com', '4444444444', 'hashed_password_6', 'Alex', 'Wilson', 'customer', 'active', true, true),
('customer2@example.com', '3333333333', 'hashed_password_7', 'Emma', 'Taylor', 'customer', 'active', true, true);

-- Insert sample addresses
INSERT INTO core_mstr_united_kart_addresses (user_id, title, address_line1, address_line2, city, state, postal_code, latitude, longitude, is_default) VALUES
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'customer1@example.com'), 'Home', '123 Main St', 'Apt 4B', 'New York', 'NY', '10001', 40.7128, -74.0060, true),
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'customer2@example.com'), 'Office', '456 Business Ave', 'Suite 200', 'New York', 'NY', '10002', 40.7142, -74.0064, true);

-- Insert sample restaurants
INSERT INTO core_mstr_united_kart_restaurants (owner_id, name, description, phone, email, address_line1, city, state, postal_code, latitude, longitude, cuisine_type, avg_delivery_time, min_order_amount, delivery_fee, status) VALUES
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'restaurant1@example.com'), 
'Pizza Paradise', 'Best pizza in town', '1111111111', 'pizza@paradise.com', '789 Food St', 'New York', 'NY', '10003', 40.7150, -74.0068, 'Italian', 30, 15.00, 3.00, 'active'),
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'restaurant2@example.com'), 
'Sushi Master', 'Fresh and authentic Japanese cuisine', '2222222222', 'sushi@master.com', '321 Asian Ave', 'New York', 'NY', '10004', 40.7160, -74.0070, 'Japanese', 25, 20.00, 4.00, 'active');

-- Insert sample food items
INSERT INTO core_mstr_united_kart_food_items (restaurant_id, category_id, name, description, price, discount_price, is_veg, status) VALUES
-- Pizza Paradise items
((SELECT core_mstr_united_kart_restaurants_id FROM core_mstr_united_kart_restaurants WHERE name = 'Pizza Paradise'),
(SELECT core_mstr_united_kart_categories_id FROM core_mstr_united_kart_categories WHERE name = 'Main Course'),
'Margherita Pizza', 'Classic tomato and mozzarella pizza', 12.99, 10.99, true, 'available'),
((SELECT core_mstr_united_kart_restaurants_id FROM core_mstr_united_kart_restaurants WHERE name = 'Pizza Paradise'),
(SELECT core_mstr_united_kart_categories_id FROM core_mstr_united_kart_categories WHERE name = 'Main Course'),
'Pepperoni Pizza', 'Classic pepperoni pizza', 14.99, 12.99, false, 'available'),
-- Sushi Master items
((SELECT core_mstr_united_kart_restaurants_id FROM core_mstr_united_kart_restaurants WHERE name = 'Sushi Master'),
(SELECT core_mstr_united_kart_categories_id FROM core_mstr_united_kart_categories WHERE name = 'Main Course'),
'California Roll', 'Crab, avocado, and cucumber roll', 8.99, NULL, false, 'available'),
((SELECT core_mstr_united_kart_restaurants_id FROM core_mstr_united_kart_restaurants WHERE name = 'Sushi Master'),
(SELECT core_mstr_united_kart_categories_id FROM core_mstr_united_kart_categories WHERE name = 'Main Course'),
'Vegetable Roll', 'Fresh vegetables roll', 7.99, 6.99, true, 'available');

-- Insert sample food variants
INSERT INTO core_mstr_united_kart_food_variants (food_item_id, name, price_adjustment, is_default) VALUES
((SELECT core_mstr_united_kart_food_items_id FROM core_mstr_united_kart_food_items WHERE name = 'Margherita Pizza'),
'Small', -2.00, false),
((SELECT core_mstr_united_kart_food_items_id FROM core_mstr_united_kart_food_items WHERE name = 'Margherita Pizza'),
'Large', 2.00, false),
((SELECT core_mstr_united_kart_food_items_id FROM core_mstr_united_kart_food_items WHERE name = 'Margherita Pizza'),
'Medium', 0.00, true);

-- Insert sample delivery partners
INSERT INTO core_mstr_united_kart_delivery_partners (user_id, vehicle_type, vehicle_number, license_number, availability_status) VALUES
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'delivery1@example.com'),
'bicycle', 'BIKE-001', 'LIC-001', 'available'),
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'delivery2@example.com'),
'motorcycle', 'BIKE-002', 'LIC-002', 'available');

-- Insert sample coupons
INSERT INTO core_mstr_united_kart_coupons (code, title, description, coupon_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_from, valid_until) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 20.00, 50.00, 1, CURRENT_TIMESTAMP, DATEADD(day, 30, CURRENT_TIMESTAMP)),
('FLAT20', 'Flat Discount', 'Get $20 off on orders above $100', 'fixed_amount', 20.00, 100.00, 20.00, 1, CURRENT_TIMESTAMP, DATEADD(day, 30, CURRENT_TIMESTAMP));

-- Insert sample orders
INSERT INTO core_mstr_united_kart_orders (customer_id, restaurant_id, delivery_partner_id, delivery_address_id, order_number, subtotal, tax_amount, delivery_fee, total_amount, payment_method, payment_status, order_status) VALUES
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'customer1@example.com'),
(SELECT core_mstr_united_kart_restaurants_id FROM core_mstr_united_kart_restaurants WHERE name = 'Pizza Paradise'),
(SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'delivery1@example.com'),
(SELECT core_mstr_united_kart_addresses_id FROM core_mstr_united_kart_addresses WHERE user_id = (SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'customer1@example.com')),
'ORD-001', 25.98, 2.60, 3.00, 31.58, 'card', 'paid', 'delivered');

-- Insert sample order items
INSERT INTO core_mstr_united_kart_order_items (order_id, food_item_id, variant_id, quantity, unit_price, total_price) VALUES
((SELECT core_mstr_united_kart_orders_id FROM core_mstr_united_kart_orders WHERE order_number = 'ORD-001'),
(SELECT core_mstr_united_kart_food_items_id FROM core_mstr_united_kart_food_items WHERE name = 'Margherita Pizza'),
(SELECT core_mstr_united_kart_food_variants_id FROM core_mstr_united_kart_food_variants WHERE name = 'Medium'),
2, 12.99, 25.98);

-- Insert sample reviews
INSERT INTO core_mstr_united_kart_reviews (order_id, customer_id, restaurant_id, delivery_partner_id, rating, review_text, review_type) VALUES
((SELECT core_mstr_united_kart_orders_id FROM core_mstr_united_kart_orders WHERE order_number = 'ORD-001'),
(SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'customer1@example.com'),
(SELECT core_mstr_united_kart_restaurants_id FROM core_mstr_united_kart_restaurants WHERE name = 'Pizza Paradise'),
(SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'delivery1@example.com'),
5, 'Great service and delicious food!', 'restaurant');

-- Insert sample notifications
INSERT INTO core_mstr_united_kart_notifications (user_id, title, message, notification_type, is_read) VALUES
((SELECT core_mstr_united_kart_users_id FROM core_mstr_united_kart_users WHERE email = 'customer1@example.com'),
'Order Delivered', 'Your order ORD-001 has been delivered successfully!', 'order_update', false);

-- ====================================================================
-- COMPLETION MESSAGE
-- ====================================================================

SELECT 'Dummy data insertion completed successfully!' as status; 