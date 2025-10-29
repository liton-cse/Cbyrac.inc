import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ProgressBar from "../../progressBar/ProgressBar";
import { X } from "lucide-react";
export const I9Status = {
  Citizen: "US Citizen",
  NonCitizen: "Noncitizen National",
  Permanent: "Lawful Permanent Resident",
  NonCitizen_Other: "Other Noncitizen",
};

const TempI9Form = ({ prevStep, nextStep, step, setFormData }) => {
  const totalSteps = 12;
  const [preview, setPreview] = useState(null); // State for signature preview

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      lastName: "",
      firstName: "",
      middleInitial: "",
      otherLastName: "",
      address: "",
      dob: "",
      ssn: "",
      employeeEmail: "",
      employeePhone: "",
      citizenship: "",
      uscisNumber: "",
      otherUscis: "",
      i94Number: "",
      passportNumber: "",
      employeeSignature: null,
      signDate: "",
    },
  });

  // Signature handlers
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setPreview(URL.createObjectURL(file));
      setValue("employeeSignature", dataTransfer.files, {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveSignature = () => {
    setPreview(null);
    setValue("employeeSignature", null, { shouldValidate: true });
  };

  // Form submission handler
  const onSubmit = (data) => {
    console.log("form", data);
    const formData = {
      // 🟢 Common fields
      lastName: data.lastName,
      firstName: data.firstName,
      middleName: data.middleInitial,
      otherNames: data.otherLastName,
      address: data.address,
      dateOfBirth: data.dob,
      ssn: data.ssn,
      email: data.employeeEmail,
      phone: data.employeePhone,
      employeeSignature7: data.employeeSignature?.[0] || undefined,
      signatureDate: data.signDate,

      // 🟡 Citizenship status
      status: data.citizenship,

      // 🟣 Conditional fields based on citizenship type
      // ...(data.citizenship === I9Status.Permanent && {
      //   uscisNumber: data.uscisNumber,
      // }),

      // ...(data.citizenship === I9Status.NonCitizen_Other && {
      //   uscisNumber: data.otherUscis,
      //   admissionNumber: data.i94Number,
      //   foreignPassportNumber: data.passportNumber,
      // }),
    };

    // 🟣 Conditionally add extra fields
    if (
      data.citizenship === "Lawful Permanent Resident" ||
      data.citizenship === I9Status.Permanent
    ) {
      formData.uscisNumber = data.uscisNumber;
    }

    if (
      data.citizenship === "Other Noncitizen" ||
      data.citizenship === I9Status.NonCitizen_Other
    ) {
      formData.uscisNumber = data.otherUscis;
      formData.admissionNumber = data.i94Number;
      formData.foreignPassportNumber = data.passportNumber;
    }
    setFormData((prev) => ({
      ...prev,
      i9Form: formData,
    }));
    reset();
    setPreview(null);
    nextStep();
  };

  const inputWrapperClass =
    "rounded-md bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] mt-1 p-[1px]";
  const inputClass =
    "w-full bg-slate-900 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-0";

  const citizenship = watch("citizenship", "");

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex space-x-96 mb-4">
          <div className="text-sm">
            <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
            <div>123 MAIN STREET SUITE 100</div>
            <div>ANYTOWN, STATE 12345</div>
            <div>PHONE: 555-555-5555</div>
            <div>EMAIL: info@cbyrac.com</div>
          </div>
          <div className="w-24 h-24 bg-white rounded flex items-center justify-center">
            <img src="/cbyrac-logo.png" alt="Company Logo" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Employment Eligibility Verification (Form I-9)
          </h1>
          <p className="text-sm text-gray-300 mb-7">
            U.S. Citizenship and Immigration Services
          </p>
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl max-w-7xl mx-auto"
        >
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="mb-1 block text-white">
                Last Name (Family Name) <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-white">
                First Name (Given Name) <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="mb-1 block text-white">
                Middle Initial (if any) <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Middle Initial"
                  {...register("middleInitial", {
                    required: "Middle initial is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.middleInitial && (
                <p className="text-red-500 text-sm">
                  {errors.middleInitial.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-white">
                Other Last Names Used (if any){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Other Last Name"
                  {...register("otherLastName", {
                    required: "Other last name is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.otherLastName && (
                <p className="text-red-500 text-sm">
                  {errors.otherLastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-white">
              Address <span className="text-red-500">*</span>
            </label>
            <div className={inputWrapperClass}>
              <input
                type="text"
                placeholder="Street, City, State, ZIP"
                {...register("address", { required: "Address is required" })}
                className={inputClass}
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1 block text-white">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="date"
                  {...register("dob", {
                    required: "Date of Birth is required",
                  })}
                  className={`${inputClass} py-3.5`}
                />
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-white">
                U.S. Social Security Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter SSN"
                  {...register("ssn", { required: "SSN is required" })}
                  className={inputClass}
                />
              </div>
              {errors.ssn && (
                <p className="text-red-500 text-sm">{errors.ssn.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1 block text-white">
                Employee’s Email Address <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="email"
                  placeholder="Enter Email"
                  {...register("employeeEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={inputClass}
                />
              </div>
              {errors.employeeEmail && (
                <p className="text-red-500 text-sm">
                  {errors.employeeEmail.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-white">
                Employee’s Telephone Number{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className={inputWrapperClass}>
                <input
                  type="tel"
                  placeholder="Enter Phone"
                  {...register("employeePhone", {
                    required: "Phone number is required",
                  })}
                  className={inputClass}
                />
              </div>

              {errors.employeePhone && (
                <p className="text-red-500 text-sm">
                  {errors.employeePhone.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-5 mt-8 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="US Citizen"
                {...register("citizenship", {
                  required: "You must select at least one option",
                })}
                className="w-5 h-5"
              />
              A citizen of the United States
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Noncitizen National"
                {...register("citizenship")}
                className="w-5 h-5"
              />
              A noncitizen national of the United States
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Lawful Permanent Resident"
                {...register("citizenship")}
                className="w-5 h-5"
              />
              A lawful permanent resident (Enter USCIS or A-Number)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Other Noncitizen"
                {...register("citizenship")}
                className="w-5 h-5"
              />
              A noncitizen (Other than Item Numbers 2 and 3 above)
            </label>

            {errors.citizenship && (
              <p className="text-red-500 text-sm">
                {errors.citizenship.message}
              </p>
            )}
          </div>

          {citizenship === "Lawful Permanent Resident" && (
            <div className="w-1/2 mb-4">
              <label className="mb-1 block text-white">
                USCIS A-Number <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter USCIS A-Number"
                  {...register("uscisNumber", {
                    required: "USCIS A-Number is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.uscisNumber && (
                <p className="text-red-500 text-sm">
                  {errors.uscisNumber.message}
                </p>
              )}
            </div>
          )}

          {citizenship === "Other Noncitizen" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="mb-1 block text-white">
                  USCIS A-Number <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Enter USCIS A-Number"
                    {...register("otherUscis", {
                      required: "USCIS A-Number is required",
                    })}
                    className={inputClass}
                  />
                </div>
                {errors.otherUscis && (
                  <p className="text-red-500 text-sm">
                    {errors.otherUscis.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-white">
                  Form I-94 Admission Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Enter I-94 Number"
                    {...register("i94Number", {
                      required: "I-94 Admission Number is required",
                    })}
                    className={inputClass}
                  />
                </div>
                {errors.i94Number && (
                  <p className="text-red-500 text-sm">
                    {errors.i94Number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-white">
                  Foreign Passport Number & Country{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Enter Passport Number"
                    {...register("passportNumber", {
                      required: "Passport Number is required",
                    })}
                    className={inputClass}
                  />
                </div>
                {errors.passportNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.passportNumber.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Signature & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 mb-4">
            <div className="mb-6">
              <label className="block mb-3 text-white">
                Employee Signature <span className="text-red-500">*</span>
              </label>

              {/* Signature Upload */}
              {!preview ? (
                <div className="w-[350px] h-[50px] bg-gradient-to-l from-[#D4BFB2] to-[#8D6851] rounded-md mt-1 flex items-center justify-center">
                  <label className="w-full h-full flex items-center justify-center text-white cursor-pointer">
                    <span className="text-center">Upload Signature</span>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("employeeSignature", {
                        required: "Signature is required",
                        onChange: handleSignatureUpload,
                      })}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-3 relative inline-block">
                  <img
                    src={preview}
                    alt="Signature Preview"
                    className="w-[200px] h-[80px] object-contain border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveSignature}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {errors.employeeSignature && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.employeeSignature.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-white">
                Date <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="date"
                  {...register("signDate", { required: "Date is required" })}
                  className={`${inputClass} py-3.5`}
                />
              </div>
              {errors.signDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.signDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit & Navigation */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Previous
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] text-white rounded-md hover:opacity-90"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TempI9Form;
