CREATE TABLE IF NOT EXISTS booking_inquiries (
  id SERIAL PRIMARY KEY,
  tour_name TEXT,
  hotel_name TEXT,
  guide_name TEXT,
  vehicle_name TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  travelers_details JSONB DEFAULT '[]'::jsonb,
  document_type TEXT,
  document_name TEXT,
  document_data TEXT,
  payment_method TEXT,
  payment_reference TEXT,
  upi_id TEXT,
  binance_pay_id TEXT,
  transport_mode TEXT,
  preferred_timezone TEXT,
  confirmed_at TIMESTAMPTZ,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  travelers INTEGER NOT NULL,
  travel_date TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE booking_inquiries
  ADD COLUMN IF NOT EXISTS hotel_name TEXT,
  ADD COLUMN IF NOT EXISTS guide_name TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_name TEXT,
  ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS travelers_details JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS document_type TEXT,
  ADD COLUMN IF NOT EXISTS document_name TEXT,
  ADD COLUMN IF NOT EXISTS document_data TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS upi_id TEXT,
  ADD COLUMN IF NOT EXISTS binance_pay_id TEXT,
  ADD COLUMN IF NOT EXISTS transport_mode TEXT,
  ADD COLUMN IF NOT EXISTS preferred_timezone TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  style TEXT,
  summary TEXT,
  image TEXT,
  price_per_night NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  region TEXT,
  specialty TEXT,
  summary TEXT,
  image TEXT,
  price_per_day NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  summary TEXT,
  price_per_day NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  best_time TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  weather_info TEXT,
  seasonal_info TEXT,
  travel_tips TEXT,
  transport_info TEXT,
  accommodations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS weather_info TEXT,
  ADD COLUMN IF NOT EXISTS seasonal_info TEXT,
  ADD COLUMN IF NOT EXISTS travel_tips TEXT,
  ADD COLUMN IF NOT EXISTS transport_info TEXT,
  ADD COLUMN IF NOT EXISTS accommodations JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT,
  summary TEXT,
  overview TEXT,
  theme JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  video_url TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tours
  ADD COLUMN IF NOT EXISTS video_url TEXT;

CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  inquiry_id INTEGER NOT NULL REFERENCES booking_inquiries(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  reference TEXT,
  upi_id TEXT,
  binance_pay_id TEXT,
  status TEXT NOT NULL DEFAULT 'demo',
  amount NUMERIC,
  currency TEXT,
  breakdown JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tourist_sites (
  id SERIAL PRIMARY KEY,
  destination_slug TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT,
  details TEXT,
  qr_data TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS charges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'flat',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS price_per_night NUMERIC;

ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS price_per_day NUMERIC;

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS price_per_day NUMERIC;

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS amount NUMERIC,
  ADD COLUMN IF NOT EXISTS currency TEXT,
  ADD COLUMN IF NOT EXISTS breakdown JSONB;
