import { useMemo, useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/admin/fetchDataContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type StudentAttendance = {
  id: string;
  name: string;
  status: string;
  index: number;
  group: string;
};

const getStatusIcon = (status: string) => {
  return status === "present" ? "✔️" : "❌";
};

// Generate date columns dynamically
const generateDateColumns = (dates: string[]) => {
  return dates.map(date => ({
    accessorKey: date,
    header: () => <div>{date}</div>,
    cell: ({ row }) => <div>{getStatusIcon(row.getValue(date))}</div>,
  }));
};

const transformData = (data: any) => {
  if (data && data.attendance) {
    const { attendance } = data;
    const attendanceMap: { [key: string]: { [key: string]: string, index?: number, group?: string } } = {};

    for (const [date, details] of Object.entries(attendance)) {
      const { attendanceList } = details;
      attendanceList.forEach(({ name, status, index, group }) => {
        if (!attendanceMap[name]) {
          attendanceMap[name] = { index, group };
        }
        attendanceMap[name][date] = status;
      });
    }

    const rowData = Object.keys(attendanceMap).map(name => ({
      id: data.id,
      name,
      ...attendanceMap[name]
    }));

    return rowData;
  }
  return [];
};

export const ArchiveDataTable = ({ teacher }) => {
  const { classes } = useData();

  const [filter, setFilter] = useState(teacher.year[0]);

  // Filter classes based on teacherUID and subject
  const filteredClasses = useMemo(() => {
    return classes?.filter((cls) => cls.teacherUID === teacher.id && `{.educational-subject}`=== `{teacher.educational-subject}`);
  }, [classes, teacher.id, `{teacher.educational-subject}`]);

  // Select class based on the filter (year)
  const selectedClass = useMemo(() => {
    return filteredClasses?.find((cls) => cls.year === filter);
  }, [filteredClasses, filter]);

  // Debugging outputs
  useEffect(() => {
    console.log("Classes:", classes);
    console.log("Filtered Classes:", filteredClasses);
    console.log("Selected Class:", selectedClass);
  }, [classes, filteredClasses, selectedClass]);

  // If selectedClass is undefined, log debug information
  if (!selectedClass) {
    console.log("Selected Class is undefined. Debug info:");
    console.log("Teacher ID:", teacher.id);
    console.log("Teacher Subject:", `{teacher.educational-subject}`);
    console.log("Filter Year:", filter);
    console.log("Filtered Classes after applying teacher ID and subject:", filteredClasses);
  }

  // Transform data for table display
  const transformedData = useMemo(() => transformData(selectedClass), [selectedClass]);

  const dates = selectedClass ? Object.keys(selectedClass.attendance) : [];

  const baseColumns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: () => <div>Index</div>,
      cell: ({ row }) => <div>{row.getValue("index")}</div>,
    },
    {
      accessorKey: "group",
      header: () => <div>Group</div>,
      cell: ({ row }) => <div>{row.getValue("group")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div>Student Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
  ];

  const dateColumns = generateDateColumns(dates);
  const columns: ColumnDef<any>[] = [...baseColumns, ...dateColumns];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: transformedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 3,
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Archive Attendance</h1>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Popover>
            <PopoverTrigger asChild></PopoverTrigger>
            <PopoverContent className="p-0"></PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator className="my-8" />
      <div>
        <Tabs defaultValue={teacher.year[0]}>
          <div className="flex items-center">
            <TabsList>
              {teacher.year.map((level) => (
                <TabsTrigger key={level} value={level} onClick={() => setFilter(level)}>
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">List</h2>
          <Input
            placeholder="Filter"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm "
          />
          <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
            <DownloadIcon className="w-5 h-5" />
            Export
          </Button>
        </div>
        {dates.length > 0 ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>No attendance available yet</div>
        )}
      </div>
    </div>
  );
};

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"/>
  );  
  }