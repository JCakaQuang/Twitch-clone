"use client";

import { toast } from "sonner";
import { useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
  field: FieldTypes;
  value: boolean;
  label: string;
}

export const ToggleCard = ({
  label,
  field,
  value = false,
}: ToggleCardProps) => {
  const [isPending, startTransition] = useTransition();
  const onChange = async () => {
    startTransition(() => {
      updateStream({
        [field]: !value,
      })
        .then(() => {
          toast.success(`Chat Settings Updated!`);
        })
        .catch(() => {
          toast.error("Failed to update chat");
        });
    });
  };
  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex justify-between items-center">
        <p className="shrink-0 font-semibold">{label}</p>
        <div className="space-y-4">
          <Switch
            disabled={isPending}
            onCheckedChange={onChange}
            checked={value}
          >
            {value ? "On" : "Off"}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export const ToggleCardSkeleton = () => {
  return <Skeleton className="rounded-xl p-10 w-full" />;
};