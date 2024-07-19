import { db } from "@/firebase/firebase-config";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { Teacher, TeacherSchema } from '@/validators/teacher';
import { z } from "zod";

export const addTeacher = async (teacher: Teacher) => {
    try {
        // Add the teacher document to the "Teachers" collection
        const teacherRef = await addDoc(collection(db, "Teachers"), teacher);
        console.log("Teacher added successfully:", teacherRef.id);

        // Initialize an array to hold the group UIDs
        const groupUIDs: string[] = [];

        // Add each subject as a group document in the "Groups" collection
        for (const subject of teacher.classes) {
            const groupRef = await addDoc(collection(db, "Groups"), {
                ...subject,
                teacherUID: teacherRef.id,
            });
            groupUIDs.push(groupRef.id);
        }

        // Update the teacher document with the group UIDs
        await updateDoc(doc(db, "Teachers", teacherRef.id), {
            groupUIDs: groupUIDs,
        });

        return teacherRef.id; // Returning the ID of the added Teacher
    } catch (error) {
        console.error("Error adding Teacher:", error);
        throw error; // Optionally re-throw the error to propagate it further if needed
    }
};

export const updateTeacher = async(updatedteacher:TeacherFormValues,teacherId:string)=>{
    try {
            await updateDoc(doc(db, "Teachers",teacherId), updatedteacher);
        console.log("Teacher updated successfully:");
        return true; // Assuming you want to return the ID of the added Teacher
    } catch (error) {
        console.error("Error updating Teacher:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}
export const deleteTeacher = async(teacherId:string)=>{
    try {
            await deleteDoc(doc(db, "Teachers",teacherId));
        console.log("Teacher deleted successfully:");
        return true; // Assuming you want to return the ID of the added Teacher
    } catch (error) {
        console.error("Error deleting Teacher:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}