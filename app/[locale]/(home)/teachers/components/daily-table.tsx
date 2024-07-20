"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar";
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
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { studnetRegistrationSchema } from "@/validators/studentinfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type studentAttandance = {
  id: string;
  name: string;
  group: string;
};

type StudentValues = z.infer<typeof studnetRegistrationSchema> & { id: string; group: string };

export const DailyAtandenceDataTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("1st year");

  const filteredStudents: { [key: string]: studentAttandance[] } = {
    "1st year": [
      { id: "1", name: "John Smith", group: "Group A" },
      { id: "2", name: "Jane Doe", group: "Group B" },
      { id: "3", name: "Mary Johnson", group: "Group A" },
      { id: "4", name: "John Smith", group: "Group A" },
      { id: "5", name: "Jane Doe", group: "Group B" },
      { id: "6", name: "Mary Johnson", group: "Group A" },
      { id: "7", name: "John Smith", group: "Group A" },
      { id: "8", name: "Jane Doe", group: "Group B" },
      { id: "9", name: "Mary Johnson", group: "Group A" },
      { id: "10", name: "John Smith", group: "Group A" },
      { id: "11", name: "Jane Doe", group: "Group B" },
      { id: "12", name: "Mary Johnson", group: "Group A" },
      { id: "13", name: "John Smith", group: "Group A" },
      { id: "14", name: "Jane Doe", group: "Group B" },
      { id: "15", name: "Mary Johnson", group: "Group A" },
      { id: "16", name: "John Smith", group: "Group A" },
      { id: "17", name: "Jane Doe", group: "Group B" },
      { id: "18", name: "Mary Johnson", group: "Group A" },
    ],
    "2nd year": [
      { id: "1", name: "James Brown", group: "Group A" },
      { id: "2", name: "Patricia Davis", group: "Group B" },
      { id: "3", name: "Robert Wilson", group: "Group A" },
    ],
    "3rd year": [
      { id: "1", name: "Linda Martinez", group: "Group B" },
      { id: "2", name: "Michael Garcia", group: "Group A" },
      { id: "3", name: "Elizabeth Lee", group: "Group B" },
    ],
  };

  const columns: ColumnDef<StudentValues>[] = [
    {
      accessorKey: "id",
      header: () => <div>ID</div>,
      cell: ({ row }) => <div className="lowercase hidden sm:table-cell">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="">Student Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "group",
      header: () => <div>Group</div>,
      cell: ({ row }) => <div>{row.getValue("group")}</div>,
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredStudents[selectedLevel],
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
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">SAID YOUCEF</h1>
            <p className="text-muted-foreground">Math Teacher</p>
          </div>
        </div>
        <Input
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
        <div className="text-muted-foreground">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <CalendarDaysIcon className="w-5 h-5" />
                {selectedDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar value={selectedDate} onChange={setSelectedDate} className="p-4" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Tabs defaultValue="1st year" onValueChange={setSelectedLevel}>
        <TabsList>
          <TabsTrigger value="1st year">1st Year</TabsTrigger>
          <TabsTrigger value="2nd year">2nd Year</TabsTrigger>
          <TabsTrigger value="3rd year">3rd Year</TabsTrigger>
        </TabsList>
        <TabsContent value={selectedLevel}>
          <div className="max-h-[350px] overflow-y-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {filteredStudents[selectedLevel]
                  .filter(
                    (student) =>
                      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.id.includes(searchTerm)
                  )
                  .map((student) => (
                    <TableRow key={student.id}>
                      {columns.map((column) => (
                        <TableCell key={column.accessorKey}>
                          {column.cell({ row: { getValue: (key: string | number) => student[key] }, original: student })}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!filteredStudents[selectedLevel].some(
                  (student) =>
                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.id.includes(searchTerm)
                ) && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalendarDaysIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
