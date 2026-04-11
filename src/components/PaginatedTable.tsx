import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "#/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

const PAGE_SIZE = 20;

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: PAGE_SIZE } },
	});

	const { pageIndex } = table.getState().pagination;
	const pageCount = table.getPageCount();
	const total = data.length;
	const start = pageIndex * PAGE_SIZE + 1;
	const end = Math.min((pageIndex + 1) * PAGE_SIZE, total);

	return (
		<div>
			<Table className="table-fixed">
				<colgroup>
					{table.getAllColumns().map((col) => (
						<col key={col.id} style={{ width: `${col.getSize()}%` }} />
					))}
				</colgroup>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="border-b border-(--line)">
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="font-semibold text-(--sea-ink)"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-(--line) hover:bg-[rgba(79,184,178,0.06)]"
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="py-12 text-center text-(--sea-ink-soft)"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{pageCount > 1 && (
				<div className="flex items-center justify-between px-4 py-10">
					<p className="text-sm text-(--sea-ink-soft)">
						Showing {start}–{end} of {total}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							← Previous
						</Button>
						<Button
							variant="outline"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next →
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
