"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import TacticBoard from "@/app/tactic-board/components/TacticBoard"


export function TacticBoardDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent >
        <div className="mx-auto w-full max-w-sm">
          <div className="p-4 pb-0 h-full">
			<TacticBoard />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
