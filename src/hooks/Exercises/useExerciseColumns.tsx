import type { ColumnDef } from "@tanstack/react-table";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import { Button } from "#/components/ui/button";
import { LevelChip } from "../../components/Exercises/LevelChip";
import type { Exercise } from "../../components/Exercises/types";

export function useExerciseColumns(
	selected: Exercise | null,
	setSelected: Dispatch<SetStateAction<Exercise | null>>,
): ColumnDef<Exercise>[] {
	return useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				size: 40,
				cell: ({ row }) => (
					<span className="truncate font-medium text-(--sea-ink)">
						{row.original.name}
					</span>
				),
			},
			{
				accessorKey: "category",
				header: "Category",
				size: 13,
				cell: ({ row }) => (
					<span className="truncate capitalize text-(--sea-ink-soft)">
						{row.original.category}
					</span>
				),
			},
			{
				accessorKey: "level",
				header: "Level",
				size: 14,
				cell: ({ row }) => <LevelChip level={row.original.level} />,
			},
			{
				accessorKey: "equipment",
				header: "Equipment",
				size: 16,
				cell: ({ row }) => (
					<span className="truncate capitalize text-(--sea-ink-soft)">
						{row.original.equipment ?? "—"}
					</span>
				),
			},
			{
				accessorKey: "primaryMuscles",
				header: "Primary Muscles",
				size: 17,
				cell: ({ row }) => (
					<span className="truncate capitalize text-(--sea-ink-soft)">
						{row.original.primaryMuscles.join(", ")}
					</span>
				),
			},
			{
				id: "actions",
				size: 4,
				cell: ({ row }) => (
					<Button
						size="sm"
						variant="ghost"
						onClick={() =>
							setSelected((prev) =>
								prev?.id === row.original.id ? null : row.original,
							)
						}
						className={
							selected?.id === row.original.id ? "text-(--lagoon-deep)" : ""
						}
					>
						{selected?.id === row.original.id ? "Close" : "View"}
					</Button>
				),
			},
		],
		[selected, setSelected],
	);
}
