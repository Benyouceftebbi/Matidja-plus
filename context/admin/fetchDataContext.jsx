"use client"
import React, { createContext, useState,useContext,useEffect} from 'react';
import { getDocs,collection,query,where,orderBy,getDoc, doc} from 'firebase/firestore';
import { db } from "@/firebase/firebase-config"
import {subDays } from "date-fns"

export const AppContext = createContext();

// Create the provider component
export const  FetchDataProvider = ({ children }) => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30), // 30 days ago
    to: new Date(), // Today's date
  });
  const [profile, setProfile] = useState([]);
  const [levels, setLevels] = useState([]);
  const [parents,setParents]=useState([])
  const [students,setStudents]=useState([]);
  const [teachers,setTeachers]=useState([]);
  const [classes,setClasses]=useState([])
  const [invoices,setInvoices]=useState({})
  const [analytics,setAnalytics]=useState({})
  const [teachersSalary,setTeachersSalary]=useState([]);
  const [payouts,setPayouts]=useState([]);
  useEffect(()=>{
    const getAnalytics=async()=>{
      try {
        const PayoutsSnapshot = await getDoc(doc(db, "Billing","analytics"));
        const otherPayoutsSnapShot= await getDoc(doc(db, "Billing","payouts"));
      
        
     
       
     
          //console.table(parentsData);
        setAnalytics({...PayoutsSnapshot.data(),...otherPayoutsSnapShot.data()})
      } catch (error) {
        console.error('Error fetching Payouts:', error);
      }
    };
    getAnalytics()
  },[])

  useEffect(() => {
    const getPayouts = async () => {
      try {
        const PayoutsSnapshot = await getDocs(
          query(
            collection(db, "Billing", "payouts", "Payout"),
            where("paymentDate", ">=", date.from),
            where("paymentDate", "<=", date.to)
          )
        );
  
        const PayoutsData = PayoutsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          paymentDate: new Date(doc.data().paymentDate.toDate()),
          payment: doc.id,
          value: doc.id,
          label: doc.id
        }));
  
        setPayouts(PayoutsData);
      } catch (error) {
        console.error('Error fetching Payouts:', error);
      }
    };
  
    getPayouts();
  }, [date]);
  useEffect(() => {
    const getTeachersSalary = async () => {
      try {
        const teachersSalarySnapshot = await getDocs(
          query(
            collection(db, "Billing", "payouts", "TeachersTransactions"),
            where("salaryDate", ">=", date.from),
            where("salaryDate", "<=", date.to)
          )
        );
  
        const TeachersSalaryData = teachersSalarySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          salaryDate: new Date(doc.data().salaryDate.toDate()),
          value: doc.id,
          label: doc.id,
          teacherSalary: doc.id
        }));
  
        setTeachersSalary(TeachersSalaryData);
      } catch (error) {
        console.error('Error fetching Teachers:', error);
      }
    };
  
    getTeachersSalary();
  }, [date]);
  useEffect(() => {
    const getInvoices = async () => {
      try {
        const invoicesSnapshot = await getDocs(
          query(
            collection(db, 'Billing', "payments", "Invoices"),
            where("paymentDate", ">=", date.from),
            where("paymentDate", "<=", date.to)
          )
        );
  
        const invoicesData = invoicesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          value: doc.id,
          label: doc.id,
          invoice: doc.id,
          paymentDate: new Date(doc.data().paymentDate.toDate())
        }));
  
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching Invoices:', error);
      }
    };
  
    getInvoices();
  }, [date]);
  useEffect(()=>{
    const getClasses = async () => {
      try {
        // Fetch the documents from the 'Groups' collection
        const groupsSnapshot = await getDocs(collection(db, 'Groups'));
        
        // Create an array to store the classes data
        const classesData = [];
    
        // Loop through each group document
        for (const groupDoc of groupsSnapshot.docs) {
          const groupId = groupDoc.id;
          const groupData = groupDoc.data();
          
          // Retrieve the attendance subcollection
          const attendanceSnapshot = await getDocs(collection(db, `Groups/${groupId}/Attendance`));
          
          // Create an object to store the attendance data with document ID as the key
          const attendanceData = attendanceSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {...doc.data(),id:doc.id};
            return acc;
          }, {});
    
          // Add the group data and attendance data to the classesData array
          classesData.push({
            id: groupId,
            ...groupData,
            attendance: attendanceData,
          });
        }
        const teachersSnapshot = await getDocs(collection(db, 'Teachers'));
      
        const TeachersData = teachersSnapshot.docs.map((doc) => ({ ...doc.data(),
           id: doc.id,
           birthdate: new Date(doc.data().birthdate.toDate()),
           teacher: `${doc.data().name}`,

           phoneNumber: doc.data().phoneNumber,
           year: doc.data().year
          


          
           }))     
     
           const studentSnapshot = await getDocs(collection(db, 'Students'));
      
           const StudentsData = studentSnapshot.docs.map((doc) => {
            const student = {
              ...doc.data(),
              id: doc.id,
              birthdate: new Date(doc.data().birthdate.toDate()),
              student: `${doc.data().name}`,
              value: `${doc.data().name}`,
              label: `${doc.data().name}`,
            };
          
            // Calculate the result for each student
            const result = student.classesUIDs.flatMap(cls => {
              // Find the class details for the current class ID
              const classDetail = classesData.find(clss => clss.id === cls.id);
          
              if (!classDetail) return []; // If class detail is not found, skip this entry
          
              // Find the student details within the class
              const studentDetail = classDetail.students.find(std => std.id === student.id);
          
              if (!studentDetail) return []; // If student detail is not found, skip this entry
          
              // Find the group details within the class
              const groupDetail = classDetail.groups.find(grp => grp.group === cls.group);
          
              if (!groupDetail) return []; // If group detail is not found, skip this entry
          
              // Construct the result object
              return {
                cs: studentDetail.cs,
                day: groupDetail.day,
                end: groupDetail.end,
                start: groupDetail.start,
                group: groupDetail.group,
                id: cls.id,
                index: studentDetail.index,
                name: classDetail.teacherName,
                subject: classDetail.subject,
                time: `"${groupDetail.day},${groupDetail.start}-${groupDetail.end}"`
              };
            });
          
            // Add the result to the student object
            return {
              ...student,
              classes: result
            };
          });
        
        setStudents(StudentsData)
        setTeachers(TeachersData)
        setClasses(classesData);
    
      } catch (error) {
        console.error('Error fetching Groups and Attendance:', error);
      }
    };
getClasses()
  },[])


  useEffect(() => {
    const getLevels = async () => {
      try {
        const levelsSnapshot = await getDocs(collection(db, 'Levels'));
      
        const levelsData = levelsSnapshot.docs.map((doc) => ({ ...doc.data(),
           value:doc.data().level,
           label:doc.data().level,
           id: doc.id,
           start:new Date(doc.data().start.toDate()),
           end:new Date(doc.data().end.toDate()),
           registrationDeadline:new Date(doc.data().registrationDeadline.toDate())}));
   
        setLevels(levelsData);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };
    const getParents = async () => {
      try {
        const parentsSnapshot = await getDocs(collection(db, 'Parents'));
      
        const parentsData = parentsSnapshot.docs.map((doc) => ({ ...doc.data(),
           id: doc.id,
           dateOfBirth:new Date(doc.data().dateOfBirth.toDate()),
           parent: `${doc.data().firstName} ${doc.data().lastName}`,
           value: `${doc.data().firstName} ${doc.data().lastName}`,
           label: `${doc.data().firstName} ${doc.data().lastName}`,

          }))
       
        setParents(parentsData)
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };
    getLevels();
    getParents();
  }, []);
  useEffect(() => { 
    const getProfile = async () => {
      try {
        const profileSnapshot = await getDoc(doc(db, 'Profile','GeneralInformation'));
      
        
           
        setProfile({...profileSnapshot.data(),id:profileSnapshot.id})
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    getProfile();
  }, []);
  return (
    <AppContext.Provider value={{levels,setLevels,setParents,parents,profile,setProfile,students,setStudents,teachers,setTeachers,classes,setClasses,invoices,setInvoices,analytics,setAnalytics,teachersSalary,setTeachersSalary,payouts,setPayouts,date,setDate}}>
      {children}
    </AppContext.Provider>
  );
};
export const  useData =()=>{


 
    const value=useContext(AppContext)
    try{
    if(!value){
        throw new Error("Error not wrapped inside layout  ",)
    }   }catch(e){
        console.log(e);
    }
    return value
}
