"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Button } from "~/components/ui/button"
import { useTheme } from "./ThemeProvider"
 

export function ThemeSwitch() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem] rounded-md bg-white p-1 shadow-md dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer rounded-sm px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer rounded-sm px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer rounded-sm px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
