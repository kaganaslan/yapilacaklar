-- Items tablosu
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  note TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Photos tablosu (her item'a birden fazla foto eklenebilir)
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  date_label TEXT NOT NULL, -- "08.04.26" formatında
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Realtime aktif et
ALTER PUBLICATION supabase_realtime ADD TABLE items;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) - şimdilik açık bırak, sadece ikilisi kullanacak
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Herkese izin ver (basit uygulama, auth yok)
CREATE POLICY "Allow all on items" ON items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on photos" ON photos FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket
-- (Bu SQL ile olmaz, Supabase Dashboard'dan "polaroids" adında public bucket oluşturulacak)
