-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT, -- New column added to match schema
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" TEXT NOT NULL,
    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "id" SERIAL NOT NULL,
    "productId" INT NOT NULL,
    "attributeId" INT NOT NULL,
    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductAttribute_unique" UNIQUE ("productId", "attributeId")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "location" VARCHAR(255),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_id_key" ON "Attribute"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_id_key" ON "ProductAttribute"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_id_key" ON "Reviews"("id");

-- Optional: Add an index for `productId` and `attributeId` if queries will frequently use these fields
CREATE INDEX "ProductAttribute_productId_index" ON "ProductAttribute"("productId");
CREATE INDEX "ProductAttribute_attributeId_index" ON "ProductAttribute"("attributeId");
