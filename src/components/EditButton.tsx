"use client"

import { Button } from "@/components/ui/button"

export default function EditButton({ editable, setEditable }: { editable: boolean, setEditable: (b: boolean) => void }) {
  return (
    <Button variant="outline" onClick={() => setEditable(!editable)}>
      {editable ? "Lock" : "Edit"}
    </Button>
  )
}
