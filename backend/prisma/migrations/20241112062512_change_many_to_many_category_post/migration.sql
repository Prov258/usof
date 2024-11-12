/*
  Warnings:

  - You are about to drop the `_category_post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_category_post" DROP CONSTRAINT "_category_post_A_fkey";

-- DropForeignKey
ALTER TABLE "_category_post" DROP CONSTRAINT "_category_post_B_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar" DROP DEFAULT;

-- DropTable
DROP TABLE "_category_post";

-- CreateTable
CREATE TABLE "category_post" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "category_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_post_post_id_category_id_key" ON "category_post"("post_id", "category_id");

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
