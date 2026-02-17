INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin', 'admin@app.com', '$2a$10$9YNfyVeLig8EuNQcf7PkN.dhrGWiW3o9yVZFj5sWDcdjY65KNLFLe', 'admin'),
  ('Ramesh Thapa', 'tashi.tshomo@bob.bt', '$2a$10$9YNfyVeLig8EuNQcf7PkN.dhrGWiW3o9yVZFj5sWDcdjY65KNLFLe', 'user'),
  ('Maya Lhamo', 'maya@example.com', '$2a$10$9YNfyVeLig8EuNQcf7PkN.dhrGWiW3o9yVZFj5sWDcdjY65KNLFLe', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tours (slug, title, duration_days, difficulty, summary, overview, theme, image, video_url, itinerary, inclusions, exclusions, faq)
VALUES
  (
    'happiness-heritage',
    'Happiness & Heritage',
    7,
    'easy',
    $$Thimphu, Punakha, and Paro with heritage walks and dzong festivals.$$, 
    $$A gentle cultural journey through Bhutan's iconic valleys, temples, and festivals.$$, 
    '["culture","festival"]'::jsonb,
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    '[{"day":"Day 1","title":"Arrive in Paro","detail":"Welcome dinner and valley walk."},{"day":"Day 2","title":"Thimphu highlights","detail":"Buddha Dordenma and market visit."}]'::jsonb,
    '["Visa processing","Private guide","Boutique stays"]'::jsonb,
    '["Flights","Insurance"]'::jsonb,
    '[{"question":"Is the hike optional?","answer":"Yes, alternatives are available."}]'::jsonb
  ),
  (
    'himalayan-slow-trail',
    'Himalayan Slow Trail',
    10,
    'moderate',
    $$Gentle pace through Bumthang, Gangtey, and Phobjikha Valley.$$, 
    $$Designed for mindful travelers who want longer stays and wellness experiences.$$, 
    '["wellness","culture"]'::jsonb,
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    '[{"day":"Day 1","title":"Arrive in Paro","detail":"Settle into a valley lodge."},{"day":"Day 2","title":"Gangtey retreat","detail":"Forest tea ceremony and meditation."}]'::jsonb,
    '["Visa processing","Wellness sessions"]'::jsonb,
    '["Flights","Insurance"]'::jsonb,
    '[{"question":"Is this suitable for seniors?","answer":"Yes, the pace is gentle."}]'::jsonb
  ),
  (
    'hidden-kingdom-trek',
    'Hidden Kingdom Trek',
    12,
    'challenging',
    $$High ridge trails, yak herder camps, and alpine passes.$$, 
    $$A guided trekking experience with highland communities and panoramic ridgelines.$$, 
    '["trekking"]'::jsonb,
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    '[{"day":"Day 1","title":"Arrive in Paro","detail":"Equipment check and briefing."},{"day":"Day 2","title":"Acclimatization hike","detail":"Short monastery walk."}]'::jsonb,
    '["Guide team","Camp meals","Permits"]'::jsonb,
    '["Flights","Insurance"]'::jsonb,
    '[{"question":"Is porter support available?","answer":"Yes, we arrange porters and pack horses."}]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO guides (slug, name, region, specialty, summary, image, price_per_day)
VALUES
  (
    'tenzin-dorji',
    'Tenzin Dorji',
    'Paro & Thimphu',
    'Culture & heritage',
    $$Expert in monastery history and festival traditions.$$, 
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    120
  ),
  (
    'karma-wangmo',
    'Karma Wangmo',
    'Punakha & Gangtey',
    'Wellness & slow travel',
    $$Focuses on mindful pacing, retreats, and nature walks.$$, 
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80',
    140
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hotels (slug, name, location, style, summary, image, price_per_night)
VALUES
  (
    'paro-cliffside-lodge',
    'Paro Cliffside Lodge',
    'Paro',
    'Boutique',
    $$Himalayan sunrise decks and quiet valley views.$$, 
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    220
  ),
  (
    'punakha-riverside-retreat',
    'Punakha Riverside Retreat',
    'Punakha',
    'Riverside',
    $$Warm climate, river walks, and garden suites.$$, 
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    180
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO destinations (slug, name, best_time, description, highlights, image, weather_info, seasonal_info, travel_tips, transport_info, accommodations)
VALUES
  (
    'thimphu',
    'Thimphu',
    'March–May, September–November',
    $$Bhutan's capital blends modern cafes with sacred monasteries.$$, 
    '["Weekend market","Buddha Dordenma","National Museum"]'::jsonb,
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    $$Cool mornings with sunny afternoons.$$, 
    $$Spring festivals and autumn clarity.$$,
    $$Dress modestly at monasteries.$$,
    $$Road transfers from Paro (1.5 hrs).$$,
    '["Thimphu City Suites","Zhiwa Ling"]'::jsonb
  ),
  (
    'paro',
    'Paro',
    'March–May, October–December',
    $$Serene valley of rice fields and temples, gateway to iconic sites.$$, 
    $$["Tiger's Nest","Kyichu Lhakhang","Riverside farm stays"]$$::jsonb,
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    $$Fresh alpine air with cool evenings.$$, 
    $$Autumn skies ideal for hikes.$$,
    $$Start hikes early to avoid clouds.$$,
    $$Paro airport is the main entry point.$$,
    '["Paro Cliffside Lodge","Uma Paro"]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (slug, name, capacity, summary, price_per_day)
VALUES
  ('luxury-suv', 'Luxury SUV', 4, $$Comfortable for mountain roads with panoramic windows.$$, 160),
  ('executive-van', 'Executive Van', 8, $$Ideal for small groups with extra luggage space.$$, 200),
  ('hybrid-sedan', 'Hybrid Sedan', 3, $$Eco-friendly option for couples and solo travelers.$$, 120)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO charges (name, type, amount, unit, active)
VALUES
  ('Tourism sustainability fee', 'fee', 100, 'per_day', true),
  ('Permit processing', 'permit', 75, 'flat', true),
  ('Service fee', 'service', 45, 'flat', true)
ON CONFLICT DO NOTHING;

INSERT INTO tourist_sites (destination_slug, slug, name, summary, details, qr_data, image)
VALUES
  ('paro', 'tigers-nest', 'Tiger’s Nest Monastery', $$Cliffside monastery pilgrimage.$$,
   $$The most iconic monastery in Bhutan, perched on a cliff at 3,120m.$$,
   'https://example.com/destinations/paro/sites/tigers-nest',
   'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'),
  ('punakha', 'punakha-dzong', 'Punakha Dzong', $$Riverside fortress.$$, 
   $$Historic dzong at the confluence of two rivers.$$,
   'https://example.com/destinations/punakha/sites/punakha-dzong',
   'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO booking_inquiries
  (tour_name, hotel_name, guide_name, vehicle_name, user_id, status, travelers_details, name, email, travelers, travel_date, notes, preferred_timezone, payment_method, payment_reference)
VALUES
  (
    'Happiness & Heritage',
    'Paro Cliffside Lodge',
    'Tenzin Dorji',
    'Luxury SUV',
    (SELECT id FROM users WHERE email = 'tashi.tshomo@bob.bt' LIMIT 1),
    'confirmed',
    '[{"fullName":"Ramesh Thapa","age":"36","gender":"male","nationality":"Bhutan"}]'::jsonb,
    'Ramesh Thapa',
    'tashi.tshomo@bob.bt',
    2,
    'May 2026',
    'Looking forward to the festival.',
    'Asia/Thimphu',
    'stripe',
    'Demo-Stripe-1234'
  )
ON CONFLICT DO NOTHING;

INSERT INTO payments (inquiry_id, method, reference, status, amount, currency, breakdown)
SELECT
  bi.id,
  'stripe',
  'Demo-Stripe-1234',
  'paid',
  1800,
  'USD',
  '[{"label":"Hotel","amount":440},{"label":"Guide","amount":840},{"label":"Vehicle","amount":520}]'::jsonb
FROM booking_inquiries bi
WHERE bi.email = 'tashi.tshomo@bob.bt' AND bi.tour_name = 'Happiness & Heritage'
ON CONFLICT DO NOTHING;

INSERT INTO email_logs (recipient, subject, body, status)
VALUES
  ('tashi.tshomo@bob.bt', 'Welcome to Maya Bliss Tours', 'Seeded welcome email.', 'sent'),
  ('maya@example.com', 'Trip planning resources', 'Seeded planning tips.', 'sent')
ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscribers (email)
VALUES
  ('tashi.tshomo@bob.bt'),
  ('maya@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO reviews (user_id, target_type, target_slug, rating, comment)
SELECT id, 'tour', 'happiness-heritage', 5, 'Incredible cultural immersion.'
FROM users WHERE email = 'maya@example.com'
ON CONFLICT DO NOTHING;
