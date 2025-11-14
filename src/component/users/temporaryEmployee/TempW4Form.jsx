import ProgressBar from "../../progressBar/ProgressBar";
import { useState } from "react";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

const TempW4Form = ({ prevStep, nextStep, step, setFormData, preview }) => {
  const totalSteps = 12;

  const [children, setChildren] = useState("");
  const [dependents, setDependents] = useState("");

  // Calculate amounts
  const childrenAmount = (Number(children) || 0) * 2000;
  const dependentsAmount = (Number(dependents) || 0) * 500;
  const totalAmount = childrenAmount + dependentsAmount;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    // watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      signDate: new Date().toISOString().split("T")[0],
    },
  });

  // Handle Next button
  const handleNext = async () => {
    const result = await trigger();
    if (result) {
      const data = getValues();
      const formData = {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        address: data.address,
        ssn: data.ssn,
        maritalStatus: data.maritalStatus,
        signatureDate: data.signDate,
        // Step 3: Dependents
        childrenNo: Number(data.qualifyingChildren) || 0,
        childrenDepencyNo: Number(data.otherDependents) || 0,
        TotalDependencyAmount: totalAmount,

        // Step 4: Other Income
        withHoldAmount: data.otherIncome,
        deductedAmount: data.otherIncome2,
        extraWithHoldingAmount: data.otherIncome3,
        amount: 0, // No desiredSalary in W4
        acceptedTerms: data.twoJobs || false,
      };

      console.log(formData);

      setFormData((prev) => ({
        ...prev,
        w4Form: formData,
      }));
      nextStep();
    } else {
    }
  };

  // Signature handlers

  const handleRemoveSignature = () => {
    setPreview(null);
    setValue("employeeSignature", null, { shouldValidate: true });
  };

  const inputWrapperClass =
    "rounded-md bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] mt-1 p-[1px]";
  const inputClass =
    "w-full bg-slate-900 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-0";

  return (
    <div>
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
            <div className="w-24 h-24 bg-white rounded justify-center">
              <img src="/cbyrac-logo.png" alt="Company Logo" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Employee Withholding Certificate (Form W-4)
            </h1>
            <p className="text-sm text-gray-300 mb-7">
              Your Withholding is subject to review by the IRS
            </p>
            <ProgressBar currentStep={step} totalSteps={totalSteps} />
          </div>

          {/* Step 1 Info */}
          <p className="text-[32px] font-bold mt-8">Step 1:</p>
          <div className="border-2 w-32 mb-5"></div>
          <form onSubmit={handleNext} className="rounded-2xl max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-white mb-2  block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    {...register("firstName", {
                      required: "Full name is required",
                    })}
                    className={inputClass}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-white mb-2 block">Middle Name</label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Enter Middle Name"
                    {...register("middleName", {})}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-white mb-2 block">
                  Last Name <span className="text-red-500">*</span>
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
            </div>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-white mb-1 block">
                  SSN <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="333-22-4444"
                    {...register("ssn", {
                      required: "SSN is required",
                      pattern: {
                        value: /^\d{3}-\d{2}-\d{4}$/,
                        message: "Use XXX-XX-XXXX format",
                      },
                    })}
                    className={inputClass}
                    maxLength={11}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length > 3) v = v.slice(0, 3) + "-" + v.slice(3);
                      if (v.length > 6)
                        v = v.slice(0, 6) + "-" + v.slice(6, 10);
                      e.target.value = v;
                    }}
                  />
                </div>
                {errors.ssn && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ssn.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-white mb-2  block">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="City, State, ZIP"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className={inputClass}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-white mb-2  block">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <select
                    {...register("maritalStatus", {
                      required: "Marital status is required",
                    })}
                    className={`${inputClass} bg-[#05051A]`}
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="marriedSeparate">
                      Married Filing Separately
                    </option>
                  </select>
                </div>
                {errors.maritalStatus && (
                  <p className="text-red-500 text-sm">
                    {errors.maritalStatus.message}
                  </p>
                )}
              </div>
            </div>
            {/* Step 2 Info */}
            <p className="text-[32px] font-bold mt-8">Step 2:</p>
            <div className="border-2 w-32 mb-5"></div>
            <p className="text-lg mb-4">
              Complete this step if you (1) hold more than one job at a time, or
              (2) are married filing jointly and your spouse also works. The
              correct amount of withholding depends on income earned from all of
              these jobs.
            </p>
            <p className="text-lg mb-4">
              Do only one of the following - (a) Use the estimator at
              www.irs.gov/W4App for the most accurate withholding for this step
              (and Steps 3–4). If you or your spouse have self-employment
              income, use this option; or
            </p>
            <p className="text-lg mb-4">
              (b) Use the Multiple Jobs Worksheet on page 3 and enter the result
              in Step 4(c) below; or
            </p>
            <p className="text-lg mb-4">
              (c) If there are only two jobs total, you may check this box. Do
              the same on Form W-4 for the other job. This option is generally
              more accurate than (b) if pay at the lower-paying job is more than
              half of the pay at the higher-paying job. Otherwise, (b) is more
              accurate.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("twoJobs", {
                  required: "You must agree if applicable",
                })}
                className="w-5 h-5"
              />
              Agree With Above Conditions
            </label>
            {errors.twoJobs && (
              <p className="text-red-500 text-sm">{errors.twoJobs.message}</p>
            )}

            {/* Step 3 Info */}
            <p className="text-[32px] font-bold mt-8">Step 3:</p>
            <div className="border-2 w-32 mb-5"></div>

            {/* Qualifying Children */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-white mb-1 block">
                  Qualifying Children (under 17){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <Controller
                    name="qualifyingChildren"
                    control={control}
                    rules={{
                      required: "Required",
                      min: { value: 0, message: "No negative" },
                    }}
                    render={({ field }) => (
                      <input
                        type="number"
                        placeholder="0"
                        value={children}
                        onChange={(e) => {
                          const val = e.target.value;
                          setChildren(val);
                          field.onChange(val ? Number(val) : "");
                        }}
                        className={inputClass}
                      />
                    )}
                  />
                </div>
                {errors.qualifyingChildren && (
                  <p className="text-red-500 text-sm">
                    {errors.qualifyingChildren.message}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <p className="bg-gray-800 p-2 rounded w-full text-center">
                  ${childrenAmount}
                </p>
              </div>
            </div>

            {/* Other Dependents */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-white mb-1 block">
                  Other Dependents
                </label>
                <div className={inputWrapperClass}>
                  <Controller
                    name="otherDependents"
                    control={control}
                    rules={{ min: { value: 0, message: "No negative" } }}
                    render={({ field }) => (
                      <input
                        type="number"
                        placeholder="0"
                        value={dependents}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDependents(val);
                          field.onChange(val ? Number(val) : "");
                        }}
                        className={inputClass}
                      />
                    )}
                  />
                </div>
                {errors.otherDependents && (
                  <p className="text-red-500 text-sm">
                    {errors.otherDependents.message}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <p className="bg-gray-800 p-2 rounded w-full text-center">
                  ${dependentsAmount}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-white mb-1 block">Total Credit</label>
                <p className="bg-green-700 p-2 rounded font-semibold text-center">
                  ${totalAmount}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <p className="text-[32px] font-bold mt-8">Step 4:</p>
            <div className="border-2 w-32 mb-5"></div>
            <p className="mb-4">
              Other income (interest, dividends, etc.) not from jobs:
            </p>

            {["otherIncome", "otherIncome2", "otherIncome3"].map((name, i) => (
              <div
                key={name}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
              >
                <div>
                  <label className="text-white mb-1 block">
                    Amount {i + 1}
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="number"
                      placeholder="0"
                      {...register(name, {
                        min: { value: 0, message: "No negative" },
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors[name] && (
                    <p className="text-red-500 text-sm">
                      {errors[name].message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Employee Signature and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mb-4">
              <div>
                <label className="block mb-2">
                  Employee Signature <span className="text-red-500">*</span>
                </label>

                {preview && (
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
                  <p className="text-red-500 text-sm">
                    {errors.employeeSignature.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2  block">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="date"
                    {...register("signDate", { required: "Date is required" })}
                    className={`py-3.5 ${inputClass}`}
                  />
                </div>
                {errors.signDate && (
                  <p className="text-red-500 text-sm">
                    {errors.signDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-6 gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleSubmit(handleNext)}
                className="px-6 py-2 bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] text-white rounded-md hover:opacity-90"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TempW4Form;
