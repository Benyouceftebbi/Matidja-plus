

import * as React from "react"
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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
} from "@tanstack/react-table"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { File } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {exportTableToExcel} from '@/components/excelExport'
import SheetDemo from "./editTeacher"
import { Teacher }  from "@/validators/teacher";
import { useData } from "@/context/admin/fetchDataContext";
import { z } from "zod"
import { useTranslations } from "next-intl"
import { deleteTeacher } from "@/lib/hooks/students"
import TeacherForm from "./teacherForm"
import TeacherPaymentSheet from "./teacherPaymentSheet"
import EditTeacher from "./editTeacher"
import {AtandenceDataModel} from './attandance-report'
type Status = 'accepted' | 'pending' | 'rejected';
export type TeacherSummary = {
  id: string;
  teacher: string;
  status: Status;
  Subject: string;
  joiningDate: string;
  salary: number;

};
interface DataTableDemoProps {
  filter: string;
}
  export const DataTableDemo: React.FC<DataTableDemoProps> = ({ filter }) => {
    const [open,setOpen]=React.useState(false)
    const [openCard, setOpenCard] = React.useState(false)
    const [openPayment,setOpenPayment]=React.useState(false)
    const t=useTranslations()
    const {teachers,setTeachers}=useData()
    console.table(teachers);
    

    
    const [teacher,setTeacher]=React.useState<Teacher>({  
      id: '123456',
      level: 'Intermediate',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      address: '123 Main St',
      city: 'Anytown',
      state: 'State',
      postalCode: '12345',
      country: 'Country',
      parentFullName: 'Jane Doe',
      parentFirstName: 'Jane',
      parentLastName: 'Doe',
      parentEmail: 'jane.doe@example.com',
      parentPhone: '123-456-7890',
      parentId: '654321',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '987-654-3210',
      medicalConditions: null,
      status: 'Active',
      joiningDate: new Date(),
      registrationStatus: 'Registered',
      startDate: new Date(),
      lastPaymentDate: new Date(),
      nextPaymentDate: new Date(),
      totalAmount: 1000,
      amountLeftToPay: 500,
      class: "S",
      registrationAndInsuranceFee:"Paid",
      feedingFee:"Paid"
    })
      // Define your table and set up filtering
  React.useEffect(() => {
         
    if (filter === "All") {
      table.resetColumnFilters()
    } else {
      table.getColumn("level")?.setFilterValue(filter);
    } 
  }, [filter]); 
    const openEditSheet = (tudent:Teacher) => {
      setTeacher(teacher)
      setOpen(true); // Open the sheet after setting the level
    };
    const openAttendanceCard = (tudent:Teacher) => {
      setTeacher(teacher)
      setOpenCard(true); // Open the sheet after setting the level
    };
    const openPaymentSheet = (teacher:Teacher) => {
      setTeacher(teacher)
      setOpenPayment(true); // Open the sheet after setting the level
    };
    const getMonthAbbreviation = (monthIndex: number) => {
      const startDate = new Date(2024, 8); // September 2023 (month index 8)
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + monthIndex);
      const monthAbbreviation = date.toLocaleString('en-GB', { month: "short" });
      const yearAbbreviation = date.getFullYear().toString().substr(-2);
      return `${monthAbbreviation}${yearAbbreviation}`;
    };


  
    
    const columns: ColumnDef<any>[] = [
      {
        accessorKey: "name",
        header: () => <div >{t('teacher')}</div>,
  
        cell: ({ row }) => (
          <div className="capitalize">
             <div className="font-medium">{row.getValue("name")}</div>
          </div>
        ),
      },
      {
        accessorKey: "year",
        header: () => <div style={{ whiteSpace: 'pre-wrap' }}>year</div>,
        cell: ({ row }) => <div>{row.getValue("year")}</div>,
      },
      {
        accessorKey: "field",
        header: () => <div>Field</div>,
        cell: ({ row }) => {
          const classes = row.original.classes || [];
          const streams = classes.flatMap((classItem: any) => classItem.stream || []);
          const uniqueStreams = Array.from(new Set(streams)).sort();
  
          return (
            <div className="text-sm text-muted-foreground">
              {uniqueStreams.length > 0 ? uniqueStreams.join(', ') : 'No streams available'}
            </div>
          );
        }
      },
      {
        accessorKey: "phone",
        header: () => <div >Phone</div>,
        cell: ({ row }) => <div>{row.original.phoneNumber}</div>,
      },
      {
        accessorKey: "educational-subject",
        header: () => <div >Educational Subject</div>,
        cell: ({ row }) => <div>{row.getValue("educational-subject")}</div>,
      },
      {
        id: "classes",
        header: () => <div>Classes</div>,
        cell: ({ row }) => {
          const classes = row.original.classes;

      return (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
  {classes.map((classItem: any, index: number) => (
    <div key={index} style={{ maxWidth: '200px', marginBottom: '5px' }}>
      <div className="font-medium">{classItem.subject}</div>
      <div className="text-sm text-muted-foreground">
        <div>{classItem.day}</div>
        <div>{classItem.start} -> {classItem.end}</div>
      </div>
    </div>
  ))}
</div>
      );
        }
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const teacher = row.original;
    
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <DotsHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditSheet(teacher)}>
                  {t('edit')} </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAttendanceCard(teacher)}>
                  {t('Attandance')} </DropdownMenuItem>


                <DropdownMenuItem onClick={() =>{deleteTeacher(teacher.id), setTeachers((prevTeachers:any) =>
      prevTeachers.filter((std:any) => std.id !== teacher.id)
    )}}>
          {t('delete')} </DropdownMenuItem>
         

              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

  const handleExport = () => {
  

    
const orderedMonths = [
  'Sept23', 'Oct23', 'Nov23', 'Dec23',
  'Jan24', 'Feb24', 'Mar24', 'Apr24',
  'May24', 'Jun24', 'Jul24','Aug24'
];
    const exceldata=teachers.map((teacher:any)=>({[`${t('Name')}`]:teacher.teacher,
    [`${t('level')}`]:teacher.level,
    [`${t('class')}`]:teacher.class,
    [`${t('status')}`]:t(teacher.status),
    [`${t('joining-date-0')}`]:teacher.joiningDate,
    ...orderedMonths.reduce((acc: Record<string, string>, month: string) => {
      const monthStatus = teacher.monthlyPayments23_24[month]?.status;
      acc[`${month}`] = t(monthStatus);
      return acc;
    }, {}),
    [t('registrationAndInsuranceFee')]:t(teacher.registrationAndInsuranceFee),
    [t('feedingFee')]:t(teacher.feedingFee),
    [`${t('amount-left')}`]: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(teacher.amountLeftToPay),
    [`${t('total-amount-0')}`]: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(teacher.totalAmount),

    }))
    exportTableToExcel(t('teachers-table'),exceldata);
  };
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
    
  const table = useReactTable({
    data:teachers,
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
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  })

  return (
    <>



    <Card x-chunk="dashboard-05-chunk-3" className="mt-2 ">
    <CardHeader className="px-7">
      <CardTitle>{t('your-teachers')}</CardTitle>
      <CardDescription>
      {t('introducing-our-dynamic-teacher-dashboard-for-seamless-management-and-insightful-analysis')} 
      
      <div className="flex items-center justify-between">
       
    
    <Input
          placeholder={t('filter-teacher')}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mt-4"
        />
          <div className=" ml-auto space-y-4 ">
            <TeacherForm/>
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('columns')} <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(column.id)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="ml-2"  
        
    onClick={handleExport}>
       {t('export')} <File className="ml-2 h-4 w-4" />
      </Button>
    </div>
 
    </div>
      </CardDescription>
    </CardHeader>
    <CardContent>     

 
    <ScrollArea style={{ width: 'calc(100vw - 170px)'}}>
        <Table id="teachers-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('no-results')} </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} {t('row-s-selected')}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')} </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')} </Button>
        </div>
      </div>
      <EditTeacher open={open} setOpen={setOpen}  teacher={teacher}/>
      <AtandenceDataModel open={openCard} setOpen={setOpenCard}  teacher={teacher}/>
    </CardContent>
  </Card>


  </>
  )
}