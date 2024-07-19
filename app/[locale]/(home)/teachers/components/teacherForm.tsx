"use client"
import React, { useState, useRef } from 'react';
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dayjs from 'dayjs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/stepper"
import { Button } from "@/components/ui/button"
import {Camera} from "react-camera-pro";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Teacher, TeacherSchema } from '@/validators/teacher';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CalendarDatePicker from './date-picker';
import { Separator } from '@/components/ui/separator';
import QRCode from 'qrcode'
import { addTeacher } from '@/lib/hooks/teachers';
import { LoadingButton } from '@/components/ui/loadingButton';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UseFormReturn } from 'react-hook-form';
import Dayselection from './time-day-select'
import { TeacherSummary } from './table';
import { useData } from "@/context/admin/fetchDataContext";

interface FooterProps {
  formData: Teacher;
  form: UseFormReturn<any>; // Use the specific form type if available
  isSubmitting: boolean;
  reset: UseFormReturn<any>['reset']; // Adding reset function from useForm
}




const steps = [
  { label: "Step 1" },
  { label: "Step 2" },

] satisfies StepItem[]
export default function TeacherForm() {


  const form = useForm<any>({
   
  });
  const { reset,formState, setValue, getValues,control,watch} = form;
  const { isSubmitting } = formState;
  const { fields, append:appendClass,remove:removeClass, } = useFieldArray({
    control: form.control,
    name: "classes",

  });
  

  

  const handleGroupChange = (index: number, field: 'day'|'name' | 'id' | 'subject' | 'time' | 'quota' |"start"|"end" |"stream" , value: string |  number) => {
   
    
    const classes = [...getValues('classes')]; // Get the current prices array
    console.log('abdooooo',classes[index]);
    
    if (field === 'stream'){
    
    if (classes[index].stream.includes(value)) {
      classes[index].stream.filter(item => item !== value);
    } else {
      classes[index].stream.push(value);
    }
  }
  else {
    classes[index][field] = value;
  }
  
    setValue('classes',classes);

    
  
    // Assuming other logic here for setting ID based on subject, name, and time
   
  };

 

const [selectedFields, setSelectedFields] = useState([]);
console.log('zaks',selectedFields);

  

const handleFieldToggle = (field) => {
  if (selectedFields.includes(field)) {
    setSelectedFields(prevSelected => prevSelected.filter(f => f !== field));
  } else {
    setSelectedFields(prevSelected => [...prevSelected, field]);
  }
};

const subjects = [
  "Select Option",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "History",
  "Philosophy",
  "Arabic",
  "French",
  "English",
  "Islamic Education",
  "Technology",
  "Computer Science",
  "Art",
  "Physical Education",
  "Economics",
  "German",
  "Spanish",
  "Law",
  "Business Studies",
  "Social Sciences",
  "Engineering",
  "Architecture",
  "Environmental Science"
];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button >Create Teacher</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px]">
      <Form {...form} >
      <form >
        <DialogHeader>
          <DialogTitle>Add Teacher</DialogTitle>
          <DialogDescription>
            Add your Teacher here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-4">

      <Stepper initialStep={0} steps={steps} >

        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <div className="h-[450px] flex items-center justify-center my-4 border bg-secondary  rounded-md">
              {index === 0 ? (
 
  <div className="grid gap-4 py-4">

    <FormField
                  
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl><Input id="name"  className="col-span-3"  {...field}/></FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />


    <FormField
              control={control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Birthdate</FormLabel>
                  <FormControl>  
                    <CalendarDatePicker
            {...field}
            date={getValues("birthdate")}
            className="col-span-3"
            setDate={(selectedValue) => {
              if (selectedValue === undefined) {
                // Handle undefined case if needed
              } else {
                form.setValue('birthdate', selectedValue);
              }
            }}
          /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


    
   

<FormField
  control={control}
  name="year"
  render={({ field }) => (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel className="text-right">Year</FormLabel>
      <FormControl>
        <select id="year" className="col-span-3" style={{ height: '38px' ,borderRadius: '5px',
            borderWidth: '0.5px',
            borderStyle: 'solid',
            paddingLeft: '5px',
            borderColor: '#0000001a'}} {...field}>
          <option value="">Select Option</option>
          <option value="1AM">1AM</option>
          <option value="2AM">2AM</option>
          <option value="3AM">3AM</option>
          <option value="4AM">4AM</option>
          <option value="1AS">1AS</option>
          <option value="2AS">2AS</option>
          <option value="3AS">3AS</option>
        </select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>




<FormField
  control={control}
  name="educational-subject"
  render={({ field }) => (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel className="text-right">Educational Subject</FormLabel>
      <FormControl>
        <select
          id="education-subject"
         className="col-span-3" style={{ height: '38px' ,borderRadius: '5px',
            borderWidth: '0.5px',
            borderStyle: 'solid',
            paddingLeft: '5px',
            borderColor: '#0000001a'}} {...field}>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
    


  

    <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Phone Number</FormLabel>
                  <FormControl><Input id="phoneNumber" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

         


    
  </div>

) : (
  <div className="w-full h-full">
   <Table>
  <TableCaption>
  <Button type='button' size="sm" variant="ghost" className="gap-1 w-full" onClick={() => appendClass({ day: '', start: '', end: '', quota: 0, stream: [] })}>
      <PlusCircle className="h-3.5 w-3.5" />
      Add Group
    </Button>
  </TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Day</TableHead>
      <TableHead>Start Time</TableHead>
      <TableHead>End Time</TableHead>
      <TableHead>Quota</TableHead>
      <TableHead>Field</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {fields.map((group, index) => (
      <TableRow key={group.id}>
        <TableCell className="font-medium">
          <Select value={group.day} onValueChange={(value: string) => handleGroupChange(index, 'day', value)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select a Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Days</SelectLabel>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="font-medium">
          <Input type="time" value={group.start} onChange={(e) => handleGroupChange(index, 'start', e.target.value)} />
        </TableCell>
        <TableCell className="font-medium">
          <Input type="time" value={group.end} onChange={(e) => handleGroupChange(index, 'end', e.target.value)} />
        </TableCell>
       
        <TableCell className="font-big">
          <Input type="number" value={group.quota} onChange={(e) => handleGroupChange(index,'quota', parseInt(e.target.value))} />
        </TableCell>
        <TableCell className="font-medium">
        <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
        Select Fields <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {['Scientific Stream', 'Literature and Philosophy', 'Literature and Languages', 'Economics', 'Mathematics and Technology', 'Mathematics'].map(e => (
        <DropdownMenuItem
          key={e}
          value={e}
          className={`flex items-center ${group.stream.includes(e) ? 'selected' : ''}`}
          onClick={() => handleGroupChange(index, 'stream', e) } 
          
        >
          <span className="mr-2">{e}</span>
          {group.stream.includes(e) && <CheckIcon className="h-4 w-4 text-green-500" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
        <TableCell>
          <Button type="button" variant="destructive" onClick={() => removeClass(index)}>Remove</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


</div>
)}
              </div>
            </Step>
          )
        })}
        <Footer formData={getValues()} form={form} isSubmitting={isSubmitting} reset={reset}/>

      </Stepper>

    </div>
    </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}

const Footer: React.FC<FooterProps> = ({ formData, form, isSubmitting,reset}) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()
  
  const  {setTeachers}= useData()


  const onSubmit = async(data:Teacher) => {
    const teacherId = await addTeacher(data)
    nextStep()
    setTeachers((prev: Teacher[]) => [...prev, data]);
  };


  return (
    <>
      {hasCompletedAllSteps && (
      <div className="flex items-center justify-center">
      <div className="rounded-md bg-green-50 p-6 w-full max-w-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CircleCheckIcon className="h-7 w-7 text-green-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-green-800">Teacher Created Successfully</h3>
          
          </div>
        </div>
      </div>
    </div>
    
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
                 <DialogFooter>
                     <DialogClose asChild>
         
          
          </DialogClose>
               </DialogFooter>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
              type='button'
            >
              Prev
            </Button>
            {isLastStep?(        <LoadingButton size="sm"    loading={isSubmitting}        type={'submit'}   onClick={form.handleSubmit(onSubmit)}>
              Finish
            </LoadingButton>):(        <Button size="sm"            type={"button"}    onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>)}
    
          </>
        )}
      </div>
    </>
  )

        }

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
          )
        }


        function CircleCheckIcon(props) {
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
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          )
        }
        