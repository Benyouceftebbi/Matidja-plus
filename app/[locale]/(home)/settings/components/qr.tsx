/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ImfugvbdxQO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
 "use client"

 import { useState } from "react"
 import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
 import { Dialog, DialogContent } from "@/components/ui/dialog"

 export const Component = ()   => {
   const [selectedQrCode, setSelectedQrCode] = useState(null)
   const handleQrCodeClick = (qrCodeText) => {
     setSelectedQrCode(qrCodeText)
   }
   const handleCloseModal = () => {
     setSelectedQrCode(null)
   }



  const data = [
    { id: "ABC123", qrCode: <CircleCheckIcon/> },
    { id: "XYZ456", qrCode: <CircleCheckIcon/>  },
    { id: "DEF789", qrCode: <CircleCheckIcon/>  },
    { id: "GHI012", qrCode: <CircleCheckIcon/>  },
    { id: "JKL345", qrCode: <CircleCheckIcon/>  },
    { id: "MNO678", qrCode: <CircleCheckIcon/>  },
    { id: "PQR901", qrCode: <CircleCheckIcon/>  },
    { id: "STU234", qrCode: <CircleCheckIcon/>  },
    { id: "VWX567", qrCode: <CircleCheckIcon/>  },
    { id: "YZA890", qrCode: <CircleCheckIcon/>  },
  ]
   return (
    <div className="max-w-6xl mx-auto border rounded-lg shadow-lg">
    
        
    <div className="max-h-[500px] overflow-auto">
   
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] sticky top-0 bg-background">ID</TableHead>
            <TableHead className="sticky top-0 bg-background">QR Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium sticky left-0 bg-background">{item.id}</TableCell>
              <TableCell>
                <button onClick={() => handleQrCodeClick(item.id)}>
                  <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSB71to-QYmZ5u9Lnlf-zstc6CCm-JTfqraA&s'} alt={`QR Code for ${item.id}`} width={100} height={100} className="mx-auto" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    {selectedQrCode && (
      <Dialog open onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl mx-auto">
          <div className="flex justify-center">
          <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSB71to-QYmZ5u9Lnlf-zstc6CCm-JTfqraA&s'}  width={100} height={100} className="mx-auto" />
          </div>
        </DialogContent>
      </Dialog>
    )}
  </div>
   )
 }


 function CircleCheckIcon(props: any) {
    return (
        <svg width="232" height="232" viewBox="0 0 232 232"
             xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsEv="http://www.w3.org/2001/xml-events">
            <rect x="0" y="0" width="232" height="232" fill="#ffffff" />
            <defs>
                <rect id="p" width="8" height="8" />
            </defs>
        </svg>
    );
}
