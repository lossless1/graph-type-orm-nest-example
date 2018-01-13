-- Table: brands
CREATE TABLE IF NOT EXISTS "brands" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,

  "name" VARCHAR(80) NOT NULL,
  "website" VARCHAR(80) NOT NULL,
  "create_date" TIMESTAMP NOT NULL,
  "update_date" TIMESTAMP NOT NULL
);
