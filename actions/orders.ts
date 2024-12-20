"use server"

import {prisma} from "@/prisma/connection"

export async function userOrderExists(email: string, productId: string) {
  return (
    (await prisma.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}
