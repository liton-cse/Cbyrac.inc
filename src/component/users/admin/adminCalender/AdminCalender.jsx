import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FileText, ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { uploadCalendarEntry } from "../../../../redux/feature/calendar/calendarSlice";
import toast from "react-hot-toast";

const AdminCalender = () => {
  // upload file states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB

  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    return "other";
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Allowed: JPG, PNG, PDF");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit");
      return false;
    }

    setError("");
    return true;
  };

  const handleFiles = (files) => {
    if (!files) return;

    const newFiles = [];

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        const fileType = getFileType(file);
        const uploadedFile = {
          file,
          preview: "",
          type: fileType,
        };

        newFiles.push(uploadedFile);

        if (fileType === "image") {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.file === file ? { ...f, preview: e.target.result } : f
              )
            );
          };
          reader.readAsDataURL(file);
        }
      }
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="w-6 h-6" />;
      case "pdf":
        return <FileText className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  // ✅ Updated submit handler to pass FormData properly
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((uploadedFile) => {
      formData.append("image", uploadedFile.file); // append each file
    });
    // dispatch Redux action
    const result = await dispatch(uploadCalendarEntry(formData));
    if (uploadCalendarEntry.fulfilled.match(result)) {
      setLoading(false);
    }
    toast.success("calender submitted successfully 🍾");
    setUploadedFiles("");
  };

  return (
    <div className="">
      <div className="flex space-x-[450px] mb-2 text-white">
        <div className="text-sm">
          <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
          <div>123 MAIN STREET SUITE 100</div>
          <div>ANYTOWN, STATE 12345</div>
          <div>PHONE: 555-555-5555</div>
          <div>EMAIL: info@cbyrac.com</div>
        </div>
        <div className="w-24 h-24 bg-white rounded justify-center">
          <img src="/cbyrac-logo.png" alt="" />
        </div>
      </div>
      <p className="text-white text-3xl font-semibold text-center mb-14">
        CBYRAC, Inc 2025 Payroll Calendar
      </p>
      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-7xl mx-auto mt-12 mb-12">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-3 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-amber-600 bg-amber-500/5"
                : "border-amber-500/40"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                <Upload className="w-10 h-10 text-amber-600" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Upload Documents
                </h2>
                <p className="text-gray-400 mb-6">
                  Drag and drop files here, or browse
                </p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="!bg-[#946344] hover:bg-amber-700 !text-white !px-9 !py-5 rounded-lg font-semibold"
              >
                Choose File
              </Button>

              <p className="text-sm text-gray-400">
                Supports JPG, PNG, PDF up to 10MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="relative border border-white rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow"
                  >
                    {uploadedFile.type === "image" && uploadedFile.preview && (
                      <div className="relative w-full h-48 bg-muted">
                        <img
                          src={uploadedFile.preview || "/placeholder.svg"}
                          alt={uploadedFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {uploadedFile.type !== "image" && (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <div className="text-center text-white">
                          {getFileIcon(uploadedFile.type)}
                          <p className="text-xs text-white mt-2">
                            {uploadedFile.type === "pdf"
                              ? "PDF Document"
                              : "File"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 border-t border border-white">
                      <p className="text-sm font-medium text-foreground truncate text-white">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground text-white">
                        {(uploadedFile.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-20 py-3.5 bg-[#946344] text-white text-xl font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}

              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCalender;

// ///////////////////////
// import React, { useState } from "react";
// import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
// import { Dialog } from "@headlessui/react";

// const months = Array.from({ length: 12 }, (_, i) => i); // 0-11 months

// const AdminCalender = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const [bgColor, setBgColor] = useState("#A9D08F"); // default green
//   const [textColor, setTextColor] = useState("#919191");
//   const [type, setType] = useState("Pay Day");

//   const [dateStyles, setDateStyles] = useState({});
//   const [year, setYear] = useState(2025); // current year state

//   const openModal = (date) => {
//     setSelectedDate(date);
//     setIsOpen(true);
//   };

//   const handleSave = () => {
//     if (selectedDate) {
//       const key = format(selectedDate, "yyyy-MM-dd");

//       setDateStyles((prev) => ({
//         ...prev,
//         [key]: { bgColor, textColor, type },
//       }));
//     }
//     setIsOpen(false);
//   };

//   return (
//     <div className="">
//       <div className="flex space-x-[450px] mb-2 text-white">
//         <div className="text-sm">
//           <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
//           <div>123 MAIN STREET SUITE 100</div>
//           <div>ANYTOWN, STATE 12345</div>
//           <div>PHONE: 555-555-5555</div>
//           <div>EMAIL: info@cbyrac.com</div>
//         </div>
//         <div className="w-24 h-24 bg-white rounded justify-center">
//           <img src="/cbyrac-logo.png" alt="" />
//         </div>
//       </div>
//       <p className="text-white text-3xl font-semibold text-center mb-14">
//         CBYRAC, Inc 2025 Payroll Calendar
//       </p>
//       {/* Year Switching */}
//       <div className="flex justify-center items-center gap-4 mb-10">
//         <button
//           onClick={() => setYear((prev) => prev - 1)}
//           className="px-5 py-3 font-semibold text-white rounded-lg
//                bg-white/20 backdrop-blur-md border border-white/30
//                hover:bg-white/30 transition"
//         >
//           ← Prev
//         </button>

//         <h1 className="text-3xl font-bold text-white">{year}</h1>

//         <button
//           onClick={() => setYear((prev) => prev + 1)}
//           className="px-5 py-3 font-semibold text-white rounded-lg
//                bg-white/20 backdrop-blur-md border border-white/30
//                hover:bg-white/30 transition"
//         >
//           Next →
//         </button>
//       </div>

//       {/* Calendar */}
//       <div className="grid grid-cols-3 gap-6">
//         {months.map((month) => {
//           const start = startOfMonth(new Date(year, month));
//           const end = endOfMonth(new Date(year, month));
//           const days = eachDayOfInterval({ start, end });
//           const paddingDays = start.getDay();

//           return (
//             <div key={month} className="bg-white rounded-xl shadow p-4">
//               <h2 className="text-center font-bold text-lg mb-2">
//                 {format(start, "MMMM yyyy")}
//               </h2>
//               <div className="grid grid-cols-7 text-center font-semibold text-gray-600">
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                   <div key={d}>{d}</div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-7 text-center">
//                 {Array.from({ length: paddingDays }).map((_, i) => (
//                   <div key={`pad-${i}`} />
//                 ))}
//                 {days.map((day) => {
//                   const key = format(day, "yyyy-MM-dd");
//                   const style = dateStyles[key];

//                   return (
//                     <button
//                       key={day}
//                       onClick={() => openModal(day)}
//                       className="p-2 m-1 rounded-full transition w-10 h-10 flex items-center justify-center"
//                       style={{
//                         backgroundColor: style?.bgColor || "transparent",
//                         color: style?.textColor || "black",
//                       }}
//                     >
//                       {format(day, "d")}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className=" mt-10">
//         <div className="space-y-4">
//           {/* Friday - Pay Day */}
//           <div className="flex items-center space-x-4">
//             <div className="w-20 h-10 bg-green-300"></div>
//             <span className="text-white text-xl font-semibold">
//               Friday - Pay Day
//             </span>
//           </div>

//           {/* Every Sunday Is Weekending */}
//           <div className="flex items-center space-x-4">
//             <div className="w-20 h-10 bg-red-500"></div>
//             <span className="text-white text-xl font-semibold">
//               Every Sunday Is Weekending
//             </span>
//           </div>

//           {/* Pay Period */}
//           <div className="flex items-center space-x-4">
//             <div className="w-20 h-10 bg-gray-400"></div>
//             <span className="text-white text-xl font-semibold">Pay Period</span>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       <Dialog
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="relative z-50"
//       >
//         <div
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm"
//           aria-hidden="true"
//         />

//         <div className="fixed inset-0 flex items-center justify-center p-6">
//           <Dialog.Panel
//             className="mx-auto w-[450px] h-[500px] rounded-2xl
//                        bg-white/50 backdrop-blur-lg border border-white/30
//                        p-8 shadow-lg"
//           >
//             <Dialog.Title className="text-xl font-bold mb-4 text-black">
//               Edit Date: {selectedDate ? format(selectedDate, "PPP") : ""}
//             </Dialog.Title>

//             {/* Background color picker (Only One Selectable) */}
//             <div className="mb-6">
//               <label className="block mb-2 font-medium text-black">
//                 Background Color
//               </label>
//               <div className="flex gap-6">
//                 {/* Green Option */}
//                 <div
//                   className={`w-14 h-14 rounded-full cursor-pointer border-4 ${
//                     bgColor === "#A9D08F"
//                       ? "border-blue-500"
//                       : "border-transparent"
//                   }`}
//                   style={{ backgroundColor: "#A9D08F" }}
//                   onClick={() => setBgColor("#A9D08F")}
//                 />
//                 {/* Red Option */}
//                 <div
//                   className={`w-14 h-14 rounded-full cursor-pointer border-4 ${
//                     bgColor === "#F04D23"
//                       ? "border-blue-500"
//                       : "border-transparent"
//                   }`}
//                   style={{ backgroundColor: "#F04D23" }}
//                   onClick={() => setBgColor("#F04D23")}
//                 />
//               </div>
//             </div>

//             {/* Text color picker */}
//             <div className="mb-6">
//               <label className="block mb-2 font-medium text-black">
//                 Text Color
//               </label>
//               <div
//                 className={`w-14 h-14 rounded-full cursor-pointer border-4 ${
//                   textColor === "#000000"
//                     ? "border-blue-500"
//                     : "border-transparent"
//                 }`}
//                 style={{ backgroundColor: "#000000" }}
//                 onClick={() => setTextColor("#000000")}
//               />
//             </div>

//             {/* Dropdown */}
//             <div className="mb-6">
//               <label className="block mb-2 font-medium text-black">Type</label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="border-2 border-white rounded p-2 w-full bg-white/20 text-black backdrop-blur-md"
//               >
//                 <option>Pay Day</option>
//                 <option>Weekending</option>
//                 <option>Pay Period</option>
//               </select>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="px-4 py-2 rounded bg-white/20 text-black border border-white/30
//                  backdrop-blur-md hover:bg-white/30 transition"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
//               >
//                 Save
//               </button>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminCalender;
