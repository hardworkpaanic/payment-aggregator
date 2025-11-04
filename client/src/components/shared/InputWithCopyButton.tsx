import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";

export function InputWithCopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copy, setCopy] = useState("");

  return (
    <div className="flex items-end space-x-2">
      <div className="flex gap-1 flex-col w-full">
        <Label className="text-[13px]">{label}</Label>
        <Input value={value} disabled readOnly />
      </div>
      <Button variant="outline" size="icon" onClick={() => setCopy(value)}>
        {copy.length ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
